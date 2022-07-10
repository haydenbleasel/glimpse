import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Camera, Globe, Star } from 'react-feather';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Link from '../components/link';

SyntaxHighlighter.registerLanguage('javascript', js);

const url = 'https://glimpse.haydenbleasel.com/';
const title = 'Glimpse - Hayden Bleasel';
const description =
  'Glimpse is a simple website screenshot tool to create link previews!';

const Home: NextPage = () => (
  <>
    <NextSeo
      title="Glimpse - Hayden Bleasel"
      description="Glimpse is a simple website screenshot tool to create link previews!"
      canonical={url}
      openGraph={{
        url,
        title,
        description,
        images: [
          {
            url: new URL('/cover.png', url).href,
            width: 1200,
            height: 630,
            alt: 'Glimpse',
            type: 'image/png',
          },
        ],
      }}
      additionalLinkTags={[
        {
          rel: 'icon',
          type: 'image/png',
          href: new URL('/favicon.png', url).href,
        },
      ]}
      twitter={{
        handle: '@haydenbleasel',
        cardType: 'summary_large_image',
      }}
    />
    <div className="container prose mx-auto py-24 px-4">
      <div className="text-md mb-16 flex items-center gap-2 text-gray-400">
        <Camera />
        <span>+</span>
        <Globe />
      </div>
      <h1>Glimpse</h1>
      <p>
        Glimpse is a simple website screenshot tool{' '}
        <Link href="https://haydenbleasel.com/">Hayden Bleasel</Link> made to
        create link previews! It&apos;s effectively an serverless API endpoint
        deployed on <Link href="https://vercel.com/">Vercel</Link> takes a URL
        and returns a screenshot of the page.
      </p>
      <h2>Can I use it on my site?</h2>
      <p>
        This specific domain is password-protected and designed to run my
        websites (my{' '}
        <Link href="https://haydenbleasel.com/">personal site</Link> and{' '}
        <Link href="https://tryneutral.com">Neutral</Link>) however if you fork
        the repo and deploy it to Vercel, you can use it on your site.
      </p>
      <h2>Why is it in a seperate repo?</h2>
      <p>
        Long story short, Vercel serverless functions have a 50MB limit which
        does{' '}
        <Link href="https://github.com/vercel/community/discussions/103">
          not always
        </Link>{' '}
        calculate the way you think it would. Other dependencies get mixed in
        the bundle size, even if they are not used in the API handler. It also
        needs{' '}
        <Link href="https://github.com/alixaxel/chrome-aws-lambda/issues/275">
          Node 14
        </Link>{' '}
        to run, which is a pretty specific requirement. So, I made it a separate
        repo to avoid all that drama and i just <code>fetch()</code> it from the
        API handler in my personal sites.
      </p>
      <h2>Can I see a demo?</h2>
      <p>
        You&apos;re looking at it! All the external links on this site use
        Glimpse to generate a preview. If you want to see how the API works,
        just enter a URL below (or use my personal website) and hit the button
        to see the result.
      </p>
      <h2>Once I clone it, how do I make it work?</h2>
      <p>Like so!</p>
      <h3>Client-side</h3>
      <p>
        Really depends on your implementation method but I used a{' '}
        <code>useAsync</code> hook from{' '}
        <Link href="https://react-hookz.github.io/web/?path=/docs/side-effect-useasync--example">
          @react-hookz/web
        </Link>{' '}
        to fetch the screenshot on-request client-side.
      </p>
      <SyntaxHighlighter
        language="javascript"
        style={atomOneDark}
        customStyle={{
          padding: '1.5rem',
          height: '24rem',
          overflow: 'auto',
        }}
      >{`import Image from 'next/future/image';
import Link from 'next/link';
import type { FC } from 'react';
import { useAsync, useMountEffect } from '@react-hookz/web';
import type { ScreenshotResponse } from '../pages/api/screenshot';
import Placeholder from './placeholder';

const PreviewLink: FC<{ href: string }> = ({ children, href, ...props }) => {
  const [screenshot, { execute }] = useAsync(async () => {
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      body: JSON.stringify({
        url: href,
      }),
    });

    const data = (await response.json()) as ScreenshotResponse;

    return data;
  });

  useMountEffect(async () => {
    await execute();
  });

  return (
    <span className="group relative inline-block">
      {!screenshot.error && !screenshot.result?.error && (
        <span className="pointer-events-none absolute left-0 bottom-full ml-[50%] flex h-[203px] w-[316px] -translate-x-2/4 -translate-y-0 rounded-lg border border-gray-50 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:-translate-y-2 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
          {screenshot.result?.image ? (
            <Image
              src={\`data:image/png;base64,\${screenshot.result.image}\`}
              width={300}
              height={187}
              alt=""
            />
          ) : (
            <Placeholder className="h-full w-full rounded-md" />
          )}
        </span>
      )}
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline text-md font-normal text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
        {...props}
      >
        {children}
      </Link>
    </span>
  );
};

export default PreviewLink;`}</SyntaxHighlighter>
      <h3>
        <code>/api/screenshot.ts</code>
      </h3>
      <SyntaxHighlighter
        language="javascript"
        style={atomOneDark}
        customStyle={{
          padding: '1.5rem',
          height: '24rem',
          overflow: 'auto',
        }}
      >{`import type { NextApiHandler } from 'next';

export type ScreenshotResponse = {
  error?: string;
  image?: string;
};

/* Replace this with your own data */
const glimpse = 'https://glimpse.haydenbleasel.com/api/screenshot';
const auth = 'my-secret-passphrase';

const handler: NextApiHandler<ScreenshotResponse> = async (req, res) => {
  const { url } = JSON.parse(req.body as string) as { url: string };

  if (!url) {
    res.status(400).json({ error: 'No URL specified' });
    return;
  }

  try {
    const response = await fetch(
      glimpse,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth,
        },
        body: JSON.stringify({
          url,
          width: 1200,
          height: 750,
        }),
      }
    );

    const { image, error } = (await response.json()) as ScreenshotResponse;

    if (error) {
      res.status(400).json({ error });
      return;
    }

    if (!image) {
      res.status(400).json({ error: 'No image found' });
      return;
    }

    res.status(200).json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : (error as string);

    res.status(400).json({ error: message });
  }
};

export default handler;
`}</SyntaxHighlighter>
      <h2>What are the limitations?</h2>
      <p>Three primarily, which I will work on fixing over time:</p>
      <ol>
        <li>
          Vercel serverless functions are limited to a 10-second timeout. You
          would think this is fine, but I have an inkling that doing multiple
          concurrent requests causes the function to stay on which causes later
          requests to timeout. 🤷‍♀️
        </li>
        <li>
          Puppeteer itself has a timeout which I may need to rework to fit
          Vercel&apos;s timeout.
        </li>
        <li>
          The screenshot tends to be taken prematurely, based on the fact
          we&apos;re waiting for <code>networkidle0</code>. For more complex
          websites with intro animations and custom fonts, the screenshot may be
          taken in an interim state. <code>networkidle2</code> would be a better
          choice but tends to timeout the function a lot more often.
        </li>
      </ol>
      <p>
        If a screenshot fails to load, it returns a nice error and you can
        handle this on the client-side like I&apos;ve done above.
      </p>
      <h2>Enough with the preamble. Gimme the code!</h2>
      <p>
        Fine! You can check out the source code on the{' '}
        <Link href="https://github.com/haydenbleasel/glimpse">GitHub repo</Link>
        . Feel free to fork it and do whatever, but a{' '}
        <Star size={16} className="inline align-baseline text-orange-600" />{' '}
        would be appreciated!
      </p>
    </div>
  </>
);

export default Home;
