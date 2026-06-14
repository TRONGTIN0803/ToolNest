<?php

define('WP_INSTALLING', true);

$wpRoot = 'C:/xampp/htdocs/utility-tools-hub';

require_once $wpRoot . '/wp-load.php';
require_once $wpRoot . '/wp-admin/includes/upgrade.php';
require_once $wpRoot . '/wp-admin/includes/plugin.php';

$siteUrl = 'http://localhost/utility-tools-hub';
$adminUser = 'admin';
$adminPassword = 'Admin123!';
$adminEmail = 'admin@quicktoolhub.local';

if (!is_blog_installed()) {
    wp_install('QuickToolHub', $adminUser, $adminEmail, true, '', $adminPassword);
}

update_option('siteurl', $siteUrl);
update_option('home', $siteUrl);
update_option('blogname', 'QuickToolHub');
update_option('blogdescription', 'Free online tools for text, developer utilities, images, and daily calculations.');
update_option('permalink_structure', '/%postname%/');

$plugin = 'utility-tools-hub-api/utility-tools-hub-api.php';
if (!is_plugin_active($plugin)) {
    activate_plugin($plugin);
}

$helloWorld = get_page_by_path('hello-world', OBJECT, 'post');
if ($helloWorld) {
    wp_delete_post($helloWorld->ID, true);
}

flush_rewrite_rules();

echo "Utility Tools Hub WordPress local install complete\n";
echo "Site: {$siteUrl}\n";
echo "Database: utility_tools_hub\n";
echo "Admin user: {$adminUser}\n";
echo "Admin password: {$adminPassword}\n";
