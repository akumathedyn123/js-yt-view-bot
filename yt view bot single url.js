// Owner: Md. N e H Jack
// Github profile: https://github.com/akumathedynd
// Copyright ©2020 Md. N e H Jack. All right reseved.
// Disclaimer: This code is provided for educational purposes only. The author is not responsible for any damages or hazards caused by its use. 


const puppeteer = require('puppeteer');
const fs = require('fs');
const faker = require('faker');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const headers = {
    'Accept-Language': faker.random.locale(),
    'User-Agent': faker.internet.userAgent(),
    'X-Forwarded-For': faker.internet.ip(),
    'X-Real-IP': faker.internet.ip(),
    'Referer': faker.internet.url(),
    'Origin': faker.internet.url(),
    'DNT': '1',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  await page.setExtraHTTPHeaders(headers);

  await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  await page.waitForSelector('video');

  await page.evaluate(() => {
    document.querySelector('video').play();
  });

  await page.evaluate((speed) => {
    document.querySelector('video').playbackRate = speed;
  }, 16);

  await page.waitForFunction(() => {
    return document.querySelector('video').ended;
  });

  await browser.close();
})();
