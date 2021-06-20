import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 5,
    flexGrow: 1,
  },
});

export interface ButtonContainerProps {
  onConfirmClicked?: () => void;
  onLeaveClick?: () => void;
}

export const ButtonContainer = ({
  onConfirmClicked,
  onLeaveClick,
}: ButtonContainerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {onConfirmClicked && (
        <Button
          variant="contained"
          className={classes.button}
          color="primary"
          onClick={onConfirmClicked}>
          Confirm
        </Button>
      )}
      {onLeaveClick && (
        <Button
          variant="contained"
          className={classes.button}
          color="secondary"
          onClick={onLeaveClick}>
          Leave
        </Button>
      )}
    </div>
  );
};
