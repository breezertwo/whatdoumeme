import React from 'react';
import { ShareDialog } from './shareDialog';

export const PageHeader = (): JSX.Element => {
  return (
    <div className="page-header">
      <h1>what do u meme</h1>
      <ShareDialog />
    </div>
  );
};
