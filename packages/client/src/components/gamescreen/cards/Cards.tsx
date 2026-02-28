import React, { useState } from 'react';
import TextCard from './Card';

interface Card {
  text?: string;
  name?: string;
  cardId: string;
}

export interface CardsProps {
  playerCards: Card[];
  isCzar?: boolean;
  isShowComitted?: boolean;
  onCardClicked?: (id: string) => void;
}

const Cards = ({ playerCards, isCzar = false, isShowComitted = false, onCardClicked }: CardsProps) => {
  const [isHl, setIsHl] = useState<string>(null);

  const onCardClickedInner = (id: string) => {
    setIsHl(id);
    onCardClicked(id);
  };

  const gridClass = `cards-grid${isCzar && isShowComitted ? ' cards-grid--wrap' : ''}`;

  return (
    <div className="cards-root">
      {playerCards ? (
        <div className={gridClass}>
          {playerCards.map((card, i) => (
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
        </div>
      ) : null}
    </div>
  );
};

export default Cards;
