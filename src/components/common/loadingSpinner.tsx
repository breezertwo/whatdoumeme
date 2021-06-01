import React from 'react';
import { makeStyles } from '@material-ui/core';

interface LoadingProps {
  msg: string;
}

const useStyles = makeStyles({
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const LoadingSpinner = ({ msg }: LoadingProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.spinnerContainer}>
      <h1>{msg}</h1>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;
