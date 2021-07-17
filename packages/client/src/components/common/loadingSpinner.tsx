import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useMainContianerStyles } from '../gamescreen/views/styles';

interface LoadingProps {
  msg?: string;
  requestMemeUrl?: () => Promise<string>;
}

const useStyles = makeStyles({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 1,
    '& > *': {
      margin: 10,
    },
  },
});

const LoadingSpinner = ({ msg, requestMemeUrl }: LoadingProps): JSX.Element => {
  const [memeURL, setMemeURL] = useState<string>(undefined);
  const classes = useStyles();
  const classesMain = useMainContianerStyles();

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
    <div className={classesMain.mainContainer}>
      <div className={classes.loadingContainer}>
        <h1>{msg}</h1>
        <div className="loader"></div>
        {memeURL && (
          <div>
            <p> Random reddit meme: </p>
            <img style={{ width: '100%' }} src={memeURL}></img>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
