import React, { useState, Fragment } from "react";
import { Collapse, makeStyles, Theme, createStyles } from "@material-ui/core";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import { TransactionTotal, TransactionRecord } from "../common/client";
import ButtonSplitTextListItem from "../core/components/lists/ButtonSplitTextListItem";
import SplitTextListItem from "../core/components/lists/SplitTextListItem";
import { TransactionApi } from "../common/client/FinanceApi";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    lineItem: {
      fontWeight: 400,
      borderBottom: `1px solid ${
        theme.palette.type === "light"
          ? "rgba(0,0,0,0.12)"
          : "rgba(255,255,255,0.12)"
      }`,
    },
  });
});

interface SpendingModalLineItemProps {
  category: TransactionTotal | null;
  tag: TransactionTotal | null;
  year: string;
}

function SpendingModalLineItem({
  category,
  tag,
  year,
}: SpendingModalLineItemProps) {
  const classes = useStyles();

  const getSummary = () => {
    TransactionApi.getTransactions(
      "date_desc",
      1,
      100,
      true,
      "",
      [],
      [],
      category?.id ? [category.id] : [],
      tag?.id ? [tag.id] : [],
      [year],
      []
    ).then((result) => setItems(result?.items ? result.items : null));
  };

  const handleClick = () => {
    if (!items) {
      getSummary();
    }
    setOpen(!open);
  };

  const [items, setItems] = useState<TransactionRecord[] | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <Fragment>
      <ButtonSplitTextListItem
        variant="subtitle2"
        left={tag?.name}
        right={currencyFormatter.format(tag?.amount || 0)}
        handleClick={handleClick}
      />
      <Collapse in={open} timeout="auto" unmountOnExit>
        {items?.map((item) => (
          <SplitTextListItem
            key={item.id}
            className={classes.lineItem}
            variant="subtitle2"
            left={`${item.date} - ${item.description}`}
            right={currencyFormatter.format(item.amount || 0)}
          />
        ))}
      </Collapse>
    </Fragment>
  );
}

export default SpendingModalLineItem;
