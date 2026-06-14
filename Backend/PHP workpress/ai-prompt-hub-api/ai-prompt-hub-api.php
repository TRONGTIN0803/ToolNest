<?php
/**
 * Plugin Name: AI Prompt Hub API
 * Description: Custom post types, taxonomies, meta fields, seed content, and REST API for AI Prompt Hub.
 * Version: 1.0.0
 * Author: Trong Tin
 */

if (!defined('ABSPATH')) {
    exit;
}

define('AIPH_PATH', plugin_dir_path(__FILE__));

require_once AIPH_PATH . 'includes/post-types.php';
require_once AIPH_PATH . 'includes/taxonomies.php';
require_once AIPH_PATH . 'includes/meta-fields.php';
require_once AIPH_PATH . 'includes/helpers.php';
require_once AIPH_PATH . 'includes/rest-routes.php';
require_once AIPH_PATH . 'includes/seed-content.php';

register_activation_hook(__FILE__, 'aiph_activate_plugin');

function aiph_activate_plugin(): void
{
    aiph_register_prompt_post_type();
    aiph_register_prompt_taxonomies();
    aiph_register_prompt_meta_fields();
    aiph_seed_content();
    flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
