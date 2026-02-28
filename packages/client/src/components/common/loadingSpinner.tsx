import React, { useEffect, useState } from 'react';

interface LoadingProps {
  msg?: string;
  requestMemeUrl?: () => Promise<string>;
}

const LoadingSpinner = ({ msg, requestMemeUrl }: LoadingProps) => {
  const [memeURL, setMemeURL] = useState<string>(undefined);

  useEffect(() => {
    setTimeout(async () => {
      try {
        const url = await requestMemeUrl();
        setMemeURL(url);
      } catch (error) {
        console.error('[SERVER ERROR] No connection');
      }
    }, 50);
  }, []);

  return (
    <div className="main-container">
      <div className="loading-container">
        <h1>{msg}</h1>
        <div className="loader"></div>
        {memeURL && (
          <div className="meme-container">
            <p>Random reddit meme:</p>
            <img style={{ width: '100%' }} src={memeURL} alt="Random meme" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
