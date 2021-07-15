import { makeStyles } from '@material-ui/core';

export const useMainContianerStyles = makeStyles({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '600px',
    padding: 10,
    overflow: 'hidden',
  },
});

export const useBasicFlex = makeStyles({
  basicFlex: {
    display: 'flex',
    flexGrow: 1,
  },
});
