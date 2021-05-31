import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PersonIcon from '@material-ui/icons/Person';
import Cookies from 'js-cookie';

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
    listContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 1,
    },
    divContainerEnd: {
      justifyContent: 'flex-end',
    },
    spacing: {
      margin: '10px 10px 10px 0',
    },
  })
);

export interface LobbyProps {
  players: any[];
  onLeaveClick: () => void;
  onStartClick: () => void;
}

const Lobby = ({
  players,
  onStartClick,
  onLeaveClick,
}: LobbyProps): JSX.Element => {
  const [isHost, setIsHost] = useState(false);
  const classes = useStyles();

  const combinedButtonContainerStyleClasses = `${classes.listContainer} ${classes.divContainerEnd}`;
  const combinedButtonStyleClasses = `grnBtn ${classes.spacing}`;

  useEffect(() => {
    if (players.length > 0) {
      const player = players.filter(
        (player) => player.username === Cookies.get('userName')
      )[0];
      if (player) {
        setIsHost((player as any).host);
      }
    }
  }, [players]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1>Lobby: {Cookies.get('roomId')}</h1>
        <div className={combinedButtonContainerStyleClasses}>
          {isHost && (
            <div className={combinedButtonStyleClasses} onClick={onStartClick}>
              Start
            </div>
          )}
          <div className="cnclBtn" onClick={onLeaveClick}>
            Leave
          </div>
        </div>
      </div>
      <List component="nav">
        {players.map((player, i) => (
          <ListItem
            key={i}
            className={player.host ? classes.itemHost : classes.item}
          >
            <div className={classes.listContainer}>
              {player.username}
              {player.host ? <PersonIcon /> : null}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Lobby;
