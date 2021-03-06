import React from 'react';

export interface MemeViewProps {
  currentMeme: string;
}

export const MemeView = ({ currentMeme }: MemeViewProps): JSX.Element => {
  return currentMeme ? (
    <div className="imgView">
      <img src={`assets/memes/${currentMeme}`}></img>
    </div>
  ) : null;
};
