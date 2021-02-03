import React, { useState, Fragment } from "react";
import { Collapse, makeStyles, Theme, createStyles } from "@material-ui/core";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import { TransactionTotal } from "../common/client";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { FinanceApi } from "../common/client/FinanceApi";
import FormMonthOptions from "../core/components/forms/FormMonthOptions.tsx";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    lineItem: {
      fontWeight: 400,
    },
  });
});

interface MonthlySpendingLineItemProps {
  total: TransactionTotal | null;
  year: string;
}

function MonthlySpendingLineItem({
  total,
  year,
}: MonthlySpendingLineItemProps) {
  const classes = useStyles();

  const formatMonth = (month?: string) =>
    FormMonthOptions.find((m) => m.value === total?.name)?.label;

  const [items, setItems] = useState<TransactionTotal[] | null>(null);
  const [open, setOpen] = React.useState(false);

  const getSummary = () => {
    FinanceApi.getTransactionCategoryMonthlyTotals(
      year,
      total?.name
    ).then((result) => setItems(result));
  };

  const handleClick = () => {
    if (!items) {
      getSummary();
    }
    setOpen(!open);
  };

  return (
    <Fragment>
      <ButtonSplitTextListItem
        variant="subtitle2"
        left={formatMonth(total?.name)}
        right={currencyFormatter.format(total?.amount || 0)}
        handleClick={handleClick}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items?.map((item) => (
          <SplitTextListItem
            key={item.name}
            className={classes.lineItem}
            variant="subtitle2"
            left={`${item.name}`}
            right={currencyFormatter.format(item.amount || 0)}
          />
        ))}
      </Collapse>
    </Fragment>
  );
}

export default MonthlySpendingLineItem;
