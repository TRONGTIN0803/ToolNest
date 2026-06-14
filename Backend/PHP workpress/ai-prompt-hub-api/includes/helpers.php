<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_get_prompt_meta(int $post_id, string $key)
{
    if (function_exists('get_field')) {
        $acf_value = get_field($key, $post_id);
        if ($acf_value !== null && $acf_value !== false && $acf_value !== '') {
            return $acf_value;
        }
    }

    return get_post_meta($post_id, $key, true);
}

function aiph_format_prompt(WP_Post $post): array
{
    $categories = wp_get_post_terms($post->ID, 'prompt_category');
    $tags = wp_get_post_terms($post->ID, 'prompt_tag');

    return [
        'id' => $post->ID,
        'title' => get_the_title($post),
        'slug' => $post->post_name,
        'description' => aiph_get_prompt_meta($post->ID, 'short_description') ?: get_the_excerpt($post),
        'promptContent' => aiph_get_prompt_meta($post->ID, 'prompt_content') ?: $post->post_content,
        'useCase' => aiph_get_prompt_meta($post->ID, 'use_case'),
        'aiTool' => aiph_get_prompt_meta($post->ID, 'ai_tool'),
        'difficulty' => aiph_get_prompt_meta($post->ID, 'difficulty'),
        'estimatedTimeSaved' => aiph_get_prompt_meta($post->ID, 'estimated_time_saved'),
        'exampleOutput' => aiph_get_prompt_meta($post->ID, 'example_output'),
        'isFeatured' => (bool) aiph_get_prompt_meta($post->ID, 'is_featured'),
        'affiliateCtaText' => aiph_get_prompt_meta($post->ID, 'affiliate_cta_text'),
        'affiliateUrl' => aiph_get_prompt_meta($post->ID, 'affiliate_url'),
        'category' => !empty($categories) && !is_wp_error($categories) ? $categories[0]->name : null,
        'categorySlug' => !empty($categories) && !is_wp_error($categories) ? $categories[0]->slug : null,
        'tags' => !empty($tags) && !is_wp_error($tags) ? array_map(fn($tag) => $tag->name, $tags) : [],
        'createdAt' => get_the_date('c', $post),
    ];
}

function aiph_format_category(WP_Term $term): array
{
    return [
        'id' => $term->term_id,
        'name' => $term->name,
        'slug' => $term->slug,
        'description' => $term->description,
        'icon' => get_term_meta($term->term_id, 'icon', true),
        'count' => $term->count,
    ];
}

function aiph_format_blog_post(WP_Post $post): array
{
    return [
        'id' => $post->ID,
        'title' => get_the_title($post),
        'slug' => $post->post_name,
        'excerpt' => get_the_excerpt($post),
        'content' => apply_filters('the_content', $post->post_content),
        'featuredImage' => get_the_post_thumbnail_url($post, 'large') ?: null,
        'author' => get_the_author_meta('display_name', $post->post_author),
        'createdAt' => get_the_date('c', $post),
        'categories' => wp_get_post_terms($post->ID, 'category', ['fields' => 'names']),
        'tags' => wp_get_post_terms($post->ID, 'post_tag', ['fields' => 'names']),
    ];
}
