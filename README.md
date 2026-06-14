# ToolNest

ToolNest is a web tool directory and utility hub. The current primary stack is a
Next.js frontend backed by a Laravel API for tool metadata, categories, search,
admin workflows, analytics, ads, and blog content. Browser-safe tool execution
stays client-side wherever possible.

## Repository Structure

```text
toolnest-web/   Primary Next.js frontend
toolnest-api/   Laravel API backend
UI/             Static UI references and mockups
FrontEnd/       Legacy Angular prototype kept for reference
Backend/        Legacy WordPress/PHP prototype kept for reference
```

## Frontend

```bash
cd toolnest-web
npm install
cp .env.example .env.local
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

Useful scripts:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Important environment variables:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADSENSE_ID=
NEXT_PUBLIC_GA_ID=
API_URL=http://localhost:8000/api/v1
REVALIDATE_SECRET=change-me
```

## Backend

```bash
cd toolnest-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Default local API URL:

```text
http://127.0.0.1:8000/api/v1
```

Expected local database defaults:

```text
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toolnest
DB_USERNAME=root
DB_PASSWORD=
```

Optional local admin seed values:

```text
TOOLNEST_ADMIN_EMAIL=admin@toolnest.dev
TOOLNEST_ADMIN_PASSWORD=change-this-local-password
```

Change `TOOLNEST_ADMIN_PASSWORD` before using the admin account outside a local
development database.

## Main Routes

Frontend:

```text
/
/tools
/category/{slug}
/tools/{slug}
/search
/sitemap.xml
```

API:

```text
GET  /api/v1/categories
GET  /api/v1/categories/{slug}
GET  /api/v1/tools
GET  /api/v1/tools/featured
GET  /api/v1/tools/popular
GET  /api/v1/tools/new
GET  /api/v1/tools/{slug}
GET  /api/v1/tools/{slug}/related
POST /api/v1/tools/{slug}/usage
GET  /api/v1/posts
GET  /api/v1/posts/{slug}
GET  /api/v1/search
GET  /api/v1/search/suggestions
POST /api/v1/admin/login
```

## Notes

- Do not commit local `.env` files, generated build folders, dependency folders,
  logs, or local WordPress configuration files.
- `toolnest-web` includes fallback catalog data so key pages can render even when
  the API is unavailable during local development.
- The Angular and WordPress folders are retained as historical prototypes while
  the active implementation moves forward in `toolnest-web` and `toolnest-api`.
