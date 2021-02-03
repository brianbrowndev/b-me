import React, { Fragment, useState, useEffect } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Typography,
  List,
} from "@material-ui/core";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import { TransactionTotal } from "../common/client";
import MonthlySpendingLineItem from "./MonthlySpendingLineItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      width: "300px",
    },
    title: {
      fontSize: 14,
    },
    section: {
      margin: theme.spacing(2, 0),
    },
    lineItem: {
      fontWeight: 400,
    },
    lineItemTotal: {
      paddingTop: theme.spacing(2),
      // paddingTop: '20pxk',
      borderTop: `1px solid ${
        theme.palette.type === "light"
          ? "rgba(0,0,0,0.12)"
          : "rgba(255,255,255,0.12)"
      }`,
      fontWeight: 700,
    },
    list: {
      overflowY: "auto",
    },
  });
});

interface FinanceMonthlySpendingSummaryCardProps {
  year: string;
}

function FinanceMonthlySpendingSummaryCard({
  year,
}: FinanceMonthlySpendingSummaryCardProps) {
  const classes = useStyles();

  const [average, setAverage] = useState<number>(0);
  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getSummary = (year: string) => {
      FinanceApi.getTransactionMonthlyTotals(year)
        .then((response) => {
          const total = response.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue?.amount || 0),
            0
          );
          setItems(response);
          setAverage(total / response.length);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(`Error getting summary: ${err.message}`);
          setIsLoading(false);
        });
    };
    getSummary(year);
  }, [year]);

  return (
    <Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Monthly Summary
          </Typography>
          {error && (
            <Typography color="error" variant="overline">
              {error}
            </Typography>
          )}
          {isLoading ? (
            <AppSpinner />
          ) : (
            <Fragment>
              <List className={classes.list}>
                {items?.map((item) => (
                  <MonthlySpendingLineItem
                    key={item.name}
                    total={item}
                    year={year}
                  />
                ))}
                <SplitTextListItem
                  className={classes.lineItemTotal}
                  variant="subtitle2"
                  left="Average"
                  right={currencyFormatter.format(average)}
                />
              </List>
            </Fragment>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
}

export default FinanceMonthlySpendingSummaryCard;
