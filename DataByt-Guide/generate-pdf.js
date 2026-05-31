const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML   = path.resolve(__dirname, 'flow-diagram.html');
const OUT    = path.resolve(__dirname, 'DataByt-Flow-Diagram.pdf');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(`file:///${HTML.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    landscape: false,
    scale: 0.72,
    margin: { top: '6mm', right: '6mm', bottom: '6mm', left: '6mm' },
  });

  await browser.close();
  console.log('PDF saved to:', OUT);
})();
