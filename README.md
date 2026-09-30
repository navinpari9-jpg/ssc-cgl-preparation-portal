# SSC CGL Preparation Portal

A full-stack, all-in-one preparation platform for students preparing for the **Staff Selection Commission Combined Graduate Level (SSC CGL Tier-1 & Tier-2)** examination.

## Features

- **NTA/SSC Examination Simulator**: 60-minute mock test engine with live countdown timer, 5-state question palette (*Not Visited*, *Not Answered*, *Answered*, *Marked for Review*, *Answered & Marked for Review*), and SSC negative marking rules (`+2.0` / `-0.50`).
- **Complete Tier-1 Syllabus Coverage**:
  - **Quantitative Aptitude**: 15 topics (Arithmetic, Algebra, Geometry, Trigonometry, Mensuration, Number System, DI).
  - **General Intelligence & Reasoning**: 12 topics (Syllogisms, Coding-Decoding, Blood Relations, Direction Sense, Series).
  - **English Language & Comprehension**: 13 topics (50 Golden Grammar Rules, Vocabulary Root Words, Idioms, Active-Passive, Cloze Tests).
  - **General Awareness**: 10 topics (Indian Polity & Articles, Modern History, Physical Geography, General Science, Static GK).
- **Gemini 3.8 Flash AI SSC Tutor**: Instant 24/7 doubt resolution, step-by-step math problem solving, grammar explanations, and 15-second shortcut tricks.
- **AI Question Generator**: Generate custom multiple-choice question sets for any subject, topic, and difficulty tier.
- **Diagnostic Performance Analytics & AI Revision Plans**: Score trends, sectional accuracy radars, time-per-question metrics, and personalized AI improvement blueprints.
- **Personalized Daily Study Planner**: Tailored daily schedules based on target exam date, daily available hours, and weak subject areas.
- **Authentic Previous Year Papers (PYQ)**: Exam shifts from 2021, 2022, 2023, and 2024 with detailed bilingual solutions.
- **Current Affairs & Exam Quiz**: Monthly high-yield national & international affairs capsules with interactive questions.
- **Formula Pocket Sheets & Short Tricks**: Concise memory cards for rapid mental calculation.
- **All-India Leaderboard & Badges**: National percentile rankings, streak trackers, and unlocked achievement badges.
- **Admin Management Console**: Manage master question banks, create tests, and analyze platform statistics.

---

## Running Locally in VS Code

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (Node Package Manager)

### Step 1: Install Dependencies
Open the project directory in VS Code or your terminal:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
In `.env`, optionally provide your Gemini API key (AI features include fallback sample solutions if unset):
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## Instant Demo Credentials
- **Student Access**: Click **"Demo Student"** in the Sign In modal or explore directly.
- **Admin Access**: Click **"Demo Admin"** in the Sign In modal or toggle via the user profile menu to unlock the Admin Management Console.
