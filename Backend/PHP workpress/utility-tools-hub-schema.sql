CREATE DATABASE IF NOT EXISTS utility_tools_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE utility_tools_hub;

CREATE TABLE IF NOT EXISTS tools (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  keyword VARCHAR(180) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY tools_slug_unique (slug),
  KEY tools_category_index (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tools (name, slug, category, description, keyword) VALUES
('Word Counter', 'word-counter', 'Text', 'Count words, characters, sentences, and paragraphs instantly.', 'word counter online'),
('Character Counter', 'character-counter', 'Text', 'Count characters with and without spaces for bios, titles, and messages.', 'character counter online'),
('Case Converter', 'case-converter', 'Text', 'Convert text to uppercase, lowercase, title case, sentence case, or slug case.', 'case converter online'),
('Password Generator', 'password-generator', 'Developer', 'Generate strong random passwords with length and character options.', 'password generator'),
('QR Code Generator', 'qr-code-generator', 'Image', 'Create a QR code image for a URL, email, phone number, or short text.', 'qr code generator'),
('JSON Formatter', 'json-formatter', 'Developer', 'Format, validate, and minify JSON in the browser.', 'json formatter'),
('Base64 Encoder / Decoder', 'base64-encoder-decoder', 'Developer', 'Encode plain text to Base64 or decode Base64 back to readable text.', 'base64 encode decode'),
('URL Encoder / Decoder', 'url-encoder-decoder', 'Developer', 'Encode and decode URL strings for query parameters and safe links.', 'url encoder decoder'),
('Markdown Previewer', 'markdown-preview', 'Developer', 'Write Markdown and preview headings, links, lists, and code blocks.', 'markdown previewer'),
('Age Calculator', 'age-calculator', 'Calculator', 'Calculate age in years, months, and days from a birth date.', 'age calculator'),
('Phone Number Generator', 'phone-number-generator', 'Developer', 'Generate realistic sample phone numbers for forms, mockups, and test data.', 'phone number generator'),
('Random Wheel Picker', 'random-wheel', 'Calculator', 'Paste a list of choices and spin a random wheel to pick one result.', 'random wheel picker'),
('Game Username Generator', 'game-username-generator', 'Text', 'Generate meaningful game usernames, character names, and gamer tags by style, theme, and format.', 'game username generator'),
('Encrypt / Decrypt Tool', 'encrypt-decrypt', 'Developer', 'Encrypt and decrypt text in the browser with AES-GCM or AES-CBC, key derivation, IV, salt, and output encoding controls.', 'encrypt decrypt tool')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  keyword = VALUES(keyword);

CREATE TABLE IF NOT EXISTS feedback (
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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY feedback_anonymous_user_id_index (anonymous_user_id),
  KEY feedback_tool_slug_index (tool_slug),
  KEY feedback_status_index (status),
  KEY feedback_created_at_index (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
