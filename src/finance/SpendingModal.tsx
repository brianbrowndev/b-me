import React, { forwardRef, useEffect, useState, Fragment } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TransactionTotal } from "../common/client";
import { AppBar, Toolbar, Typography, Button, List } from "@material-ui/core";
import { FinanceApi } from "../common/client/FinanceApi";
import AppSpinner from "../core/components/AppSpinner";
import TextListItem from "../core/components/lists/TextListItem";

import SpendingModalLineItem from "./SpendingModalLineItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      overflow: "auto",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
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
  })
);

export interface SpendingModalProps {
  category: TransactionTotal | null;
  year: string;
  // onSaveSuccess(obj:{[key:string]:any}):void;
  // saveText?: string;
  onClose(): void;
}

export interface SpendingModalRef {
  handleOpen(): void;
}

const SpendingModal = forwardRef(
  ({ category, year, onClose }: SpendingModalProps, ref: any) => {
    const classes = useStyles();
    const [modalStyle] = React.useState({});

    const [items, setItems] = useState<TransactionTotal[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
      if (category !== null) {
        setOpen(true);
        const getSummary = (year: string) => {
          FinanceApi.getTransactionCategoryTagTotals(year, category.name)
            .then((response) => {
              setItems(response);
              setIsLoading(false);
            })
            .catch((err) => {
              setError(`Error getting summary: ${err.message}`);
              setIsLoading(false);
            });
        };
        getSummary(year);
      } else {
        setOpen(false);
      }
    }, [category, year]);

    return (
      <Modal open={open} onClose={onClose}>
        <div style={modalStyle} className={classes.paper}>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                {category?.name}
              </Typography>
              <Button type="button" color="inherit" onClick={onClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
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
                  <SpendingModalLineItem
                    key={item.id}
                    category={category}
                    tag={item}
                    year={year}
                  />
                ))}
                {(!items || items?.length === 0) && (
                  <TextListItem
                    content={
                      <Typography variant="subtitle2" color="textPrimary">
                        No tags found.
                      </Typography>
                    }
                  />
                )}
              </List>
            </Fragment>
          )}
        </div>
      </Modal>
    );
  }
);

export { SpendingModal };
