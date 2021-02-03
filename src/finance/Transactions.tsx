import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  TransactionSchemaContext,
  TransactionFilter,
  TransactionSchemaContextProvider,
  TransactionTableConfig,
  transactionUtility,
} from "./TransactionSchemaContext";
import { TransactionRecord } from "../common/client";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { TransactionApi, FinanceApi } from "../common/client/FinanceApi";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    total: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  });
});

export type PaginatedFinanceResult = PaginatedResult & { amountTotal: number };

function Transactions() {
  const classes = useStyles();

  const schemaContext = useContext(TransactionSchemaContext);

  const [filterSchema, setFilterSchema] = useState<
    FormSchema<TransactionFilter>
  >(() => schemaContext.get({ type: "FILTER" }));
  const [page, setPage] = React.useState<PaginatedFinanceResult>({
    items: [],
    count: 0,
    amountTotal: 0,
  } as PaginatedFinanceResult);
  const [config, setConfig] = React.useState<TransactionTableConfig>({
    ...schemaTableConfig,
    sort: "date_desc",
    orderBy: "date",
    filter: schemaContext.get<TransactionFilter>({ type: "FILTER" }).object,
  });

  useEffect(() => {
    TransactionApi.getTransactions(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      true,
      config.filter.description,
      config.filter.banks.map((b) => b.id as number),
      config.filter.users.map((b) => b.id as number),
      config.filter.categories.map((b) => b.id as number),
      config.filter.tags.map((b) => b.id as number),
      config.filter.years.map((b) => b.id as string),
      config.filter.months.map((b) => b.id as string)
    ).then((result) =>
      setPage({
        ...result,
        items: result?.items?.map((i) =>
          transactionUtility.mapToTransactionTableRecord(i)
        ),
      } as PaginatedFinanceResult)
    );
  }, [config]);

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({ type: "FILTER" }));
  }, [schemaContext]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as TransactionRecord,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);

  const handleDeleteEntity = (obj: ObjectEntity) =>
    TransactionApi.deleteTransaction(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as TransactionTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, pageNumber: 0, filter: obj as TransactionFilter });
    setFilterSchema({ ...filterSchema, object: obj as TransactionFilter });
  };

  const addSuggestedTagsToSchema = (
    schema: FormSchema<ObjectEntity>,
    categoryId: number,
    obj: { [key: string]: any }
  ): Promise<FormSchema<ObjectEntity>> => {
    return FinanceApi.getFrequentCategoryTags(categoryId).then(
      (tagCounts) =>
        new Promise((resolve) => {
          const tagNames = tagCounts
            .sort((a, b) => ((a?.count || 0) > (b?.count || 0) ? 1 : -1))
            .map((o) => o.name);
          let newSchema = {
            ...schema,
            object: obj,
            properties: {
              ...schema.properties,
              [transactionUtility.propertyOf("tags")]: {
                ...schema.properties[transactionUtility.propertyOf("tags")],
                helperText: `Suggested tags: ${tagNames.join(", ")}`,
              },
            },
          } as FormSchema<ObjectEntity>;
          resolve(newSchema);
        })
    );
  };

  const handleOnChange = (
    schema: FormSchema<ObjectEntity>,
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): Promise<FormSchema<ObjectEntity> | undefined> => {
    if (changeObj[transactionUtility.propertyOf("category")]) {
      return addSuggestedTagsToSchema(
        schema,
        changeObj[transactionUtility.propertyOf("category")].id,
        obj
      ).then(
        (newSchema) =>
          new Promise((resolve) => {
            resolve(newSchema);
          })
      );
    }
    // todo any
    return new Promise((resolve) => resolve(undefined));
  };

  return (
    <Fragment>
      <div className={classes.total}>
        <strong>Total:</strong>&nbsp;
        {currencyFormatter.format(page.amountTotal)}
      </div>
      <SchemaTable
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        getEntitySchema={handleGetEntitySchema}
        deleteEntity={handleDeleteEntity}
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        onChange={handleOnChange}
        config={config}
        title="Transactions"
      />
    </Fragment>
  );
}

export default withProvider(Transactions, TransactionSchemaContextProvider);
