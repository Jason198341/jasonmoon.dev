/**
 * One-time Strava OAuth helper.
 *
 * Usage:
 *   1. Fill STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env
 *   2. Run: node scripts/strava-auth.mjs
 *   3. Open the printed URL in a browser → Authorize
 *   4. Copy the `code` query param from the redirect URL
 *   5. Paste it when prompted → receive your refresh_token
 *   6. Add the refresh_token to .env as STRAVA_REFRESH_TOKEN
 */

import { config } from 'dotenv';
import { createInterface } from 'readline';

config();

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in .env first.');
  process.exit(1);
}

const authUrl =
  `https://www.strava.com/oauth/authorize` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=http://localhost` +
  `&response_type=code` +
  `&scope=read,activity:read`;

console.log('\n🔗 Open this URL in your browser:\n');
console.log(authUrl);
console.log('\nAfter authorizing, you will be redirected to a localhost URL.');
console.log('Copy the "code" query parameter from that URL.\n');

const rl = createInterface({ input: process.stdin, output: process.stdout });

rl.question('Paste the code here: ', async (code) => {
  rl.close();

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code.trim(),
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    console.error('❌ Token exchange failed:', await res.text());
    process.exit(1);
  }

  const data = await res.json();
  console.log('\n✅ Success! Add this to your .env:\n');
  console.log(`STRAVA_REFRESH_TOKEN=${data.refresh_token}`);
  console.log(`\nAthlete: ${data.athlete?.firstname} ${data.athlete?.lastname}`);
});
