import type { NextApiHandler } from 'next';
import type { PuppeteerLifeCycleEvent } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export type ScreenshotResponse = {
  error?: string;
  image?: string;
};

type RequestData = {
  url?: string;
  height?: number;
  width?: number;
  waitUntil?: PuppeteerLifeCycleEvent;
};

const handler: NextApiHandler<ScreenshotResponse> = async (req, res) => {
  const {
    url,
    width = 1920,
    height = 1080,
    waitUntil = 'networkidle0',
  } = req.body as RequestData;
  const { Authorization } = req.headers;

  if (!url) {
    res.status(400).json({ error: 'No URL specified' });
    return;
  }

  if (!Authorization || Authorization !== process.env.GLIMPSE_PASSPHASE) {
    res.status(401).json({ error: `Unauthorized: ${Authorization as string}` });
    return;
  }

  try {
    const browser = await puppeteer.launch(
      process.env.AWS_EXECUTION_ENV
        ? {
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
          }
        : {
            args: [],
            executablePath:
              '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          }
    );

    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil });
    const image = (await page.screenshot({
      type: 'png',
      encoding: 'base64',
    })) as string;

    await browser.close();

    if (!image) {
      res.status(400).json({ error: 'No image found' });
      return;
    }

    res.status(200).json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : (error as string);
    res.status(500).json({ error: message });
  }
};

export default handler;
