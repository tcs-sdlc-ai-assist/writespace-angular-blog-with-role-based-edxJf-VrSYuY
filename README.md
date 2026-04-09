# WriteSpace

A modern blogging platform built with Angular 17+ that enables users to create, manage, and share blog posts with a clean, distraction-free writing experience.

## Features

- **User Authentication** — Register and login with role-based access (admin/author)
- **Blog Management** — Create, edit, delete, and publish blog posts
- **Rich Dashboard** — Personalized dashboard for managing your content
- **Public Blog Feed** — Browse and read published posts without authentication
- **Search & Filter** — Find posts by title, author, or category
- **Responsive Design** — Fully responsive UI built with plain CSS (no frameworks)
- **Client-Side Storage** — All data persisted via `localStorage` for zero-backend simplicity
- **Standalone Components** — Leverages Angular 17+ standalone component architecture with new control flow syntax (`@if`, `@for`)

## Tech Stack

| Layer         | Technology              |
|---------------|-------------------------|
| Framework     | Angular 17+             |
| Language      | TypeScript              |
| Styling       | Plain CSS               |
| Storage       | localStorage            |
| Routing       | Angular Router          |
| Forms         | Angular Reactive Forms  |
| Deployment    | Vercel                  |

## Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/                  # Navigation bar component
│   │   ├── footer/                  # Footer component
│   │   └── post-card/               # Reusable post card component
│   ├── guards/
│   │   ├── auth.guard.ts            # Protects authenticated routes
│   │   └── admin.guard.ts           # Protects admin-only routes
│   ├── models/
│   │   ├── user.model.ts            # User interface definition
│   │   └── post.model.ts            # Post interface definition
│   ├── pages/
│   │   ├── home/                    # Public landing page
│   │   ├── login/                   # Login page
│   │   ├── register/                # Registration page
│   │   ├── dashboard/               # User dashboard
│   │   ├── create-post/             # Create new post
│   │   ├── edit-post/               # Edit existing post
│   │   ├── post-detail/             # Single post view
│   │   ├── admin/                   # Admin panel
│   │   └── not-found/               # 404 page
│   ├── services/
│   │   ├── auth.service.ts          # Authentication logic
│   │   ├── post.service.ts          # Post CRUD operations
│   │   └── storage.service.ts       # localStorage abstraction
│   ├── app.component.ts             # Root component
│   ├── app.config.ts                # Application configuration
│   └── app.routes.ts                # Route definitions
├── assets/                          # Static assets
├── environments/
│   ├── environment.ts               # Development config
│   └── environment.prod.ts          # Production config
├── styles.css                       # Global styles
├── index.html                       # Entry HTML
└── main.ts                          # Bootstrap entry point
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 17+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install

# Start the development server
ng serve
```

The application will be available at `http://localhost:4200`.

### Build

```bash
# Production build
ng build --configuration production
```

Build artifacts are output to the `dist/writespace/browser/` directory.

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project in [Vercel](https://vercel.com).
3. Set the following build settings:
   - **Framework Preset:** Angular
   - **Build Command:** `ng build --configuration production`
   - **Output Directory:** `dist/writespace/browser`
4. Deploy.

Alternatively, deploy via the Vercel CLI:

```bash
npm install -g vercel
vercel --prod
```

## Route Map

| Path                | Component         | Auth Required | Description                  |
|---------------------|-------------------|---------------|------------------------------|
| `/`                 | HomeComponent     | No            | Public landing / blog feed   |
| `/login`            | LoginComponent    | No            | User login                   |
| `/register`         | RegisterComponent | No            | User registration            |
| `/dashboard`        | DashboardComponent| Yes           | User's post management       |
| `/posts/create`     | CreatePostComponent| Yes          | Create a new blog post       |
| `/posts/edit/:id`   | EditPostComponent | Yes           | Edit an existing post        |
| `/posts/:id`        | PostDetailComponent| No           | View a single post           |
| `/admin`            | AdminComponent    | Yes (Admin)   | Admin panel for user/post mgmt|
| `**`                | NotFoundComponent | No            | 404 fallback                 |

## Design System Overview

### Colors

| Token              | Value     | Usage                        |
|--------------------|-----------|------------------------------|
| `--color-primary`  | `#2563eb` | Buttons, links, accents      |
| `--color-secondary`| `#64748b` | Secondary text, borders      |
| `--color-bg`       | `#ffffff` | Page background              |
| `--color-surface`  | `#f8fafc` | Card backgrounds             |
| `--color-text`     | `#0f172a` | Primary text                 |
| `--color-danger`   | `#dc2626` | Error states, delete actions |
| `--color-success`  | `#16a34a` | Success messages             |

### Typography

- **Font Family:** `'Inter', system-ui, -apple-system, sans-serif`
- **Headings:** Bold weight, scaled from `2rem` (h1) to `1rem` (h6)
- **Body:** `1rem` / `1.6` line-height for readability

### Spacing

- Base unit: `0.25rem` (4px)
- Component padding: `1rem` – `1.5rem`
- Section spacing: `2rem` – `4rem`

### Components

- **Buttons:** Rounded (`border-radius: 0.5rem`), primary/secondary/danger variants
- **Cards:** Subtle shadow, rounded corners, surface background
- **Forms:** Full-width inputs with visible focus rings using `--color-primary`
- **Navbar:** Fixed top, white background with bottom border shadow

## Known Limitations

> **⚠️ This is a client-side demo application. It is NOT suitable for production use.**

- **Plain-text passwords** — User passwords are stored as plain text in `localStorage`. There is no hashing, salting, or encryption. Never use real credentials.
- **Client-side only** — All data lives in the browser's `localStorage`. Data is not shared across devices or browsers and can be cleared at any time.
- **No backend/API** — There is no server, database, or API layer. All business logic runs in the browser.
- **No input sanitization** — While Angular provides built-in XSS protection for template bindings, content rendered via `[innerHTML]` should be treated with caution.
- **localStorage size limits** — Browsers typically limit `localStorage` to ~5–10 MB. Heavy usage with many posts or large content may hit this limit.
- **No image uploads** — Posts support text content only. Image URLs can be referenced but files cannot be uploaded.
- **Single-session auth** — Authentication state is tied to `localStorage` and does not support token expiry, refresh tokens, or multi-tab session sync.

## License

**Private** — All rights reserved. This project is not licensed for public distribution or reuse.