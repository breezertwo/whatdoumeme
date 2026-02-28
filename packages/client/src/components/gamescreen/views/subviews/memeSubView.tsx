export interface MemeViewProps {
  currentMeme: string;
}

export const MemeView = ({ currentMeme }: MemeViewProps) => {
  return currentMeme ? (
    <div className="imgView">
      <img src={`assets/memes/${currentMeme}`}></img>
    </div>
  ) : null;
};
