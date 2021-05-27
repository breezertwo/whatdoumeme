import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles<Theme, CardsProps>(() =>
  createStyles({
    card: {
      borderRadius: 25,
      minHeight: (props) => (!props.isCzar ? 250 : 500),
      minWidth: (props) => (!props.isCzar ? 150 : 300),
      height: (props) => (!props.isCzar ? 250 : 500),
      width: (props) => (!props.isCzar ? 150 : 300),
      margin: 5,
      backgroundColor: (props) => (props.isHighlighted ? '#89e8a0' : 'white'),
    },
  })
);

export interface CardsProps {
  text: string;
  cardId: string;
  isHighlighted: boolean;
  isCzar: boolean;
  onCardClicked: (cardId: string) => void;
}

const TextCard = (props: CardsProps): JSX.Element => {
  const { text, isCzar, cardId, onCardClicked } = props;
  const classes = useStyles(props);

  return (
    <Card
      className={classes.card}
      variant="outlined"
      onClick={() => onCardClicked(cardId)}
    >
      <CardContent>
        {isCzar ? (
          <img src={`public/assets/memes/${text}`} alt="It's a meme" />
        ) : (
          <Typography variant="body2" component="p">
            {text}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TextCard;
