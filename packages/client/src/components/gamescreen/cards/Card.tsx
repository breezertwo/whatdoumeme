export interface CardProps {
  text: string;
  cardId: string;
  isHighlighted: boolean;
  isCzar: boolean;
  isShowComitted: boolean;
  onCardClicked: (cardId: string) => void;
}

const TextCard = (props: CardProps) => {
  const { text, isCzar, isShowComitted, cardId, onCardClicked, isHighlighted } = props;

  const cardClass = ['text-card', isCzar && !isShowComitted ? 'text-card--czar' : '', isHighlighted ? 'text-card--highlighted' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass} onClick={() => onCardClicked(cardId)}>
      {isCzar ? <img className="text-card__img" src={`assets/memes/${text}`} alt="It's a meme" /> : <p>{text}</p>}
    </div>
  );
};

export default TextCard;
