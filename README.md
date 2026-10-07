# Cat Clicker Haven

A cat house clicker game with a shared leaderboard. Each buyer connects the app to their own Supabase project; this repository does not include the seller's database credentials.

## Requirements

- Node.js and npm
- A Supabase account and project
- Supabase CLI

## Set up your Supabase project

1. Install the app dependencies:

   ```sh
   npm install
   ```

2. Create a Supabase project. In **Project Settings > API Keys**, copy its Project URL and publishable key.

3. Copy `.env.example` to `.env` and fill in your values:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

   The publishable key is intended for browser use. Never put a secret key or service role key in a `VITE_` variable or browser code.

4. Sign in with the Supabase CLI, link your project, and apply the database migration:

   ```sh
   supabase login
   supabase link --project-ref your-project-ref
   supabase db push
   ```

   The migration creates the `house_clicks` table, enables Row Level Security, allows public score reads, and adds the `add_clicks` RPC used by the game.

5. Start the development server:

   ```sh
   npm run dev
   ```

## Deploy

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in your hosting provider's environment settings before building, then run:

```sh
npm run build
```

Vite embeds these values in the built frontend. Set them for each deployment environment and rebuild after changing them.

## How score persistence works

House totals are stored in the connected Supabase database. The app loads the totals from Supabase and sends click batches to the database while you play, so totals remain after a page refresh and are shared by everyone using that same Supabase project.

The app currently requires a working Supabase connection. Removing `.env` does not convert it to offline mode: a development server that was already running may still have the old settings loaded, and a deployed build may contain its own settings. Restart the development server after changing environment variables. Without a valid Supabase project, score reads and writes will fail until the app is configured again.

## Security and limitations

- Keep `.env` and Supabase CLI state private. `.env.example` contains placeholders only.
- The leaderboard is public and unauthenticated. Anyone can call the score RPC, up to 200 clicks per request, and repeat requests or automate them. This is suitable for a casual game or demo, not prizes or trusted competition scores.
- Add authentication and server-side rate limiting before using the leaderboard for a public service or any competition. Do not rely on browser-side click limits.
- The functions in `supabase/functions` are separate endpoints that use the service role key on the server. The app currently calls Supabase directly, so those functions do not need to be deployed for the core game.
- Source code delivery does not define reuse rights by itself. The seller should specify the license and support terms separately.
