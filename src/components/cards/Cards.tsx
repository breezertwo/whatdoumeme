import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import TextCard from './Card';

const useStyles = makeStyles<Theme, CardProps>(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      margin: '5px 0',
    },
    gridList: {
      flexWrap: (props) => (!props.isCzar ? 'nowrap' : 'wrap'),
      justifyContent: (props) => (!props.isCzar ? '' : 'center'),
    },
  })
);

interface Card {
  text: string;
  cardId: string;
}

export interface CardProps {
  playerCards: Card[];
  isCzar: boolean;
  onCardClicked: (id: string) => void;
}

const Cards = (props: CardProps): JSX.Element => {
  const [isHl, setIsHl] = useState<string>(null);
  const classes = useStyles(props);

  const onCardClicked = (id: string) => {
    setIsHl(id);
    props.onCardClicked(id);
  };

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={5}>
        {props.playerCards.map((card, i) => (
          <TextCard
            onCardClicked={onCardClicked}
            key={i}
            cardId={card.cardId}
            text={card.text}
            isHighlighted={card.cardId === isHl}
          />
        ))}
      </GridList>
    </div>
  );
};

export default Cards;
