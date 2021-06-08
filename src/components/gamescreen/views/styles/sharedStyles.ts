import { makeStyles } from '@material-ui/core';

export const useMainContianerStyles = makeStyles({
  mainContainer: {
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: '600px',
  },
});
