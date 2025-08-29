# 🚀 EduMate: The AI-Powered Academic Co-Pilot

EduMate is a full-stack web application designed to be the ultimate academic co-pilot for college students. It solves the problem of disorganization by integrating essential study tools into a single, intuitive platform.

**Live Demo:** [Link to your Netlify App]

---

### ✨ Features

* ✅ **Secure User Authentication:** Unique accounts with JWT and password hashing.
* ✅ **Smart Notebook:** Create, view, and delete class notes.
* ✅ **Scheduler:** Add and manage reminders for deadlines and exams.
* ✅ **AI Study Helper:** Get instant text summaries using Google's Gemini API.
* ✅ **Productivity Dashboard:** Visualize your study habits with charts.

---

### 💻 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **AI:** Google Gemini API
* **Deployment:** Frontend on Netlify, Backend on Render

---

### 📸 Screenshots

![Dashboard View](URL_to_your_screenshot)
*A view of the main user dashboard with all the widgets.*

---

### 🛠️ Getting Started Locally

To run this project on your own machine:

1.  **Clone the repository:**
    `git clone https://github.com/your-username/EduMate.git`
2.  **Install backend dependencies:**
    `cd EduMate/backend`
    `npm install`
3.  **Install frontend dependencies** (if any):
    `cd ../`
4.  **Set up environment variables:**
    Create a `.env` file in the `/backend` folder and add the following variables:
    `GEMINI_API_KEY=your_key`
    `MONGO_URI=your_mongodb_uri`
    `yourSecretKey=your_jwt_secret`
5.  **Run the backend server:**
    `node server.js`
6.  Open the `index.html` file in your browser.
