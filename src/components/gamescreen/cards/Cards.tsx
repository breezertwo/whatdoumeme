import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import TextCard from './Card';

const useStyles = makeStyles<Theme, CardsProps>(() =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      margin: '5px 0',
    },
    gridList: {
      flexWrap: (props) => (props.isCzar && props.isShowComitted ? 'wrap' : 'nowrap'),
      justifyContent: (props) => (props.isCzar && props.isShowComitted ? 'center' : ''),
    },
  })
);

interface Card {
  text?: string;
  name?: string;
  cardId: string;
}

export interface CardsProps {
  playerCards: Card[];
  isCzar?: boolean;
  isShowComitted?: boolean;
  onCardClicked: (id: string) => void;
}

const Cards = ({
  playerCards,
  isCzar = false,
  isShowComitted = false,
  onCardClicked,
}: CardsProps): JSX.Element => {
  const [isHl, setIsHl] = useState<string>(null);
  const classes = useStyles({ playerCards, isCzar, isShowComitted, onCardClicked });

  const onCardClickedInner = (id: string) => {
    setIsHl(id);
    onCardClicked(id);
  };

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={5}>
        {playerCards &&
          playerCards.map((card, i) => (
            <TextCard
              onCardClicked={onCardClickedInner}
              key={i}
              cardId={card.cardId}
              isCzar={isCzar}
              isShowComitted={isShowComitted}
              text={card.text ? card.text : card.name}
              isHighlighted={card.cardId === isHl}
            />
          ))}
      </GridList>
    </div>
  );
};

export default Cards;
