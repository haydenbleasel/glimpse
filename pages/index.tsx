import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import type { ScreenshotResponse } from './api/screenshot';

const Home: NextPage = () => {
  const [url, setUrl] = useState('https://haydenbleasel.com/');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const fetchScreenshot = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as ScreenshotResponse;

      if (data.error) {
        throw new Error(data.error);
      }

      setImage(data.image);
    } catch (apiError) {
      const message =
        apiError instanceof Error ? apiError.message : (apiError as string);

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Example:</p>
      <input
        type="text"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        disabled={loading}
      />
      <button onClick={fetchScreenshot} type="button" disabled={loading}>
        Test
      </button>
      {error && <p>Error: {error}</p>}
      {image && (
        <>
          <Image
            src={`data:image/png;base64,${image}`}
            width={1200}
            height={750}
            alt="Screenshot"
          />
          <pre>{`<Image src={\`data:image/png;base64,${image}\`} width={1200} height={750} alt="Screenshot" />`}</pre>
        </>
      )}
    </div>
  );
};

export default Home;
