import React from 'react';

export interface MemeViewProps {
  isCzar: boolean;
}

const MemeView = ({ isCzar }: MemeViewProps): JSX.Element => {
  return (
    !isCzar && (
      <div className="imgView">
        <img src="\img\y-tho-meme.jpg"></img>
      </div>
    )
  );
};

export default MemeView;
