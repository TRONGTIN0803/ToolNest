<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Text Tools', 'slug' => 'text-tools', 'icon' => 'type', 'color' => '#185FA5', 'sort_order' => 1],
            ['name' => 'Developer Tools', 'slug' => 'developer-tools', 'icon' => 'code', 'color' => '#534AB7', 'sort_order' => 2],
            ['name' => 'Color & Design', 'slug' => 'color-design', 'icon' => 'palette', 'color' => '#993556', 'sort_order' => 3],
            ['name' => 'Math & Numbers', 'slug' => 'math-numbers', 'icon' => 'calculator', 'color' => '#854F0B', 'sort_order' => 4],
            ['name' => 'Time & Date', 'slug' => 'time-date', 'icon' => 'clock', 'color' => '#3B6D11', 'sort_order' => 5],
            ['name' => 'SEO & Web', 'slug' => 'seo-web', 'icon' => 'globe', 'color' => '#185FA5', 'sort_order' => 6],
        ])->mapWithKeys(fn (array $category) => [
            $category['slug'] => Category::updateOrCreate(['slug' => $category['slug']], $category),
        ]);

        $defaultFaq = [
            ['q' => 'Is my data sent to a server?', 'a' => 'No. Tool processing is designed to run in your browser, and private input is not stored.'],
            ['q' => 'Do I need an account?', 'a' => 'No. ToolNest tools are free to use without signup.'],
        ];

        $tools = [
            ['JSON Formatter', 'json-formatter', 'developer-tools', 'Format, validate and minify JSON instantly.', 'JsonFormatter', true, false, 24120, ['url-encoder', 'base64', 'hash-generator']],
            ['Word Counter', 'word-counter', 'text-tools', 'Count words, characters, sentences and reading time.', 'WordCounter', true, false, 13500, ['character-counter', 'case-converter']],
            ['Character Counter', 'character-counter', 'text-tools', 'Count characters with and without spaces.', 'CharacterCounter', false, false, 10200, ['word-counter', 'case-converter']],
            ['Case Converter', 'case-converter', 'text-tools', 'Convert text to upper, lower, title, camel, snake and kebab case.', 'CaseConverter', true, false, 12300, ['word-counter', 'slug-generator']],
            ['Slug Generator', 'slug-generator', 'text-tools', 'Convert titles into clean URL slugs.', 'SlugGenerator', false, false, 8900, ['case-converter', 'word-counter']],
            ['Base64 Encoder/Decoder', 'base64', 'developer-tools', 'Encode and decode Base64 strings.', 'Base64Tool', true, false, 14300, ['url-encoder', 'json-formatter']],
            ['URL Encoder/Decoder', 'url-encoder', 'developer-tools', 'Encode and decode URL components.', 'UrlEncoder', false, false, 12800, ['base64', 'json-formatter']],
            ['UUID Generator', 'uuid-generator', 'developer-tools', 'Generate UUID v4 values instantly.', 'UuidGenerator', true, false, 18700, ['hash-generator', 'json-formatter']],
            ['Hash Generator', 'hash-generator', 'developer-tools', 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes.', 'HashGenerator', false, false, 9400, ['uuid-generator', 'base64']],
            ['Regex Tester', 'regex-tester', 'developer-tools', 'Test regular expressions with live match highlighting.', 'RegexTester', false, true, 10900, ['json-formatter', 'url-encoder']],
            ['JWT Decoder', 'jwt-decoder', 'developer-tools', 'Decode JWT header and payload without verification.', 'JwtDecoder', false, true, 8100, ['base64', 'json-formatter']],
            ['Color Picker', 'color-picker', 'color-design', 'Pick colors and convert HEX, RGB and HSL.', 'ColorPicker', true, false, 14800, ['color-converter', 'contrast-checker']],
            ['Contrast Checker', 'contrast-checker', 'color-design', 'Check WCAG contrast between foreground and background colors.', 'ContrastChecker', false, false, 7600, ['color-picker']],
            ['Percentage Calculator', 'percentage-calculator', 'math-numbers', 'Calculate percentages, changes and differences.', 'PercentageCalc', false, false, 6900, ['unit-converter']],
            ['Timezone Converter', 'timezone-converter', 'time-date', 'Convert time between world timezones.', 'TimezoneConverter', true, false, 11500, ['timestamp-converter']],
            ['Timestamp Converter', 'timestamp-converter', 'time-date', 'Convert Unix timestamps to human-readable dates.', 'TimestampConverter', false, false, 8400, ['timezone-converter']],
            ['Age Calculator', 'age-calculator', 'time-date', 'Calculate exact age from a birth date.', 'AgeCalculator', false, false, 7200, ['date-difference']],
            ['Meta Tag Preview', 'meta-tag-preview', 'seo-web', 'Preview Google, Facebook and Twitter metadata.', 'MetaTagPreview', true, true, 9700, ['slug-generator']],
            ['Password Generator', 'password-generator', 'seo-web', 'Generate strong random passwords with options.', 'PasswordGenerator', true, false, 16200, ['hash-generator', 'uuid-generator']],
        ];

        foreach ($tools as $index => [$name, $slug, $categorySlug, $tagline, $componentKey, $featured, $new, $usageCount, $related]) {
            Tool::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $categories[$categorySlug]->id,
                    'name' => $name,
                    'tagline' => $tagline,
                    'description' => $tagline,
                    'how_to_use' => '<ol><li>Enter your input.</li><li>Choose the mode you need.</li><li>Copy or download the result.</li></ol>',
                    'features' => ['Fast', 'Browser-side', 'No signup'],
                    'component_key' => $componentKey,
                    'is_featured' => $featured,
                    'is_new' => $new,
                    'sort_order' => $index + 1,
                    'usage_count' => $usageCount,
                    'faq' => $defaultFaq,
                    'related_tools' => $related,
                ],
            );
        }

        foreach ($categories as $category) {
            $category->update(['tool_count' => $category->tools()->count()]);
        }

        Setting::upsert([
            ['key' => 'site_name', 'value' => 'ToolNest', 'type' => 'string'],
            ['key' => 'site_url', 'value' => 'https://toolnest.dev', 'type' => 'string'],
            ['key' => 'site_tagline', 'value' => 'Free online tools for developers & freelancers', 'type' => 'string'],
            ['key' => 'adsense_id', 'value' => '', 'type' => 'string'],
            ['key' => 'ga_id', 'value' => '', 'type' => 'string'],
        ], ['key'], ['value', 'type']);

        Post::updateOrCreate(
            ['slug' => 'how-to-format-json-online'],
            [
                'title' => 'How to format JSON online',
                'excerpt' => 'Learn how JSON formatting helps you inspect API responses, config files, and structured data.',
                'content' => '<p>JSON is easier to debug when it is formatted with indentation and clear nesting.</p>',
                'status' => 'published',
                'read_time' => 2,
                'published_at' => now(),
                'related_tools' => ['json-formatter'],
            ],
        );

        $adminEmail = env('TOOLNEST_ADMIN_EMAIL', 'admin@toolnest.dev');
        $adminPassword = env('TOOLNEST_ADMIN_PASSWORD', 'change-this-local-password');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'ToolNest Admin',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
            ],
        );
    }
}
