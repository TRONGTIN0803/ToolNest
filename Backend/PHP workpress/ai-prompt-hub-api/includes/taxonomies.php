<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_register_prompt_taxonomies(): void
{
    register_taxonomy('prompt_category', ['prompt'], [
        'labels' => [
            'name' => 'Prompt Categories',
            'singular_name' => 'Prompt Category',
        ],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'prompt-category'],
    ]);

    register_taxonomy('prompt_tag', ['prompt'], [
        'labels' => [
            'name' => 'Prompt Tags',
            'singular_name' => 'Prompt Tag',
        ],
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'prompt-tag'],
    ]);
}

add_action('init', 'aiph_register_prompt_taxonomies');
