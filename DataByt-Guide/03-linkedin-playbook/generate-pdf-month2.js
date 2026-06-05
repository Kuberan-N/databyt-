const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find(p => fs.existsSync(p));
const HTML = path.resolve(__dirname, 'linkedin-playbook-month2.html');
const OUT = path.resolve(__dirname, 'DataByt-LinkedIn-Playbook-Month2.pdf');
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`file:///${HTML.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
  await browser.close();
  console.log('PDF saved:', OUT);
})();
