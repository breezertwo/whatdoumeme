import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Player } from '../../interfaces/api';
import { useMainContianerStyles } from '../gamescreen/views/styles/sharedStyles';
import { useGetPlayerFromPlayerData } from '../../hooks/useGetPlayerFromPlayerData';

export interface ActionsViewProps {
  playerData: Player[];
  onTradeIn: () => void;
}

const useStyles = makeStyles({
  button: {
    marginTop: 5,
  },
});

export const ActionsView = ({ playerData, onTradeIn }: ActionsViewProps): JSX.Element => {
  const player = useGetPlayerFromPlayerData(playerData);
  const classes = useStyles();
  const classesMain = useMainContianerStyles();

  return (
    <div className={classesMain.mainContainer}>
      {player && !player.isCzar ? (
        <>
          <h2>Use a winpoint to reset your handcards</h2>
          <p>Winpoints left: {player.tradeOptions}</p>
          {player.tradeOptions > 0 ? (
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={onTradeIn}>
              Use Winpoint
            </Button>
          ) : null}
        </>
      ) : (
        <p>No available action</p>
      )}
    </div>
  );
};
