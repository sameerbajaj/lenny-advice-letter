# Time Capsule ⏳

> Get a personal letter from product leaders who were in your exact situation

A beautiful web app that generates personalized advice letters using wisdom from 303 episodes of Lenny's Podcast. Uses AI to match your career situation with relevant insights from guests like Brian Chesky, Julie Zhuo, Shreyas Doshi, and more.

## ✨ Features

- **Sentence-builder input** - Low friction, 3 taps to describe your situation
- **AI-powered letter generation** - Uses Gemini to find relevant quotes from real podcast transcripts
- **Beautiful, paper-like design** - Warm, nostalgic aesthetic perfect for sharing
- **Shareable results** - One-click share to Twitter/X with pre-filled text

## 🚀 Quick Start

1. Clone the repo and install dependencies:

```bash
cd app
npm install
```

2. Add your Gemini API key to `.env.local`:

```bash
# Get your free key from https://aistudio.google.com/apikey
GEMINI_API_KEY=your_key_here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000/tools/timecapsule](http://localhost:3000/tools/timecapsule)

## 🛠️ Tech Stack

- **Next.js 16** - App Router, API Routes
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Google Gemini** - AI letter generation
- **gray-matter** - Transcript parsing

## 📦 Deployment

This app is designed to be hosted at a subpath (e.g., `sameerbajaj.com/tools/timecapsule`).

Deploy to Vercel:

```bash
vercel
```

Make sure to:
1. Set `GEMINI_API_KEY` in Vercel environment variables
2. Configure rewrites if hosting at a subpath

## 📚 Based On

- [Lenny's Podcast Transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts) - 303 podcast episodes
- [Lenny's Podcast](https://www.lennyspodcast.com/) - The original content

## 📝 License

MIT - Built with ❤️ for the product community
