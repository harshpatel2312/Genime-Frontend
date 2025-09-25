# Genime-Frontend

**Genime-Frontend** is the user interface for **Genime**, an AI-powered anime image generator.  
It allows users to enter prompts, send them to the backend, and view generated results in a sleek, responsive interface.

---

## ✨ Features
- 🎨 **Prompt input with auto-expanding textarea**  
- 🔘 **Generate button** to trigger backend requests  
- 🌊 **Animated wave-style loading bar** that fills gradually  
- 📱 **Responsive design** built with TailwindCSS  
- 🔗 Seamless integration with **Genime-Backend**

---

## 📂 Project Structure
```bash
Genime-Frontend/
│
├── index.html # Main frontend page
├── assets/
│   └── background-images/ # Background images (e.g., Samurai.jpeg)
└── js/
|    ├── prompt-resize.js # Handles textarea resizing & focus styles
|    └── loading-bar.js # Controls wave loading animation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/harshpatel2312/Genime-Frontend.git
cd Genime-Frontend
```

### 2. Open the App
Simply open `index.html` in your browser.
> For local dev with backend, you may prefer to run via a local server (e.g., VSCode Live Server or `python -m http.server`).

### 3. Configure Backend URL
Update your frontend JavaScript to point to the **Genime-Backend API**.
Example:
```javascript
fetch("http://localhost:5000/generate", {
  method: "POST",
  body: JSON.stringify({ prompt }),
});
```

---

## 🛠️ Built With

- [TailwindCSS](https://tailwindcss.com/) – utility-first styling
- Vanilla JavaScript – DOM handling & animations
- HTML5 / CSS3 – semantic structure

---

## 🔗 Integration with Genime-Backend

- The frontend connects to [Genime-Backend](https://github.com/harshpatel2312/Genime-Backend) for prompt-based image generation.
- Ensure **CORS is enabled** on backend to allow requests from your frontend domain.
- Deploy both frontend + backend to the same domain or configure CORS for cross-origin access.

---

## 📸 Screenshots
(Add screenshots of your UI here: prompt box, loading bar, generated image)

---

## 📜 License
Apache-2.0 @ Harsh Patel

