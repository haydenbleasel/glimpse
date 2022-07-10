import Image from 'next/future/image';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { ArrowUpRight } from 'react-feather';
import type { ScreenshotResponse } from '../api/screenshot';
import Placeholder from './placeholder';

type PreviewLinkProps = LinkProps & {
  children: ReactNode;
};

const PreviewLink: FC<PreviewLinkProps> = ({ children, href, ...props }) => {
  const [screenshot, { execute }] = useAsync(async () => {
    const response = await fetch('/api/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
        <span className="pointer-events-none absolute left-0 bottom-full ml-[50%] flex h-[205px] w-[318px] -translate-x-2/4 -translate-y-0 rounded-lg border border-gray-50 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:-translate-y-2 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
          {screenshot.result?.image ? (
            <Image
              src={`data:image/png;base64,${screenshot.result.image}`}
              width={300}
              height={187}
              alt=""
              className="m-0 h-[187px] w-[300px]"
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
        className="text-md inline font-normal text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
        passHref
        {...props}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          {children}
          <ArrowUpRight
            size={14}
            className="ml-[2px] inline -translate-y-[2px]"
          />
        </a>
      </Link>
    </span>
  );
};

export default PreviewLink;
