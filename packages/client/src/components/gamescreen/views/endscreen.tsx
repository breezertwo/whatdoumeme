import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useIsHost } from '../../../hooks/useIsHost';
import { PlayerList } from '../../common';
import { useMainContianerStyles } from './styles/sharedStyles';

export interface EndScreenProps {
  playerData: any[];
  onRestart: () => void;
  onLeave: () => void;
}

const useStyles = makeStyles({
  divContainerEnd: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: 5,
    flexGrow: 1,
  },
});

export const EndScreenView = ({ playerData, onRestart, onLeave }: EndScreenProps): JSX.Element => {
  const classes = useStyles();
  const isHost = useIsHost(playerData);

  return (
    // TODO: Style properly
    <div>
      <h1>Game ended!</h1>
      <PlayerList players={playerData} includeGameData={true} />
      <div className={classes.divContainerEnd}>
        {isHost && (
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={onRestart}>
            Start new round
          </Button>
        )}
        <Button variant="contained" className={classes.button} color="secondary" onClick={onLeave}>
          Leave
        </Button>
      </div>
    </div>
  );
};
