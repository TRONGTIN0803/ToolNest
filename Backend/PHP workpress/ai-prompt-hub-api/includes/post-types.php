<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_register_prompt_post_type(): void
{
    register_post_type('prompt', [
        'labels' => [
            'name' => 'Prompts',
            'singular_name' => 'Prompt',
            'add_new_item' => 'Add New Prompt',
            'edit_item' => 'Edit Prompt',
        ],
        'public' => true,
        'show_in_rest' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'prompts'],
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-format-chat',
    ]);
}

add_action('init', 'aiph_register_prompt_post_type');
