<?php

if (!defined('ABSPATH')) {
    exit;
}

function aiph_seed_content(): void
{
    $categories = [
        'Coding' => ['slug' => 'coding', 'description' => 'Code review, debugging, refactoring, and documentation prompts.', 'icon' => '</>'],
        'Content Writing' => ['slug' => 'content-writing', 'description' => 'Hooks, captions, blog outlines, and long-form writing prompts.', 'icon' => 'Aa'],
        'SEO' => ['slug' => 'seo', 'description' => 'Keyword research, content briefs, meta descriptions, and FAQ prompts.', 'icon' => 'SEO'],
        'Marketing' => ['slug' => 'marketing', 'description' => 'Campaign angles, landing copy, ad ideas, and customer research prompts.', 'icon' => 'MK'],
        'Freelancing' => ['slug' => 'freelancing', 'description' => 'Proposals, client updates, onboarding, and scope prompts.', 'icon' => '$'],
        'Productivity' => ['slug' => 'productivity', 'description' => 'Task planning, weekly reviews, meeting notes, and prioritization prompts.', 'icon' => '24h'],
    ];

    foreach ($categories as $name => $data) {
        if (!term_exists($data['slug'], 'prompt_category')) {
            $term = wp_insert_term($name, 'prompt_category', [
                'slug' => $data['slug'],
                'description' => $data['description'],
            ]);

            if (!is_wp_error($term)) {
                update_term_meta((int) $term['term_id'], 'icon', $data['icon']);
            }
        }
    }

    $prompts = [
        [
            'title' => 'Senior Code Review for Angular Components',
            'slug' => 'senior-code-review-angular-components',
            'category' => 'coding',
            'tags' => ['Angular', 'TypeScript', 'Code Review'],
            'meta' => [
                'short_description' => 'Review Angular component code for maintainability, accessibility, performance, and testability.',
                'prompt_content' => "Act as a senior Angular engineer. Review the following component for maintainability, state management, accessibility, performance, and testability. Return findings ordered by severity, include exact code references, and suggest minimal fixes before proposing any refactor.\n\nCode:\n[PASTE CODE HERE]",
                'use_case' => 'Use before merging a feature branch or when learning how to improve an Angular component.',
                'ai_tool' => 'ChatGPT',
                'difficulty' => 'Intermediate',
                'estimated_time_saved' => 'Saves 30 minutes',
                'example_output' => 'High severity: template event handler calls expensive filtering on every render.',
                'is_featured' => '1',
            ],
        ],
        [
            'title' => 'Debug a JavaScript Runtime Error',
            'slug' => 'debug-javascript-runtime-error',
            'category' => 'coding',
            'tags' => ['JavaScript', 'Debugging'],
            'meta' => [
                'short_description' => 'Turn an error message, stack trace, and relevant code into a structured debugging plan.',
                'prompt_content' => "You are a patient JavaScript debugging partner. Given this error, stack trace, and code, explain the likely root cause in plain language, list the top 3 hypotheses, and provide the smallest safe fix first.\n\nError:\n[ERROR]\n\nStack trace:\n[STACK]\n\nCode:\n[CODE]",
                'use_case' => 'Best for fast debugging when an error is noisy or unfamiliar.',
                'ai_tool' => 'Claude',
                'difficulty' => 'Beginner',
                'estimated_time_saved' => 'Saves 20 minutes',
                'is_featured' => '1',
            ],
        ],
        [
            'title' => 'SEO Blog Brief From a Keyword',
            'slug' => 'seo-blog-brief-from-a-keyword',
            'category' => 'seo',
            'tags' => ['SEO', 'Blog', 'Content Brief'],
            'meta' => [
                'short_description' => 'Create a practical SEO content brief from one target keyword and search intent.',
                'prompt_content' => 'Create an SEO content brief for the keyword "[KEYWORD]". Include search intent, target reader, title options, meta description, H2/H3 outline, internal link ideas, FAQ questions, and a checklist for originality.',
                'use_case' => 'Use before writing a blog post or assigning content to a writer.',
                'ai_tool' => 'Gemini',
                'difficulty' => 'Intermediate',
                'estimated_time_saved' => 'Saves 45 minutes',
                'is_featured' => '1',
            ],
        ],
        [
            'title' => 'Freelance Proposal That Sounds Human',
            'slug' => 'freelance-proposal-that-sounds-human',
            'category' => 'freelancing',
            'tags' => ['Proposal', 'Client Work'],
            'meta' => [
                'short_description' => 'Write a concise client proposal based on the job post, constraints, and proof points.',
                'prompt_content' => "Write a freelance proposal for this project. Keep it specific, calm, and human. Mention the client goal, my relevant proof, a simple delivery approach, two smart questions, and a clear next step.\n\nJob post:\n[PASTE JOB POST]\n\nMy background:\n[PASTE BACKGROUND]",
                'use_case' => 'Use when applying to freelance projects without sounding generic.',
                'ai_tool' => 'Claude',
                'difficulty' => 'Beginner',
                'estimated_time_saved' => 'Saves 25 minutes',
            ],
        ],
    ];

    foreach ($prompts as $prompt) {
        if (get_page_by_path($prompt['slug'], OBJECT, 'prompt')) {
            continue;
        }

        $post_id = wp_insert_post([
            'post_type' => 'prompt',
            'post_status' => 'publish',
            'post_title' => $prompt['title'],
            'post_name' => $prompt['slug'],
            'post_content' => $prompt['meta']['prompt_content'],
            'post_excerpt' => $prompt['meta']['short_description'],
        ]);

        if (is_wp_error($post_id) || !$post_id) {
            continue;
        }

        wp_set_object_terms($post_id, $prompt['category'], 'prompt_category');
        wp_set_object_terms($post_id, $prompt['tags'], 'prompt_tag');

        foreach ($prompt['meta'] as $key => $value) {
            update_post_meta($post_id, $key, $value);
        }
    }

    aiph_seed_blog_posts();
}

function aiph_seed_blog_posts(): void
{
    $posts = [
        [
            'title' => 'Best ChatGPT Prompts for Developers',
            'slug' => 'best-chatgpt-prompts-for-developers',
            'excerpt' => 'A practical set of developer prompts for reviewing code, finding bugs, writing tests, and learning faster.',
            'content' => '<p>Developer prompts work best when they include context, constraints, and the exact output shape you want.</p><h2>Start With Review Prompts</h2><p>Ask for severity, file references, and minimal fixes before broad refactors.</p>',
        ],
        [
            'title' => 'How to Write Better AI Prompts',
            'slug' => 'how-to-write-better-ai-prompts',
            'excerpt' => 'A simple framework for turning vague requests into prompts that produce useful output more often.',
            'content' => '<p>A good prompt gives the model a role, task, context, constraints, examples, and expected format.</p><h2>The Simple Formula</h2><p>Use role, goal, context, constraints, output format, and review criteria.</p>',
        ],
    ];

    foreach ($posts as $post) {
        if (get_page_by_path($post['slug'], OBJECT, 'post')) {
            continue;
        }

        wp_insert_post([
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_title' => $post['title'],
            'post_name' => $post['slug'],
            'post_excerpt' => $post['excerpt'],
            'post_content' => $post['content'],
        ]);
    }
}
