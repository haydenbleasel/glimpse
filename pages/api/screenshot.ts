import type { NextApiHandler } from 'next';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export type ScreenshotResponse = {
  error?: string;
  image?: string;
};

const handler: NextApiHandler<ScreenshotResponse> = async (req, res) => {
  const { url } = req.body as { url: string };

  if (!url) {
    res.status(400).json({ error: 'No URL specified' });
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
    await page.setViewport({ width: 1200, height: 750 });
    await page.goto(url, { waitUntil: 'networkidle0' });
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
