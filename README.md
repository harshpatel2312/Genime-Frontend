# Genime-Frontend

This is the frontend for **Genime**, an AI-based anime image generation project.
It connects to the **[Genime-Backend](https://github.com/harshpatel2312/Genime-Backend)** to generate anime-style art from text prompts — rendered dynamically in a sleek, responsive UI built with **Express, EJS, and TailwindCSS**.

---

## 📂 Project Structure
```bash
Genime-Frontend/
│
├── server.js                  # Main Express server
│
├── views/
│   └── index.ejs              # Single-page layout (prompt + generated image)
│
├── public/
│   ├── css/
│   │   └── style.css          # Custom wave + fade animations
│   ├── js/
│   │   └── loading.js         # Handles fetch, animation, and display logic
│   └── assets/
│       └── background-images/
│           └── Samurai.jpeg   # Background image
│
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file
└── .gitignore

```

## ⚙️ Tech Stack
- **Frontend**: Node.js, Express.js, EJS, TailwindCSS
- **Backend**: FastAPI (runs separately)
- **Language**: JavaScript (ES Modules)
- **Animations**: CSS keyframes for wave + fade effects

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/harshpatel2312/Genime-Frontend.git
cd Genime-Frontend
```

### 2️. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm start
```
> Note: By default, the app runs at http://127.0.0.1:3000

---

## 🧠 Environment Variables (optional)
If you want to store environment configs (for production or deployment),  
create a `.env` file in the root directory:
```env
PORT=3000
BACKEND_URL=http://127.0.0.1:8000/generate
```
Then load it in `server.js` using:
```javascript
import dotenv from "dotenv";
dotenv.config();
```

---

## 🎨 How It Works
1. User enters a text prompt and clicks **Generate**.
2. A wave animation and “Generating…” text appear.
3. The app sends the prompt to the [Genime-Backend](https://github.com/harshpatel2312/Genime-Backend).
4. Once generated, the image fades in smoothly below the prompt.

---

## 🧰 Future Improvements
- Add user authentication (login/signup)
- Allow multiple image generations
- Integrate direct image download button
- Add “Regenerate” and “Clear” actions

---

## 📸 Preview
![Genime Screenshot](https://github.com/user-attachments/assets/8ac4f8e0-2128-404f-b5e9-eceb5ed95398)

---

## 📜 License
Apache-2.0 @ Harsh Patel

