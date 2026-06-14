<?php

define('WP_INSTALLING', true);

$wpRoot = 'C:/xampp/htdocs/ai-prompt-hub';

require_once $wpRoot . '/wp-load.php';
require_once $wpRoot . '/wp-admin/includes/upgrade.php';
require_once $wpRoot . '/wp-admin/includes/plugin.php';

$siteUrl = 'http://localhost/ai-prompt-hub';
$adminUser = 'admin';
$adminPassword = 'Admin123!';
$adminEmail = 'admin@aiprompthub.local';

if (!is_blog_installed()) {
    wp_install('AI Prompt Hub', $adminUser, $adminEmail, true, '', $adminPassword);
}

update_option('siteurl', $siteUrl);
update_option('home', $siteUrl);
update_option('blogname', 'AI Prompt Hub');
update_option('blogdescription', 'Practical AI prompts for work, business, learning, and creativity.');
update_option('permalink_structure', '/%postname%/');

$plugin = 'ai-prompt-hub-api/ai-prompt-hub-api.php';
if (!is_plugin_active($plugin)) {
    activate_plugin($plugin);
}

if (function_exists('aiph_seed_content')) {
    aiph_seed_content();
}

$helloWorld = get_page_by_path('hello-world', OBJECT, 'post');
if ($helloWorld) {
    wp_delete_post($helloWorld->ID, true);
}

flush_rewrite_rules();

echo "WordPress local install complete\n";
echo "Site: {$siteUrl}\n";
echo "Admin user: {$adminUser}\n";
echo "Admin password: {$adminPassword}\n";
