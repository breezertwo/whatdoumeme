import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PersonIcon from '@material-ui/icons/Person';
import Cookies from 'js-cookie';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
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
    item: {
      backgroundColor: theme.palette.background.paper,
      margin: '5px 0;',
    },
    itemHost: {
      backgroundColor: '#f0c348',
      margin: '5px 0;',
    },
    listItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 1,
    },
    divContainerEnd: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    spacing: {
      margin: 5,
    },
    button: {
      margin: 5,
      flexGrow: 1,
    },
  })
);

export interface LobbyProps {
  players: any[];
  onLeaveClick: () => void;
  onStartClick: () => void;
}

export const Lobby = ({ players, onStartClick, onLeaveClick }: LobbyProps): JSX.Element => {
  const [isHost, setIsHost] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (players.length > 0) {
      const player = players.filter((player) => player.username === Cookies.get('userName'))[0];
      if (player) {
        setIsHost((player as any).host);
      }
    }
  }, [players]);

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
              onClick={onStartClick}>
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
      <List className={classes.spacing} component="nav">
        {players.map((player, i) => (
          <ListItem key={i} className={player.host ? classes.itemHost : classes.item}>
            <div className={classes.listItemContainer}>
              {player.username}
              {player.host ? <PersonIcon /> : null}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
