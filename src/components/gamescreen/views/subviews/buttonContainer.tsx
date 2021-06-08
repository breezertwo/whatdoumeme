import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export interface ButtonContainerProps {
  active: boolean;
  onConfirmClicked?: () => void;
  onLeaveClick?: () => void;
}

export const ButtonContainer = ({
  active,
  onConfirmClicked,
  onLeaveClick,
}: ButtonContainerProps): JSX.Element => {
  const classes = useStyles();

  return (
    active && (
      <div className={classes.buttonContainer}>
        {onConfirmClicked && (
          <div onClick={onConfirmClicked} className="confirmBtn">
            Confirm Selection
          </div>
        )}
        {onLeaveClick && (
          <div onClick={onLeaveClick} className="confirmBtn cnclBtn">
            Leave Game
          </div>
        )}
      </div>
    )
  );
};
