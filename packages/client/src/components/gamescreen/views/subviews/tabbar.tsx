import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { STATES } from '../../../../interfaces/api';

interface TabBarProps {
  serverState: number;
  handleChange: (value: number) => void;
}

export const TabBar = ({ serverState, handleChange }: TabBarProps): JSX.Element => {
  const [value, setValue] = useState(0);

  const localHandleChange = (
    _event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setValue(newValue);
    handleChange(newValue);
  };

  return (
    serverState !== STATES.WAITING && (
      <AppBar position="static">
        <Tabs value={value} onChange={localHandleChange}>
          <Tab label="Home" {...tabProps(0)} />
          <Tab label="Score" {...tabProps(1)} />
          <Tab label="Actions" {...tabProps(2)} />
        </Tabs>
      </AppBar>
    )
  );
};

function tabProps(index: number) {
  return {
    id: `tab-${index}`,
  };
}
