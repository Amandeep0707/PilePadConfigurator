# PilePad Configurator - Documentation & Developer Guide

## 1. Project Overview

The **PilePad Configurator** is a web-based application built using **React** and **Vite**. It allows users to customize PilePad products with various textures and configurations. The application uses **Cloudinary** for managing and serving high-quality image assets.

This guide provides instructions on how to install the project, configure environment variables, update product pricing, and deploy the application.

---

## 2. Prerequisites

Before running the application, ensure the following are installed on your computer:

- **Node.js** (Version 16 or higher recommended) - [Download Here](https://nodejs.org/)
- **Git** - [Download Here](https://git-scm.com/)
- A code editor (e.g., **VS Code**)

---

## 3. Installation & Setup

1.  **Download the Source Code**
    Clone the repository or download the ZIP file provided.

    ```bash
    git clone https://github.com/Amandeep0707/PilePadConfigurator.git
    cd PilePadConfigurator
    ```

2.  **Install Dependencies**
    Open your terminal/command prompt in the project folder and run:

    ```bash
    npm install
    ```

    _(This downloads all the necessary libraries required to run the app)._

3.  **Setup Environment Variables**
    The app requires Cloudinary API keys to function (to load images/textures).

    - Create a new file in the root folder named: `.env`
    - Open `.env` in your text editor and paste the following keys:

    ```env
    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
    VITE_CLOUDINARY_API_KEY=your_api_key_here
    VITE_CLOUDINARY_API_SECRET=your_api_secret_here
    ```

    _(Replace `your_..._here` with the actual keys provided separately)._

4.  **Run the Application Locally**
    To start the app on your local machine:
    ```bash
    npm run dev
    ```
    You will see a link (usually `http://localhost:5173`). Open this in your browser to view the configurator.

---

## 4. How to Change Product Prices

Yes, the prices can be changed easily. The product data is typically stored in a dedicated data file within the source code.

**Steps to Update Prices:**

1.  **Locate the Data File:**

    - Open the `src` folder.
    - Look for a folder named `data`.
    - Inside, look for a file named `client_data.js`.
    - _Tip: If you cannot find it, press `Ctrl + Shift + F` (in VS Code) and search for one of the current prices (e.g., if a product costs $500, search for "500")._

2.  **Edit the Price:**
    You will likely see code that looks like this:

    ```javascript
    export const products = [
      {
        sku: "POL-138-2IN-BLA",
        variantName: "PolePad-Black/2 in/138 in",
        price: 180.77, // <--- CHANGE THIS NUMBER TO CHANGE RETAIL PRICE
        retailPrice: 200.86, // <--- CHANGE THIS NUMBER TO CHANGE RETAIL PRICE
        ...
      }
    ];
    ```

    Simply change the number to your desired price.

3.  **Save and Verify:**
    - Save the file (`Ctrl + S`).
    - If the app is running locally (`npm run dev`), the browser will automatically refresh, and you should see the new price immediately.

---

## 5. Deployment (Hosting the App)

To share the configurator with the world, you can host it for free on platforms like **Vercel** or **Netlify**.

### Option A: Deploy to Vercel (Recommended)

1.  Create an account at [vercel.com](https://vercel.com).
2.  Install the Vercel CLI or link your GitHub account.
3.  **Import the Project:**
    - Click "Add New Project" -> "Import Git Repository".
4.  **Configure Environment Variables:**
    - During the import step, look for the **"Environment Variables"** section.
    - Add the three keys exactly as they appear in your `.env` file:
      - `VITE_CLOUDINARY_CLOUD_NAME`
      - `CLOUDINARY_API_KEY`
      - `CLOUDINARY_API_SECRET`
5.  Click **Deploy**.
6.  Vercel will give you a live URL (e.g., `pilepad-configurator.vercel.app`).

### Option B: Build for Manual Hosting

If you want to host it on a standard web server (cPanel, Hostinger, etc.):

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  This will create a `dist` folder in your project.
3.  Upload the **contents** of the `dist` folder to your website's `public_html` folder.

---

## 6. Important Notes for the Client

- **Images:** If you change the Cloudinary account, ensure the new account has the same folder structure and image names (Public IDs) as the original, otherwise the configurator may show "Image not found" errors.

---
