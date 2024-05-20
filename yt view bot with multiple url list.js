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

  await page.setCookie({ name: 'cookieName', value: 'cookieValue' }); // replace 'cookieName' and 'cookieValue' with the actual cookie name and value

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

  const filePath = 'path/to/urls.txt';

  const videoUrls = (await fs.promises.readFile(filePath, 'utf-8')).toString().split('\n');

  for (const url of videoUrls) {
    const newPage = await browser.newPage();

    await newPage.goto(url);

    await newPage.waitForSelector('video');

    const videoElement = await newPage.$('video');

    const desiredSpeed = 16;

    await newPage.evaluate((element, speed) => {
      element.playbackRate = speed;
    }, videoElement, desiredSpeed);

    const qualityOptions = await newPage.evaluate((element) => {
      const options = Array.from(element.querySelectorAll('source')).map((source) => source.getAttribute('label'));
      return options.filter((option) => option!== null);
    }, videoElement);

    const lowestQualityIndex = qualityOptions.indexOf('144p');

    if (lowestQualityIndex!== -1) {
      await newPage.evaluate((element, index) => {
        element.src = element.querySelectorAll('source')[index].getAttribute('src');
        element.load();
      }, videoElement, lowestQualityIndex);
    }

    await newPage.evaluate((element) => {
      element.addEventListener('ended', () => {
        window.videoEnded = true;
      });
    }, videoElement);

    while (true) {
      await newPage.waitForFunction(() => {
        return window.videoEnded;
      });

      await newPage.evaluate(() => {
        window.videoEnded = false;
      });

      await newPage.close();

      if (videoUrls.indexOf(url) === videoUrls.length - 1) {
        break;
      }

      const nextPage = await browser.newPage();
      await nextPage.goto(videoUrls[videoUrls.indexOf(url) + 1]);
      await nextPage.waitForSelector('video');
      newPage = nextPage;
    }
  }

  // Close the browser (this line will be reached after all videos have been processed)
  await browser.close();
})();
