<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_prompt_meta_schema(): array
{
    return [
        'prompt_content' => 'textarea',
        'short_description' => 'textarea',
        'use_case' => 'textarea',
        'ai_tool' => 'text',
        'difficulty' => 'text',
        'estimated_time_saved' => 'text',
        'example_output' => 'textarea',
        'is_featured' => 'boolean',
        'affiliate_cta_text' => 'text',
        'affiliate_url' => 'url',
    ];
}

function aiph_register_prompt_meta_fields(): void
{
    foreach (aiph_prompt_meta_schema() as $field => $type) {
        register_post_meta('prompt', $field, [
            'single' => true,
            'show_in_rest' => true,
            'type' => $type === 'boolean' ? 'boolean' : 'string',
            'sanitize_callback' => $type === 'url' ? 'esc_url_raw' : 'sanitize_textarea_field',
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
}

add_action('init', 'aiph_register_prompt_meta_fields');

function aiph_add_prompt_meta_box(): void
{
    add_meta_box(
        'aiph_prompt_details',
        'Prompt Details',
        'aiph_render_prompt_meta_box',
        'prompt',
        'normal',
        'high'
    );
}

add_action('add_meta_boxes', 'aiph_add_prompt_meta_box');

function aiph_render_prompt_meta_box(WP_Post $post): void
{
    wp_nonce_field('aiph_save_prompt_meta', 'aiph_prompt_meta_nonce');

    foreach (aiph_prompt_meta_schema() as $field => $type) {
        $value = get_post_meta($post->ID, $field, true);
        $label = ucwords(str_replace('_', ' ', $field));

        echo '<p><label for="' . esc_attr($field) . '"><strong>' . esc_html($label) . '</strong></label></p>';

        if ($type === 'textarea') {
            echo '<textarea id="' . esc_attr($field) . '" name="' . esc_attr($field) . '" rows="5" style="width:100%;">' . esc_textarea($value) . '</textarea>';
        } elseif ($type === 'boolean') {
            echo '<label><input type="checkbox" id="' . esc_attr($field) . '" name="' . esc_attr($field) . '" value="1" ' . checked($value, '1', false) . '> Featured prompt</label>';
        } else {
            echo '<input id="' . esc_attr($field) . '" name="' . esc_attr($field) . '" type="text" style="width:100%;" value="' . esc_attr($value) . '">';
        }
    }
}

function aiph_save_prompt_meta(int $post_id): void
{
    if (!isset($_POST['aiph_prompt_meta_nonce']) || !wp_verify_nonce($_POST['aiph_prompt_meta_nonce'], 'aiph_save_prompt_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    foreach (aiph_prompt_meta_schema() as $field => $type) {
        if ($type === 'boolean') {
            update_post_meta($post_id, $field, isset($_POST[$field]) ? '1' : '0');
            continue;
        }

        $raw = isset($_POST[$field]) ? wp_unslash($_POST[$field]) : '';
        $value = $type === 'url' ? esc_url_raw($raw) : sanitize_textarea_field($raw);
        update_post_meta($post_id, $field, $value);
    }
}

add_action('save_post_prompt', 'aiph_save_prompt_meta');
