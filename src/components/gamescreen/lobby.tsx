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
    },
    item: {
      backgroundColor: theme.palette.background.paper,
      margin: '5px 0;',
    },
  })
);

export interface LobbyProps {
  players: any[];
}

const Lobby = ({ players }: LobbyProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>Lobby:</h1>
      <List component="nav">
        {players.map((player, i) => (
          <ListItem key={i} className={classes.item}>
            {player.playerName}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Lobby;
