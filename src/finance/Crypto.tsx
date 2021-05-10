import React, { Fragment, useContext, useState, useEffect } from "react";
import { Book } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import {
  CryptoFilter,
  CryptoSchemaContext,
  CryptoSchemaContextProvider,
  CryptoTableConfig,
} from "./CryptoSchemaContext";
import { CryptoApi } from "../common/client/CryptoApi";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    total: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
  });
});

function CryptoInvestment() {
  const schemaContext = useContext(CryptoSchemaContext);

  const classes = useStyles();

  const [filterSchema, setFilterSchema] = useState<FormSchema<CryptoFilter>>(
    () => schemaContext.get({ type: "FILTER" })
  );
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<CryptoTableConfig>({
    ...schemaTableConfig,
    sort: "purchaseDate_desc",
    orderBy: "purchaseDate",
    filter: schemaContext.get<CryptoFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    CryptoApi.getCryptoPage(
      config.pageNumber,
      config.rowsPerPage,
      config.sort,
      config.filter.coins.map((b) => b.name),
      config.filter.yearSold.map((b) => +b.name),
      config.filter.status?.name
    ).then((result) => setPage({ ...result } as PaginatedResult));
  }, [config]);

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({ type: "FILTER" }));
  }, [schemaContext]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as Book,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as CryptoTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, filter: obj as CryptoFilter });
    setFilterSchema({ ...filterSchema, object: obj as CryptoFilter });
  };

  return (
    <Fragment>
      <div className={classes.total}>
        <span>
          <strong>Total Value:</strong>&nbsp;
          {/* {currencyFormatter.format(expenseSummary.plannedAmount || 0)} */}
        </span>
        <span>
          <strong>Net Gain:</strong>&nbsp;
          {/* {currencyFormatter.format(expenseSummary.totalActualAmount || 0)} */}
        </span>
        <span>
          <strong>Latest Prices:</strong>&nbsp;
          {/* {currencyFormatter.format(expenseSummary.totalActualAmount || 0)} */}
        </span>
      </div>
      <SchemaTable
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        getEntitySchema={handleGetEntitySchema}
        deleteEntity={schemaContext.delete}
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Crypto Investments"
      />
    </Fragment>
  );
}

export default withProvider(CryptoInvestment, CryptoSchemaContextProvider);
