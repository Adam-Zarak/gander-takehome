# Aircraft Fleet Management System

A modern web application for managing and monitoring aircraft fleet status, built with Next.js, Mapbox, and TypeScript.

## Features

- Real-time aircraft location tracking on an interactive map
- Status management (Available, Maintenance, AOG)
- Projected paths showing aircraft destinations based on status
- Dark mode support
- AI-powered chat assistant for fleet information
- Responsive design for desktop and mobile

## Prerequisites

- Node.js 18.x or later
- A Mapbox account and access token

## Environment Variables

Before running the application, you need to set up the following environment variables in a `.env.local` file:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your Mapbox token
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

1. Fork or clone this repository to your GitHub account
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository to Vercel
4. Add the required environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
5. Deploy!

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) - Interactive maps
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations

## License

MIT

