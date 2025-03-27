# SendMe

**SendMe** is a secure, file-sharing web app inspired by WeTransfer.

Upload your files (up to 5GB), receive a one-click shareable link, and paste it into a browser to retrieve the files. Files are grouped and downloaded as a zip, then automatically deleted after 24h for privacy.

Frontend deployed with **Netlify**, backend with **Render**.

---

## ✨ Features

- Upload files (up to 5GB)
- Share via auto-generated links
- Files expire after 24h (based on Google Cloud Storage rules)
- Clean, responsive UI
- Mobile-friendly
- Secure backend, hidden credentials

---

## 🧳 Live Demo

[https://sendmethestuff.com](https://sendmethestuff.com)

---

## 💾 Tech Stack

**Frontend:** React, Vite, Tailwind CSS\
**Backend:** Node.js, Express.js, Google Cloud Storage\
**Hosting:** Netlify (frontend), Render (backend)

---

## 🔧 Local Setup Instructions

Clone this repo:

```bash
git clone https://github.com/ndrada/SendMeTheStuff.git
cd SendMeTheStuff
```

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Setup the backend

```bash
cd backend
npm install
```

### 3. Add your Google Cloud credentials

- Create a new bucket in Google Cloud Storage
- Enable the **IAM & Admin** and **Service Account Keys**
- Download your `google-cloud-key.json` and place it inside the `/backend` folder

#### Your `.env` file inside `/backend` should include:

```
PORT=5000
GCLOUD_PROJECT_ID=your-project-id
GCLOUD_KEYFILE=google-cloud-key.json
GCLOUD_BUCKET=your-bucket-name
```

### 4. Run backend locally

```bash
node index.js
```

### 5. Run frontend

From root:

```bash
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173)\
Backend runs on [http://localhost:5000](http://localhost:5000)

---

## 🚧 Folder Structure

```
.
├── backend
│   ├── index.js
│   ├── storage.js
│   ├── google-cloud-key.json (you add this)
│   └── .env
├── src
│   ├── assets
│   ├── App.jsx
│   └── FrontendUI.jsx
├── public
├── dist
├── package.json
├── vite.config.js
└── README.md
```

---

## 🌐 Deploy Your Own Version

- **Frontend:** Deploy with Netlify, Vercel, or your host of choice.
- **Backend:** Deploy to Render (easy 1-click deploy with environment variables support)

---

## 📄 License

This project is open-source and free to use for learning or building your own version. Please credit if you fork!

---
