<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_allow_local_cors(): void
{
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}

add_action('init', 'aiph_allow_local_cors');

function aiph_register_rest_routes(): void
{
    register_rest_route('aiph/v1', '/prompts', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_prompts',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/prompts/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_prompt_by_slug',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/categories', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_categories',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/categories/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_category_by_slug',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/search', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_search_prompts',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/posts', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_blog_posts',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('aiph/v1', '/posts/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'aiph_get_blog_post_by_slug',
        'permission_callback' => '__return_true',
    ]);
}

add_action('rest_api_init', 'aiph_register_rest_routes');

function aiph_get_prompts(WP_REST_Request $request): WP_REST_Response
{
    $args = [
        'post_type' => 'prompt',
        'post_status' => 'publish',
        'posts_per_page' => min((int) ($request->get_param('per_page') ?: 12), 50),
    ];

    $search = sanitize_text_field((string) $request->get_param('search'));
    if ($search !== '') {
        $args['s'] = $search;
    }

    $category = sanitize_title((string) $request->get_param('category'));
    if ($category !== '') {
        $args['tax_query'] = [[
            'taxonomy' => 'prompt_category',
            'field' => 'slug',
            'terms' => $category,
        ]];
    }

    $query = new WP_Query($args);
    $data = array_map('aiph_format_prompt', $query->posts);

    return rest_ensure_response($data);
}

function aiph_get_prompt_by_slug(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request['slug']);
    $query = new WP_Query([
        'post_type' => 'prompt',
        'name' => $slug,
        'post_status' => 'publish',
        'posts_per_page' => 1,
    ]);

    if (!$query->have_posts()) {
        return new WP_Error('not_found', 'Prompt not found', ['status' => 404]);
    }

    return rest_ensure_response(aiph_format_prompt($query->posts[0]));
}

function aiph_get_categories(): WP_REST_Response
{
    $terms = get_terms([
        'taxonomy' => 'prompt_category',
        'hide_empty' => false,
    ]);

    if (is_wp_error($terms)) {
        return rest_ensure_response([]);
    }

    return rest_ensure_response(array_map('aiph_format_category', $terms));
}

function aiph_get_category_by_slug(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request['slug']);
    $term = get_term_by('slug', $slug, 'prompt_category');

    if (!$term || is_wp_error($term)) {
        return new WP_Error('not_found', 'Category not found', ['status' => 404]);
    }

    return rest_ensure_response(aiph_format_category($term));
}

function aiph_search_prompts(WP_REST_Request $request): WP_REST_Response
{
    $request->set_param('search', sanitize_text_field((string) $request->get_param('keyword')));
    return aiph_get_prompts($request);
}

function aiph_get_blog_posts(WP_REST_Request $request): WP_REST_Response
{
    $query = new WP_Query([
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => min((int) ($request->get_param('per_page') ?: 10), 50),
    ]);

    return rest_ensure_response(array_map('aiph_format_blog_post', $query->posts));
}

function aiph_get_blog_post_by_slug(WP_REST_Request $request)
{
    $slug = sanitize_title((string) $request['slug']);
    $query = new WP_Query([
        'post_type' => 'post',
        'name' => $slug,
        'post_status' => 'publish',
        'posts_per_page' => 1,
    ]);

    if (!$query->have_posts()) {
        return new WP_Error('not_found', 'Post not found', ['status' => 404]);
    }

    return rest_ensure_response(aiph_format_blog_post($query->posts[0]));
}
