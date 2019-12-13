import React, { useState, Fragment } from 'react';
import { Collapse, createStyles, makeStyles, Theme, Typography, Grid } from '@material-ui/core';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import TextListItem from '../core/components/lists/TextListItem';


const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
  })
});

interface FinancialSummaryLineItemProps {
  title: string;
  amount: number;
  children: JSX.Element[] | JSX.Element;
}


function FinancialSummaryLineItem ({title, amount, children}:FinancialSummaryLineItemProps) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  return (
    <Fragment>
      <TextListItem onClick={handleClick}
        button
        content={
        <Typography variant="subtitle2" color="textPrimary">
          <Grid container direction="row" justify="space-between" spacing={0}>
            <Grid item>
              {title}
            </Grid>
            <Grid item>
              {currencyFormatter.format(amount)}
            </Grid>
          </Grid>
        </Typography>
        }
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Fragment>
  )

}

export default FinancialSummaryLineItem;