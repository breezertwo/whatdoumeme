import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles<Theme, CardsProps>(() =>
  createStyles({
    card: {
      borderRadius: 25,
      minHeight: 250,
      minWidth: 150,
      width: 150,
      height: 250,
      margin: 5,
      backgroundColor: (props) => (props.isHighlighted ? '#89e8a0' : 'white'),
    },
  })
);

export interface CardsProps {
  text: string;
  cardId: number;
  isHighlighted: boolean;
  onCardClicked: (cardId: number) => void;
}

const TextCard = (props: CardsProps): JSX.Element => {
  const { text, cardId, onCardClicked } = props;
  const classes = useStyles(props);

  return (
    <Card
      className={classes.card}
      variant="outlined"
      onClick={() => onCardClicked(cardId)}
    >
      <CardContent>
        <Typography variant="body2" component="p">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TextCard;
