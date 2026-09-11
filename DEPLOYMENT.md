# Deployment Guide

## 1. Push the project to GitHub

1. Create an empty GitHub repository.
2. From the project root, run:

```bash
git init
git add .
git commit -m "Prepare project for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If this project is already connected to GitHub, use `git add .`, `git commit`, and `git push` instead of reinitializing it.

## 2. Create the MongoDB Atlas database

1. Create a MongoDB Atlas project and cluster.
2. Create a database user and save its username and password.
3. Add the Render or Railway server IP access rule. For hosted services without a fixed outbound IP, use `0.0.0.0/0` and protect the database with a strong password.
4. Copy the driver connection string and replace its placeholders:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/env_spec_db?retryWrites=true&w=majority
```

## 3. Deploy the backend to Render

1. Create a new **Web Service** and select the GitHub repository.
2. Use the repository root as the root directory.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add these environment variables:

```text
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/env_spec_db?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGINS=https://YOUR_VERCEL_DOMAIN.vercel.app
```

6. Deploy and copy the service URL, for example `https://your-service.onrender.com`.

Railway uses the same repository, `npm install` build command, `npm start` start command, and environment variables. Railway provides its public service URL after deployment.

## 4. Deploy the frontend to Vercel

1. Import the GitHub repository into Vercel.
2. Leave the framework as **Vite**. Use `npm run build` as the build command and `dist` as the output directory.
3. Add this environment variable:

```text
VITE_API_BASE_URL=https://YOUR_BACKEND_URL
```

Use the Render or Railway URL without a trailing slash. Vite exposes this value at build time, so redeploy after changing it.
4. Deploy the site and copy its Vercel domain.
5. Add the final Vercel domain to the backend `CORS_ORIGINS` variable and redeploy the backend.
6. In `vercel.json`, replace `YOUR_BACKEND_URL` with the backend hostname if requests should also work through the `/api/*` rewrite fallback. Keep the `https://` prefix in the destination.

The frontend falls back to relative `/api` requests when `VITE_API_BASE_URL` is not set, which works with the configured Vercel rewrite.

## 5. Verify the deployment

1. Open `https://YOUR_VERCEL_DOMAIN.vercel.app/api/health` and confirm the backend responds with `{ "status": "ok" }` through the rewrite.
2. Open the frontend and test login.
3. Check the browser network panel for successful `/api/auth/login` and data requests.
4. Confirm the backend logs show a successful MongoDB connection.
