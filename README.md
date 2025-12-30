# Desco (U) Ltd - Website Recreation

This is a recreation of the Desco Uganda website using Node.js, Express, and EJS. It features a custom Admin Dashboard for content management.

## 🚀 How to Run Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Server:**
    ```bash
    npm start
    ```
3.  **Visit the Site:**
    Open `http://localhost:3000` in your browser.

## 🔐 Admin Access

*   **Login URL:** Click the small **lock icon** 🔒 in the footer (next to the copyright).
*   **Default PIN:** `12345`
*   **Dashboard:** `/admin`

## 🌍 Deployment Guide (Recommended: Render.com)

Because this application uses a Node.js server (`server.js`), it **cannot** be hosted on GitHub Pages or Netlify (which are for static sites) without significant code changes.

**We recommend using Render.com (it has a free tier):**

1.  **Push to GitHub:** Ensure this code is in your GitHub repository.
2.  **Sign up for Render:** Go to [dashboard.render.com](https://dashboard.render.com/) and log in with GitHub.
3.  **New Web Service:** Click **"New +"** and select **"Web Service"**.
4.  **Connect Repo:** Select your `Desco` repository.
5.  **Configure:**
    *   **Name:** `desco-uganda` (or similar)
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  **Deploy:** Click **"Create Web Service"**.

### ⚠️ Important Note on Data Persistence

On most free cloud platforms (Render Free Tier, Heroku, etc.), the **file system is ephemeral**. 
This means that **changes made to `content.json` via the Admin Panel will reset** whenever the server restarts or you redeploy the app.

To make data changes permanent, you would need to:
1.  Upgrade to a paid plan with a **Persistent Disk**.
2.  Or, refactor the app to use a cloud database (like MongoDB Atlas).