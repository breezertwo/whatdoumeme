import { RoundData } from '../../../interfaces/api';
import Cards from '../cards/Cards';
import { MemeView } from './subviews';

export interface WinnerViewProps {
  roundData: RoundData;
}

export const WinnerView = ({ roundData }: WinnerViewProps) => {
  const { currentMeme, playerCards } = roundData;

  return (
    <div className="main-container">
      <h2 style={{ alignSelf: 'center' }}>Winner of this round is: {roundData.winner}</h2>
      <MemeView currentMeme={currentMeme} />
      <Cards playerCards={playerCards} />
    </div>
  );
};
