import React, { useEffect, useState } from "react";
import {
  FormSchema,
  SelectFieldSchema,
  TextFieldSchema,
  MultiSelectFieldSchema,
  DateFieldSchema,
  CurrencyFieldSchema,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import {
  TransactionRecord,
  Bank,
  TransactionCategory,
  User,
  TransactionRecordTag,
  TransactionTag,
} from "../common/client";
import { LookupEntity } from "../core/components/forms/lookups/LookupEntity.interface";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import getLookupName from "../core/components/forms/lookups/getLookupName";
import {
  TransactionApi,
  BankApi,
  TransactionCategoryApi,
  TransactionTagApi,
} from "../common/client/FinanceApi";
import { UserApi } from "../common/client/AdminApi";
import FormYearOptions from "../core/components/forms/FormYearOptions";
import currencyFormatter from "../core/components/formatters/CurrencyFormatter";
import FormMonthOptions from "../core/components/forms/FormMonthOptions.tsx";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";

export const transactionUtility = {
  propertyOfTransactionRecord: (e: keyof TransactionRecord) => e,
  propertyOf: (e: keyof TransactionTableRecord) => e,

  mapToTransactionRecord: (
    record: TransactionTableRecord
  ): TransactionRecord => {
    const item = { ...record };
    const transactionRecordTags: TransactionRecord[] = [];
    record?.tags?.forEach((tag) => {
      const id = tag?.transactionRecordTags[0]?.id || 0;
      transactionRecordTags.push({
        id: id,
        transactionRecordId: record.id,
        tagId: tag.id,
        tag: tag,
      } as TransactionRecordTag);
    });
    delete item[transactionUtility.propertyOf("tags")];
    return {
      ...item,
      transactionRecordTags: transactionRecordTags,
    } as TransactionRecord;
  },

  mapToTransactionTableRecord: (
    record: TransactionRecord
  ): TransactionTableRecord => {
    const item = { ...record };
    const tags = record?.transactionRecordTags?.map(
      (t) =>
        ({
          ...t.tag,
          label: t.tag?.name,
          value: t.tag?.id,
          transactionRecordTag: [t],
        } as FormOptionType)
    );
    delete item[
      transactionUtility.propertyOfTransactionRecord("transactionRecordTags")
    ];
    return { ...item, tags: tags } as TransactionTableRecord;
  },
};

export interface TransactionTableRecord
  extends Omit<TransactionRecord, "transactionRecordTags"> {
  tags: FormOptionType[];
}

export interface TransactionTableConfig
  extends Omit<SchemaTableConfig, "filter"> {
  filter: TransactionFilter;
}

export interface TransactionFilter
  extends Omit<
    TransactionRecord,
    "bank" | "category" | "user" | "date" | "description"
  > {
  description: string;
  banks: Bank[];
  categories: TransactionCategory[];
  tags: TransactionTag[];
  users: User[];
  years: LookupEntity[];
  months: LookupEntity[];
}

const TransactionSchemaContext = React.createContext(
  {} as EditSchemaContextProps<TransactionTableRecord | TransactionFilter>
);
function TransactionSchemaContextProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [users, setUsers] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [banks, setBanks] = useState<FormOptionType[]>([]);
  const [tags, setTransactionTags] = useState<FormOptionType[]>([]);

  useEffect(() => {
    const setOption = (
      obj: any,
      label: string,
      value: string | number | undefined
    ) => ({ ...obj, label: label, value: value } as FormOptionType);
    Promise.all([
      BankApi.getBanks(),
      TransactionCategoryApi.getTransactionCategories(),
      UserApi.getUsers(),
      TransactionTagApi.getTransactionTags(),
    ])
      .then(([banks, categories, users, tags]) => {
        setBanks(banks.map((r) => setOption(r, r.name as string, r.id)));
        setCategories(
          categories.map((r) => setOption(r, r.name as string, r.id))
        );
        setUsers(users.map((r) => setOption(r, r.name as string, r.id)));
        setTransactionTags(
          tags.map((r) => setOption(r, r.name as string, r.id))
        );
      })
      .catch((err) => {
        // TODO - error handling for user
        console.log(err);
      });
  }, []);

  const schema = {
    title: "",
    properties: {
      [transactionUtility.propertyOf("date")]: {
        title: "Date",
        type: "date",
        required: true,
      } as DateFieldSchema,
      [transactionUtility.propertyOf("amount")]: {
        title: "Amount",
        type: "currency",
        required: true,
        getVal: (value) => currencyFormatter.format(value),
      } as CurrencyFieldSchema,
      [transactionUtility.propertyOf("description")]: {
        title: "Decription",
        type: "text",
        required: true,
      } as TextFieldSchema,
      [transactionUtility.propertyOf("category")]: {
        title: "Category",
        type: "select",
        options: categories,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [transactionUtility.propertyOf("bank")]: {
        title: "Bank",
        type: "select",
        options: banks,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [transactionUtility.propertyOf("user")]: {
        title: "User",
        type: "select",
        options: users,
        required: true,
        getVal: getLookupName,
      } as SelectFieldSchema,
      [transactionUtility.propertyOf("tags")]: {
        title: "Tag(s)",
        type: "multiselect",
        options: tags,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: {} as TransactionTableRecord,
  } as FormSchema<TransactionTableRecord>;

  const filterSchema = {
    title: "Filter Transactions",
    properties: {
      [transactionUtility.propertyOf("description")]: {
        title: "Name",
        type: "text",
      } as TextFieldSchema,
      banks: {
        title: "Banks",
        type: "multiselect",
        options: banks,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      categories: {
        title: "Categories",
        type: "multiselect",
        options: categories,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      tags: {
        title: "Tags",
        type: "multiselect",
        options: tags,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      user: {
        title: "Users",
        type: "multiselect",
        options: users,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
      years: {
        title: "Years",
        type: "multiselect",
        required: false,
        options: FormYearOptions,
      } as MultiSelectFieldSchema,
      months: {
        title: "Months",
        type: "multiselect",
        required: false,
        options: FormMonthOptions,
      } as MultiSelectFieldSchema,
    },
    object: {
      description: "",
      banks: [],
      categories: [],
      tags: [],
      users: [],
      years: [],
      months: [],
    } as TransactionFilter,
    type: "FILTER",
    save: (_: TransactionTableRecord) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<TransactionFilter>;

  const add = (obj: TransactionTableRecord) =>
    TransactionApi.createTransaction(
      transactionUtility.mapToTransactionRecord(obj)
    );
  const save = (obj: TransactionTableRecord) =>
    TransactionApi.updateTransaction(
      obj.id as number,
      transactionUtility.mapToTransactionRecord(obj)
    );

  const schemaEditProps = {
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Transaction",
            save: add,
          } as FormSchema<TransactionTableRecord>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Transaction",
            save: save,
          } as FormSchema<TransactionTableRecord>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Transactions",
          } as FormSchema<TransactionFilter>;
      }
    },
  } as EditSchemaContextProps<TransactionTableRecord | TransactionFilter>;

  return (
    <TransactionSchemaContext.Provider value={{ ...schemaEditProps }}>
      {children}
    </TransactionSchemaContext.Provider>
  );
}

export { TransactionSchemaContext, TransactionSchemaContextProvider };
