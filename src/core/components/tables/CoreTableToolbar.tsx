import React from "react";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme, Toolbar, Typography } from "@material-ui/core";
import { FormSchema } from "../forms/SchemaForm";
import CoreTableFilter from "./CoreTableFilter";
import { ObjectEntity } from "../forms/ObjectEntityType";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    spacer: {
      flex: "1 1 100%",
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: "0 0 auto",
    },
  })
);

interface CoreTableToolbarProps<T> {
  title: string;
  filterSchema?: FormSchema<T>;
  onFilter?: (obj: T) => void;
}

export default function CoreTableToolbar<T extends ObjectEntity>({
  title,
  filterSchema,
  onFilter,
}: CoreTableToolbarProps<T>) {
  const classes = useToolbarStyles();
  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {filterSchema && onFilter && (
          <CoreTableFilter schema={filterSchema} onFilter={onFilter} />
        )}
      </div>
    </Toolbar>
  );
}
