# Lenny Advice Letter ⏳

> **Get a personal letter from product leaders who were in your exact situation.**

Built on top of [Lenny's Podcast Transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts) — 269 episodes of world-class product and growth advice.

## ✨ What is this?

You tell us where you are in your career. We find leaders from Lenny's Podcast who were in that same spot years ago. Then we generate a personalized letter with their hard-won wisdom — like advice from your future self.

**Featured guests include:**
- Brian Chesky (Airbnb)
- Julie Zhuo (Facebook Design)
- Shreyas Doshi (Stripe, Twitter)
- Claire Hughes Johnson (Stripe)
- And 265+ more...

## 🚀 Quick Start

### 1. Clone this repo

```bash
git clone https://github.com/sameerbajaj/lenny-advice-letter.git
cd lenny-advice-letter
```

### 2. Clone the transcript data

```bash
git clone https://github.com/ChatPRD/lennys-podcast-transcripts.git data
```

### 3. Install dependencies

```bash
cd app
npm install
```

### 4. Add your Gemini API key

Create a file called `.env.local` in the `app/` folder:

```bash
# app/.env.local
GEMINI_API_KEY=your_actual_api_key_here
```

**Get your free API key:** https://aistudio.google.com/apikey

### 5. Run the dev server

```bash
npm run dev
```

### 6. Open the app

Go to: http://localhost:3000/tools/timecapsule

---

## 🛠️ Tech Stack

- **Next.js 16** — App Router, API Routes
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Beautiful animations
- **Google Gemini 2.0 Flash** — AI letter generation

## 📦 Project Structure

```
lenny-advice-letter/
├── app/                    # Next.js application
│   ├── app/
│   │   ├── api/generate/   # Gemini API route
│   │   ├── page.tsx        # Main page
│   │   └── globals.css     # Styles
│   ├── components/         # React components
│   ├── types/              # TypeScript types
│   └── .env.local          # Your API key (create this!)
└── data/                   # Podcast transcripts (clone separately)
```

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set environment variable: `GEMINI_API_KEY`
4. Deploy!

---

## 🙏 Credits

- **Transcript Data:** [ChatPRD/lennys-podcast-transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts)
- **Original Content:** [Lenny's Podcast](https://www.lennyspodcast.com/)
- **Inspiration:** The incredible product community

## 📝 License

MIT — Built with ❤️ for the product community
