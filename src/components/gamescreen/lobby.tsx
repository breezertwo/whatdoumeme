import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
      alignContent: 'center',
    },
    item: {
      backgroundColor: theme.palette.background.paper,
      margin: '5px 0;',
    },
  })
);

export interface LobbyProps {
  players: any[];
  onLeaveClick: () => void;
}

const Lobby = ({ players, onLeaveClick }: LobbyProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1>Lobby:</h1>
        <div className="cnclBtn" onClick={onLeaveClick}>
          Leave
        </div>
      </div>
      <List component="nav">
        {players.map((player, i) => (
          <ListItem key={i} className={classes.item}>
            {player.username}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Lobby;
