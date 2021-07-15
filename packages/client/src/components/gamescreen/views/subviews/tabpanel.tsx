import React from 'react';
import { useBasicFlex } from '../styles/sharedStyles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  active: number;
}

export const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, active, index, ...other } = props;
  const classes = useBasicFlex();

  return (
    <div
      className={classes.basicFlex}
      role="tabpanel"
      hidden={active !== index}
      id={`tabpanel-${index}`}
      {...other}>
      {active === index && <>{children}</>}
    </div>
  );
};
