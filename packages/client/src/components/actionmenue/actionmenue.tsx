import React from 'react';
import Cookies from 'js-cookie';
import { Button, makeStyles } from '@material-ui/core';
import { Player, STATES } from '../../interfaces/api';

export interface ActionsViewProps {
  playerData: Player[];
  serverState: number;
  onTradeIn: () => void;
}

const useStyles = makeStyles({
  button: {
    margin: 5,
    flexGrow: 1,
  },
});

export const ActionsView = ({
  playerData,
  serverState,
  onTradeIn,
}: ActionsViewProps): JSX.Element => {
  const classes = useStyles();
  const winpoints = playerData.filter((player) => player.username === Cookies.get('userName'))[0]
    .tradeOptions;

  return (
    <>
      {serverState !== STATES.MEMELORD ? (
        <>
          <h2>Use a winpoint to reset your handcards</h2>
          <p>Winpoints left: {winpoints}</p>
          {winpoints > 0 ? (
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
    </>
  );
};
