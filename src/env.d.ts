/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Vite raw string imports
declare module '*?raw' {
  const content: string;
  export default content;
}

// Cloudflare D1 bindings
type D1Database = import('@cloudflare/workers-types').D1Database;

interface Env {
  DB: D1Database;
  FIREWORKS_API_KEY: string;
  STRAVA_CLIENT_ID: string;
  STRAVA_CLIENT_SECRET: string;
  STRAVA_REFRESH_TOKEN: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
