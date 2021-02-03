import React from 'react';
import { Typography, Grid, TypographyProps } from '@material-ui/core';
import TextListItem from './TextListItem';

export default function SplitTextListItem ({left, right, ...typographyProps}:{left:any, right: any} & TypographyProps) {
  return (
    <TextListItem
      content={
        <Typography {...typographyProps}>
          <Grid container direction="row" justify="space-between" spacing={0}>
            <Grid item>
              {left}
            </Grid>
            <Grid item>
              {right}
            </Grid>
          </Grid>
        </Typography>
      }
    />
  )
}
