#!/usr/bin/env node
/**
 * Ping IndexNow so Bing (and Yandex, Seznam, Naver) re-crawl changed pages
 * within minutes instead of waiting for their normal crawl cycle.
 *
 * Google does NOT participate in IndexNow — for Google, rely on the sitemap
 * plus "Request indexing" in Search Console.
 *
 * Usage:
 *   npm run seo:indexnow                 # submits every URL in the sitemap
 *   npm run seo:indexnow -- <url> ...    # submits only the URLs you name
 */
import { readFileSync, readdirSync } from 'node:fs';

const HOST = 'nelera.net';
const ORIGIN = `https://${HOST}`;

const keyFile = readdirSync('.').find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file (<key>.txt) found in the project root.');
  process.exit(1);
}
const key = readFileSync(keyFile, 'utf8').trim();
if (key !== keyFile.replace(/\.txt$/, '')) {
  console.error(`Key file ${keyFile} must contain exactly its own filename minus ".txt".`);
  process.exit(1);
}

const cliUrls = process.argv.slice(2).filter((a) => a.startsWith('http'));
const urlList = cliUrls.length
  ? cliUrls
  : [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error('No URLs to submit.');
  process.exit(1);
}

const body = { host: HOST, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList };
console.log(`Submitting ${urlList.length} URL(s) to IndexNow:`);
urlList.forEach((u) => console.log('  ' + u));

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

// 200 = accepted, 202 = accepted but key not yet verified (it will retry the key fetch).
if (res.status === 200 || res.status === 202) {
  console.log(`\nOK — HTTP ${res.status}. Bing will pick these up shortly.`);
} else {
  console.error(`\nFailed — HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}
