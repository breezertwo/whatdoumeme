import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export interface CustomButtonProps {
  type?: number;
  onClick?: () => void;
  children: JSX.Element | JSX.Element[] | string | string[];
}

const useStyles = makeStyles<Theme, CustomButtonProps>(() =>
  createStyles({
    root: {
      flexGrow: 1,
      background: '#31a24c',
      fontWeight: 600,
      textAlign: 'center',
      color: 'white',
      textDecoration: 'none',
      borderRadius: 'none',
      padding: '20px 12px',
      margin: '10px 0',
      '&:hover': {
        background: '#1f7d36',
      },
    },
  })
);

export const CustomButton = (props: CustomButtonProps): JSX.Element => {
  const classes = useStyles(props);

  return (
    <Button
      onClick={props.onClick}
      classes={{
        root: classes.root, // class name, e.g. `classes-nesting-root-x`
        label: classes.label, // class name, e.g. `classes-nesting-label-x`
      }}>
      {props.children}
    </Button>
  );
};
