const puppeteer = require('puppeteer');
const pino = require('pino');

const log = pino({name: 'ringgo'});

async function ({username = '', password = '', zone = '', hours = 1, headless = true}) {
  log.info('running');

  const browser = await puppeteer.launch({headless});
  const page = await browser.newPage();

  log.info('navigating to page');
  await page.goto('https://m.myringgo.co.uk/login');

  log.info('filling in login form');
  await page.click('#field-cli');
  await page.keyboard.type(username);
  await page.click('#field-pin');
  await page.keyboard.type(password);
  
  log.info('logging in');
  await page.click('#currentMembers input[type="submit"]');
  await page.waitForNavigation();

  log.info('going to book page');
  await page.goto('https://m.myringgo.co.uk/bookparking');
  
  log.info('filling in zone form');
  await page.click('#zone');
  await page.keyboard.type(zone);

  log.info('submitting zone');
  await page.click('#ZoneVehicleSelect input[type="submit"]');
  await page.waitForNavigation();

  log.info('selecting time period');
  await page.select('#tariffdropdown', hours + ' Hour');

  log.info('submitting time period');
  await page.click('#Duration input[name="labyrinth_Duration_next"]');
  await page.waitForNavigation();

  log.info('extracting info');
  const price = await page.evaluate(() => document.querySelector('.div-priceLabel').textContent);

  log.info('submitting payment info');
  await page.click('#CardSelect input[name="labyrinth_CardSelect_next"]');
  await page.waitForNavigation();

  await page.screenshot({ path: 's.png' });

  log.info('closing browser');
  browser.close();
}

main().catch(err => {
  log.error(err);
  process.exit();
});
