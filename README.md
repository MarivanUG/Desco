# Desco (U) Ltd - Website Rebuild

This project is a modern, responsive rebuild of the Desco Uganda website using Node.js, Express, and EJS. It features a file-based CMS (Content Management System) allowing for easy content updates without a database.

## 🚀 Features

- **Modern UI/UX:** Responsive design with parallax effects, animations, and a clean layout.
- **Dynamic Content:** All text, images, and services are loaded from `content.json`.
- **Admin Dashboard:** A secured (route-based) dashboard to edit website content directly.
- **Asset Management:** Automated image scraping and local serving.
- **No Database Required:** Uses JSON for data persistence, making it easy to deploy and backup.

## 🛠️ Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

## 📦 Installation

1.  **Navigate to the project directory:**
    ```bash
    cd d:\Recreated\Desco
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Application

### Development Mode (Auto-restart on change)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 🖥️ Usage

1.  **View the Website:**
    Open your browser and go to: [http://localhost:3000](http://localhost:3000)

2.  **Access Admin Dashboard:**
    Go to: [http://localhost:3000/admin](http://localhost:3000/admin)
    - You can edit the Site Title, Hero section, About Us, Services, Features, Gallery, and Contact info.
    - Click **"Save All Changes"** to update the site instantly.

## 📂 Project Structure

- `server.js` - Main application server.
- `content.json` - Database file storing all website content.
- `views/` - EJS templates for the frontend (`index.ejs`) and admin (`admin.ejs`).
- `public/` - Static files (CSS, JS, Images).
- `scrape.js` & `fetch_data.js` - Scripts used for initial content migration.

## 🎨 Customization

- **Styling:** Edit `public/css/style.css`.
- **Logic:** Edit `public/js/script.js` for frontend interactions.
- **Templates:** Edit files in `views/` to change the HTML structure.
