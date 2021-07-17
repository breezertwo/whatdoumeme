import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import { Button, TextField } from '@material-ui/core';
import { PlayerList } from '../../common';
import { useIsHost } from '../../../hooks/useIsHost';
import { Player } from '../../../interfaces/api';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    divContainerEnd: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      margin: 5,
      flexGrow: 1,
    },
    spacing: {
      margin: 5,
    },
  })
);

export interface LobbyProps {
  players: Player[];
  onLeaveClick: () => void;
  onStartClick: (maxWinPoints?: number) => void;
}

export const Lobby = ({ players, onStartClick, onLeaveClick }: LobbyProps): JSX.Element => {
  const [maxPoints, setMaxPoints] = useState(4);
  const classes = useStyles();
  const isHost = useIsHost(players);

  const handleInputChange = (event) => {
    setMaxPoints(event.target.value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.spacing}>
          <h2>Lobby: {Cookies.get('roomId')}</h2>
        </div>
        <div className={classes.divContainerEnd}>
          {isHost && (
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={() => onStartClick(maxPoints)}>
              Start
            </Button>
          )}
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            onClick={onLeaveClick}>
            Leave
          </Button>
        </div>
      </div>
      {isHost && (
        <div className={`${classes.header} ${classes.spacing}`}>
          <p>Points to win: </p>
          <TextField
            label="Points"
            id="ptw"
            defaultValue="4"
            variant="outlined"
            size="small"
            onChange={handleInputChange}
          />
        </div>
      )}
      <PlayerList players={players} />
    </div>
  );
};
