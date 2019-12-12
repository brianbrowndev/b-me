import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles, Card, CardContent, Typography, Divider, List } from '@material-ui/core';
import { FinancialSummary } from '../common/client';
import { FinanceApi } from '../common/client/FinanceApi';
import AppSpinner from '../core/components/AppSpinner';
import FinancialSummaryLineItem from './SummaryLineItem';
import currencyFormatter from '../core/components/formatters/CurrencyFormatter';
import SplitTextListItem from '../core/components/lists/SplitTextListItem';


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
    }
  })
});

interface FinanceSummaryCardProps {
  year: string;
}


function FinanceSummaryCard ({year}:FinanceSummaryCardProps) {
  const classes = useStyles();

  const [summary, setSummary] = useState<FinancialSummary| null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(
      (() => {

        const getSummary = (year:string) => {
            FinanceApi.getSummary(year).then(summary => {
              setSummary(summary);
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
          Net Worth
        </Typography>
        { error && 
          <Typography color="error" variant="overline">{error}</Typography>
        }
        { isLoading ?  (<AppSpinner /> ) 
        : (
          <Fragment>
            <div className={classes.section}>
              <Typography variant="h4" component="h5" gutterBottom>
                {summary?.netWorth && currencyFormatter.format(summary.netWorth)}
              </Typography>

            </div>
            <Divider/>
            <List>
              {summary &&
                <FinancialSummaryLineItem title="Assets" amount={summary.assetTotal || 0}>
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Savings"} right={currencyFormatter.format(summary?.asset?.saving || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Retirement"} right={currencyFormatter.format(summary?.asset?.retirement || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"HSA"} right={currencyFormatter.format(summary?.asset?.hsa || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Home"} right={currencyFormatter.format(summary?.asset?.home || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Auto"} right={currencyFormatter.format(summary?.asset?.auto || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Stock"} right={currencyFormatter.format(summary?.asset?.stock || 0)} />
                </FinancialSummaryLineItem>
              }
              {summary &&
                <FinancialSummaryLineItem title="Debts" amount={summary.debtTotal || 0}>
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Home"} right={currencyFormatter.format(summary?.debt?.home || 0)} />
                  <SplitTextListItem className={classes.lineItem} variant="subtitle2" left={"Auto"} right={currencyFormatter.format(summary?.debt?.auto || 0)} />
                </FinancialSummaryLineItem>
              }
            </List>
          </Fragment>
        ) }
      </CardContent>
    </Card>
  );
}

export default FinanceSummaryCard;