import React, { Fragment, useState, useEffect, useRef } from "react";
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
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { TransactionTotal } from "../common/client";
import { SpendingModalRef, SpendingModal } from "./SpendingModal";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";

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

interface FinanceSpendingCardProps {
  year: string;
}

function FinanceSpendingCard({ year }: FinanceSpendingCardProps) {
  const classes = useStyles();

  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [
    selectedTransactionCategory,
    setSelectedTransactionCategory,
  ] = useState<TransactionTotal | null>(null);

  const modalRef = useRef<SpendingModalRef>(null);

  useEffect(() => {
    const getSummary = (year: string) => {
      FinanceApi.getTransactionCategoryTotals(year)
        .then((response) => {
          const total = response.reduce(
            (accumulator, currentValue) =>
              accumulator + (currentValue?.amount || 0),
            0
          );
          setTotal(total);
          setItems(response);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(`Error getting summary: ${err.message}`);
          setIsLoading(false);
        });
    };
    getSummary(year);
  }, [year]);

  const handleModalOpen = (
    transactionCategoryTotal: TransactionTotal
  ): void => {
    setSelectedTransactionCategory(transactionCategoryTotal);
  };
  const handleModalClose = (): void => {
    setSelectedTransactionCategory(null);
  };

  return (
    <Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Annual Summary
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
                  <ButtonSplitTextListItem
                    key={item.name}
                    className={classes.lineItem}
                    variant="subtitle2"
                    left={item.name}
                    right={currencyFormatter.format(item.amount || 0)}
                    handleClick={() => handleModalOpen(item)}
                  />
                ))}
                <SplitTextListItem
                  className={classes.lineItemTotal}
                  variant="subtitle2"
                  left="Total"
                  right={currencyFormatter.format(total)}
                />
              </List>
            </Fragment>
          )}
        </CardContent>
      </Card>
      <SpendingModal
        ref={modalRef}
        category={selectedTransactionCategory}
        year={year}
        onClose={handleModalClose}
      />
    </Fragment>
  );
}

export default FinanceSpendingCard;
