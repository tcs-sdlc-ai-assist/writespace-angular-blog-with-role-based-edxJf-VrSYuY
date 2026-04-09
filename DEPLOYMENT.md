# Deployment Guide — WriteSpace

## Overview

WriteSpace is an Angular 17+ application deployed to **Vercel**. This document covers the full deployment process, Vercel configuration, environment considerations, and troubleshooting tips.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)
- A [Vercel](https://vercel.com/) account
- The [Vercel CLI](https://vercel.com/docs/cli) installed (`npm install -g vercel`)

---

## Angular Build Command

WriteSpace uses the standard Angular build command to produce a production-ready bundle:

```bash
ng build --configuration=production
```

This outputs compiled assets to the `dist/writespace/browser` directory (Angular 17+ uses the `browser` subfolder by default under `dist/<project-name>/`).

> **Note:** Verify the exact output path in your `angular.json` under `projects > writespace > architect > build > options > outputPath`. Adjust the Vercel configuration below if your output path differs.

---

## Vercel Configuration

Create a `vercel.json` file in the project root with the following content:

```json
{
  "version": 2,
  "buildCommand": "ng build --configuration=production",
  "outputDirectory": "dist/writespace/browser",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Configuration Breakdown

| Property           | Value                                | Purpose                                                                 |
|--------------------|--------------------------------------|-------------------------------------------------------------------------|
| `version`          | `2`                                  | Uses Vercel platform v2                                                 |
| `buildCommand`     | `ng build --configuration=production`| Runs the Angular production build during deployment                     |
| `outputDirectory`  | `dist/writespace/browser`            | Points Vercel to the compiled Angular output                            |
| `framework`        | `null`                               | Prevents Vercel from auto-detecting and applying incorrect defaults     |
| `rewrites`         | `[{ "source": "/(.*)", ... }]`       | Enables SPA routing — all paths serve `index.html` for client-side routing |

---

## SPA Rewrites — Direct URL Access

Angular uses client-side routing via the Angular Router. Without server-side rewrites, navigating directly to a URL like `https://your-app.vercel.app/blog/my-post` would return a **404** because no physical file exists at that path on the server.

The `rewrites` rule in `vercel.json` solves this:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This ensures that:

- **All routes** (e.g., `/dashboard`, `/blog/123`, `/settings/profile`) are served by `index.html`.
- The **Angular Router** takes over once the page loads and renders the correct component.
- **Static assets** (JS, CSS, images, fonts) are still served normally because Vercel resolves existing files before applying rewrites.

---

## Environment Considerations

### Environment Files

Angular uses `src/environments/` for environment-specific configuration:

- `src/environments/environment.ts` — development defaults
- `src/environments/environment.production.ts` — production values

Example:

```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.writespace.example.com'
};
```

### Vercel Environment Variables

For sensitive values or values that differ per deployment (preview, production), use Vercel Environment Variables:

1. Go to your project on [vercel.com](https://vercel.com/)
2. Navigate to **Settings → Environment Variables**
3. Add variables such as:
   - `NG_APP_API_URL` — your backend API URL
   - `NG_APP_ANALYTICS_ID` — analytics tracking ID

> **Important:** Angular does **not** natively read runtime environment variables from `process.env`. Environment values are baked in at build time via the `environment.ts` files. To use Vercel environment variables, reference them in a custom build script or use `fileReplacements` in `angular.json` to swap environment files per build configuration.

### Using Vercel Env Vars at Build Time

You can create a custom build script in `package.json` that writes environment variables into the Angular environment file before building:

```json
{
  "scripts": {
    "build:vercel": "node ./scripts/set-env.js && ng build --configuration=production"
  }
}
```

Then update `vercel.json`:

```json
{
  "buildCommand": "npm run build:vercel"
}
```

---

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from the project root (first time — follow prompts to link project)
vercel

# Deploy directly to production
vercel --prod
```

### Option 2: Deploy via Git Integration

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects the framework. Override settings if needed:
   - **Build Command:** `ng build --configuration=production`
   - **Output Directory:** `dist/writespace/browser`
4. Click **Deploy**.
5. Every subsequent push to the `main` branch triggers a **production deployment**.
6. Pushes to other branches create **preview deployments** with unique URLs.

### Option 3: Deploy via Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com/).
2. Click **Deployments** → **Redeploy** on any previous deployment.
3. Or trigger a new deployment by pushing a commit.

---

## Post-Deployment Verification

After deployment, verify the following:

1. **Home page loads** — visit `https://your-app.vercel.app/`
2. **Client-side routing works** — navigate between pages using in-app links
3. **Direct URL access works** — paste a deep link like `https://your-app.vercel.app/blog/123` directly in the browser address bar; it should load correctly (not 404)
4. **Assets load** — open browser DevTools → Network tab; confirm JS, CSS, and image files return 200
5. **API connectivity** — if the app calls a backend API, confirm requests succeed (check for CORS issues)

---

## Troubleshooting

### 404 on Direct URL Access

**Symptom:** Navigating directly to a route like `/dashboard` returns a Vercel 404 page.

**Cause:** The `rewrites` configuration is missing or incorrect in `vercel.json`.

**Fix:** Ensure `vercel.json` includes the SPA rewrite rule:

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

---

### Blank Page After Deployment

**Symptom:** The page loads but is completely blank (white screen).

**Cause:** The `outputDirectory` in `vercel.json` does not match the actual build output path.

**Fix:**
1. Run `ng build --configuration=production` locally.
2. Check the actual output directory (e.g., `dist/writespace/browser`).
3. Update `outputDirectory` in `vercel.json` to match.

---

### Build Fails on Vercel

**Symptom:** Deployment fails during the build step.

**Common Causes & Fixes:**

| Cause                              | Fix                                                                 |
|------------------------------------|---------------------------------------------------------------------|
| Node.js version mismatch           | Add `"engines": { "node": ">=18" }` to `package.json`              |
| Missing dependencies               | Ensure all dependencies are in `dependencies` (not just `devDependencies`) for packages needed at build time |
| Angular CLI not found              | Add `@angular/cli` to `devDependencies`                             |
| Out of memory                      | Set env var `NODE_OPTIONS=--max-old-space-size=4096` in Vercel      |

---

### API Requests Failing (CORS)

**Symptom:** Network requests to your backend return CORS errors in the browser console.

**Fix:**
- Configure your backend to allow the Vercel deployment URL in its CORS policy.
- For preview deployments, consider allowing `*.vercel.app` origins in non-production environments.

---

### Environment Variables Not Applied

**Symptom:** The app uses default/development values instead of production configuration.

**Fix:**
- Remember that Angular bakes environment values at **build time**.
- Verify that `angular.json` has the correct `fileReplacements` for the `production` configuration:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.production.ts"
      }
    ]
  }
}
```

---

### Caching Issues

**Symptom:** Old version of the app is served after a new deployment.

**Fix:**
- Angular production builds include content hashes in filenames by default, which busts caches for JS/CSS.
- For `index.html`, Vercel typically serves the latest version. If stale, try:
  - Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
  - Clear browser cache
  - Purge Vercel edge cache from the dashboard (Deployments → select deployment → three-dot menu → Redeploy)

---

## Custom Domain Setup

1. Go to your Vercel project → **Settings → Domains**.
2. Add your custom domain (e.g., `writespace.example.com`).
3. Update your DNS provider:
   - **CNAME** record: point your domain to `cname.vercel-dns.com`
   - Or use Vercel's nameservers for full DNS management
4. Vercel automatically provisions an **SSL certificate** via Let's Encrypt.

---

## Summary

| Step                  | Command / Action                                      |
|-----------------------|-------------------------------------------------------|
| Install dependencies  | `npm install`                                         |
| Build locally         | `ng build --configuration=production`                 |
| Deploy (CLI)          | `vercel --prod`                                       |
| Deploy (Git)          | Push to `main` branch                                 |
| Verify                | Check direct URL access, routing, assets, API calls   |