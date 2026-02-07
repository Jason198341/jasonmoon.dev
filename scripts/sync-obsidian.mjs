/**
 * Sync archive data from Obsidian vault to jasonmoon.dev
 *
 * Usage: node scripts/sync-obsidian.mjs
 *
 * Reads from:
 *   C:\obsidian\04_학습\자존감 수업 100회 읽기 트래커.md
 *   C:\obsidian\04_학습\러닝 트래커.md
 *
 * This script parses the Obsidian markdown tables and rewrites
 * the Astro page data sections. Run it, then rebuild/deploy.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const OBSIDIAN = 'C:\\obsidian\\04_학습';

// --- Reading tracker ---
function parseReadingTracker() {
  const raw = readFileSync(resolve(OBSIDIAN, '자존감 수업 100회 읽기 트래커.md'), 'utf-8');

  // Parse progress: `[ 3/ 100 ]`
  const progressMatch = raw.match(/\[\s*(\d+)\s*\/\s*(\d+)\s*\]/);
  const current = progressMatch ? parseInt(progressMatch[1]) : 0;
  const goal = progressMatch ? parseInt(progressMatch[2]) : 100;

  // Parse table rows (only filled ones)
  const tableRegex = /\|\s*(\d+)\s*\|\s*(\S+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
  const sessions = [];
  let match;
  while ((match = tableRegex.exec(raw)) !== null) {
    const [, round, date, sentence, change] = match;
    if (date && date.trim() && date.trim() !== '') {
      sessions.push({
        round: parseInt(round),
        date: date.trim(),
        sentence: sentence.trim().replace(/^"|"$/g, ''),
        change: change.trim(),
      });
    }
  }

  // Parse detailed notes (### N회독 sections)
  const noteRegex = /### (\d+)회독.*?\n\n([\s\S]*?)(?=\n---|\n### |\n>|$)/g;
  const notes = new Map();
  while ((match = noteRegex.exec(raw)) !== null) {
    const round = parseInt(match[1]);
    const text = match[2].trim()
      .split('\n')
      .filter(l => !l.startsWith('|') && !l.startsWith('>'))
      .join(' ')
      .replace(/\*\*.*?\*\*/g, '')
      .trim();
    // Take first ~200 chars as summary
    notes.set(round, text.length > 300 ? text.slice(0, 297) + '...' : text);
  }

  // Merge
  for (const s of sessions) {
    s.note = notes.get(s.round) || '';
  }

  console.log(`Reading: ${current}/${goal} — ${sessions.length} sessions parsed`);
  return { current, goal, sessions };
}

// --- Running tracker ---
function parseRunningTracker() {
  const raw = readFileSync(resolve(OBSIDIAN, '러닝 트래커.md'), 'utf-8');

  // Parse cumulative stats
  const totalRunsMatch = raw.match(/총 러닝 횟수\s*\|\s*(\d+)/);
  const totalDistMatch = raw.match(/총 거리\s*\|\s*([\d.]+)/);
  const weeksMatch = raw.match(/연속 주\s*\|\s*(\d+)/);

  const stats = {
    totalRuns: totalRunsMatch ? parseInt(totalRunsMatch[1]) : 0,
    totalDistance: totalDistMatch ? parseFloat(totalDistMatch[1]) : 0,
    consecutiveWeeks: weeksMatch ? parseInt(weeksMatch[1]) : 0,
  };

  // Parse monthly sections
  const monthRegex = /## (2026년 \d+월)\n\n([\s\S]*?)(?=\n## |\n---\s*$|$)/g;
  const months = [];
  let match;
  while ((match = monthRegex.exec(raw)) !== null) {
    const monthName = match[1];
    const block = match[2];

    // Parse runs table
    const rowRegex = /\|\s*(\S+)\s*\|\s*(\S+)\s*\|\s*(\S+)\s*\|\s*(\S+)\s*\|\s*(.*?)\s*\|/g;
    const runs = [];
    let row;
    while ((row = rowRegex.exec(block)) !== null) {
      const [, date, distance, time, musicOff, thought] = row;
      if (date && date.trim() && !date.includes('날짜') && !date.includes(':')) {
        runs.push({
          date: date.trim(),
          distance: distance.trim(),
          time: time.trim(),
          musicOff: musicOff.trim() === 'O',
          thought: thought.trim(),
        });
      }
    }

    // Parse monthly reflection
    const reflMatch = block.match(/월말 돌아보기.*?\n>\s*\n>\s*(.+)/);
    const reflection = reflMatch && !reflMatch[1].includes('여기에 적기') ? reflMatch[1].trim() : undefined;

    if (runs.length > 0) {
      months.push({ month: monthName, runs, reflection });
    }
  }

  console.log(`Running: ${stats.totalRuns} runs, ${stats.totalDistance} km — ${months.length} months with data`);
  return { stats, months };
}

// --- Main ---
try {
  const reading = parseReadingTracker();
  const running = parseRunningTracker();
  console.log('\nSync complete! Data parsed from Obsidian.');
  console.log('Copy the data above into the Astro page files, then run: npm run build && npx vercel --prod');
} catch (err) {
  console.error('Error:', err.message);
}
