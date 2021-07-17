import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PersonIcon from '@material-ui/icons/Person';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Player } from '../../interfaces/api';

import CrownSolid from '../../assets/svg/crown-solid.svg';

const useStyles = makeStyles(() =>
  createStyles({
    item: {
      backgroundColor: '#feffed',
      margin: '5px 0;',
      minWidth: 250,
    },
    itemCzar: {
      backgroundColor: '#685c77',
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
    nameContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 0.05,
      alignItems: 'center',
    },
    spacing: {
      margin: 5,
    },
  })
);

export interface PlayerListProps {
  players: Player[];
  includeGameData?: boolean;
}

export const PlayerList = ({ players, includeGameData = false }: PlayerListProps): JSX.Element => {
  const classes = useStyles();

  return (
    <List className={classes.spacing} component="nav">
      {players.map((player, i) => (
        <ListItem
          key={i}
          className={
            player.host && !includeGameData
              ? classes.itemHost
              : player.isCzar && includeGameData
              ? classes.itemCzar
              : classes.item
          }>
          <div className={classes.listItemContainer}>
            <div className={classes.nameContainer}>
              {player.isCzar && includeGameData && <CrownSolid />}
              {player.host && !includeGameData && <PersonIcon />}
              {player.username}
            </div>
            {includeGameData ? <p>Score: {player.score}</p> : null}
          </div>
        </ListItem>
      ))}
    </List>
  );
};
