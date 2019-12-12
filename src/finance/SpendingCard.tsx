import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles, Card, CardContent, Typography, List } from '@material-ui/core';
import { FinanceApi } from '../common/client/FinanceApi';
import AppSpinner from '../core/components/AppSpinner';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import SplitTextListItem from '../core/components/lists/SplitTextListItem';
import { TransactionCategoryTotal } from '../common/client';


const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    },
    title: {
      fontSize: 14,
    },
    section: {
      margin: theme.spacing(2,0)
    },
    lineItem: {
      fontWeight: 400
    },
    list: {
      overflowY: 'auto',
      maxHeight: '300px'
  
    }
  })
});

interface FinanceSpendingCardProps {
  year: string;
}


function FinanceSpendingCard ({year}:FinanceSpendingCardProps) {
  const classes = useStyles();

  const [items, setItems] = useState<TransactionCategoryTotal[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(
      (() => {

        const getSummary = (year:string) => {
            FinanceApi.getTransactionCategoryTotals(year).then(response => {
              setItems(response);
              setIsLoading(false);
          }).catch(err => {
              setError(`Error getting summary: ${err.message}`)
              setIsLoading(false);
          });
        }
        getSummary(year);
      }), 
      [year] 
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Spending
        </Typography>
        { error && 
          <Typography color="error" variant="overline">{error}</Typography>
        }
        { isLoading ?  (<AppSpinner /> ) 
        : (
          <Fragment>
           <List className={classes.list}>
             {items?.map(item => 
              <SplitTextListItem key={item.name} className={classes.lineItem} variant="subtitle2" left={item.name} right={currencyFormatter.format(item.amount || 0)} />
             )}
            </List>
          </Fragment>
        ) }
      </CardContent>
    </Card>
  );
}

export default FinanceSpendingCard;