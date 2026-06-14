<?php
/**
 * Plugin Name: Utility Tools Hub API
 * Description: Feedback REST API and local database table for QuickToolHub.
 * Version: 1.0.0
 * Author: Trong Tin
 */

if (!defined('ABSPATH')) {
    exit;
}

define('UTH_VERSION', '1.0.0');

register_activation_hook(__FILE__, 'uth_activate_plugin');

function uth_activate_plugin(): void
{
    uth_create_feedback_table();
}

function uth_feedback_table_name(): string
{
    global $wpdb;
    return $wpdb->prefix . 'tool_feedback';
}

function uth_create_feedback_table(): void
{
    global $wpdb;

    $table = uth_feedback_table_name();
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        anonymous_user_id VARCHAR(80) NOT NULL,
        tool_slug VARCHAR(180) NULL,
        page_url TEXT NOT NULL,
        feedback_type VARCHAR(40) NOT NULL DEFAULT 'other',
        message TEXT NOT NULL,
        email VARCHAR(190) NULL,
        ip_hash CHAR(64) NULL,
        user_agent TEXT NULL,
        status VARCHAR(40) NOT NULL DEFAULT 'new',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY anonymous_user_id_index (anonymous_user_id),
        KEY tool_slug_index (tool_slug),
        KEY status_index (status),
        KEY created_at_index (created_at)
    ) {$charset_collate};";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}

add_action('init', 'uth_allow_local_cors');

function uth_allow_local_cors(): void
{
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }
}

add_action('rest_api_init', 'uth_register_rest_routes');

function uth_register_rest_routes(): void
{
    register_rest_route('uth/v1', '/feedback', [
        [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'uth_create_feedback',
            'permission_callback' => '__return_true',
        ],
        [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'uth_get_feedback',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
        ],
    ]);
}

function uth_create_feedback(WP_REST_Request $request)
{
    global $wpdb;

    uth_create_feedback_table();

    $params = $request->get_json_params();
    if (!is_array($params)) {
        $params = $request->get_params();
    }

    $message = sanitize_textarea_field((string) ($params['message'] ?? ''));
    if (mb_strlen(trim($message)) < 3) {
        return new WP_Error('invalid_message', 'Feedback message is required.', ['status' => 400]);
    }

    if (mb_strlen($message) > 3000) {
        return new WP_Error('message_too_long', 'Feedback message is too long.', ['status' => 400]);
    }

    $allowed_types = ['bug', 'feature', 'ui', 'other'];
    $feedback_type = sanitize_key((string) ($params['type'] ?? 'other'));
    if (!in_array($feedback_type, $allowed_types, true)) {
        $feedback_type = 'other';
    }

    $anonymous_user_id = sanitize_text_field((string) ($params['anonymousUserId'] ?? ''));
    if ($anonymous_user_id === '') {
        $anonymous_user_id = 'qth_server_' . wp_generate_password(12, false, false);
    }

    $email = sanitize_email((string) ($params['email'] ?? ''));
    if ($email !== '' && !is_email($email)) {
        return new WP_Error('invalid_email', 'Email address is invalid.', ['status' => 400]);
    }

    $remote_ip = sanitize_text_field((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
    $ip_hash = $remote_ip !== '' ? hash('sha256', wp_salt('auth') . '|' . $remote_ip) : null;

    $inserted = $wpdb->insert(
        uth_feedback_table_name(),
        [
            'anonymous_user_id' => $anonymous_user_id,
            'tool_slug' => sanitize_title((string) ($params['toolSlug'] ?? '')),
            'page_url' => esc_url_raw((string) ($params['pageUrl'] ?? '')),
            'feedback_type' => $feedback_type,
            'message' => $message,
            'email' => $email,
            'ip_hash' => $ip_hash,
            'user_agent' => sanitize_textarea_field((string) ($_SERVER['HTTP_USER_AGENT'] ?? '')),
            'status' => 'new',
            'created_at' => current_time('mysql'),
        ],
        ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
    );

    if (!$inserted) {
        return new WP_Error('feedback_save_failed', 'Could not save feedback.', ['status' => 500]);
    }

    return rest_ensure_response([
        'id' => (int) $wpdb->insert_id,
        'status' => 'saved',
        'message' => 'Feedback saved.',
    ]);
}

function uth_get_feedback(WP_REST_Request $request): WP_REST_Response
{
    global $wpdb;

    $limit = min(max((int) ($request->get_param('limit') ?: 50), 1), 100);
    $rows = $wpdb->get_results(
        $wpdb->prepare(
            'SELECT id, anonymous_user_id, tool_slug, page_url, feedback_type, message, email, status, created_at FROM ' . uth_feedback_table_name() . ' ORDER BY created_at DESC LIMIT %d',
            $limit
        ),
        ARRAY_A
    );

    return rest_ensure_response($rows ?: []);
}
