import React from 'react';
import LoadingSpinner from '../../common/loadingSpinner';
import { useMainContianerStyles } from './styles/sharedStyles';

export interface CommittedViewProps {
  memeURL: string;
}

export const CommittedView = ({ memeURL }: CommittedViewProps): JSX.Element => {
  const classesShared = useMainContianerStyles();

  return (
    <div className={classesShared.mainContainer}>
      <h1>Enjoy a random Reddit Meme while you wait for the others...</h1>
      <LoadingSpinner />
      <img src={memeURL}></img>
    </div>
  );
};
