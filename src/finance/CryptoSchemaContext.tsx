import React, { useEffect, useState } from "react";
import {
  FormSchema,
  FieldConstructor,
} from "../core/components/forms/SchemaForm";
import FormOptionType from "../core/components/forms/FormOptionType";
import { CryptoInvestmentDto } from "../common/client";
import EditSchemaContextProps from "../core/components/forms/EditSchemaContextProps.interface";
import { Omit } from "@material-ui/types";
import { SchemaTableConfig } from "../core/components/tables/SchemaTable";
import { CryptoApi } from "../common/client/CryptoApi";
import FormYearOptions from "../core/components/forms/FormYearOptions";
import { LookupEntity } from "../core/components/forms/lookups/LookupEntity.interface";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";

export const cryptoUtility = {
  propertyOf: (e: keyof CryptoInvestmentDto) => e,
  propertyOfFilter: (e: keyof CryptoFilter) => e,
};

export type CryptoTableConfig = Omit<SchemaTableConfig, "filter"> & {
  filter: CryptoFilter;
};

export type CryptoFilter = {
  id?: number;
  coins: LookupEntity[];
  status: LookupEntity | undefined;
  yearSold: LookupEntity[];
};
export type CryptoInvestmentTableRecord = Omit<CryptoInvestmentDto, "">;

const CryptoSchemaContext = React.createContext(
  {} as EditSchemaContextProps<CryptoInvestmentDto | CryptoFilter>
);

function CryptoSchemaContextProvider({ children }: { children: JSX.Element }) {
  const [coinsLookup, setCoins] = useState<FormOptionType[]>([]);
  const [statusLookup, setStatus] = useState<FormOptionType[]>([]);
  useEffect(() => {
    CryptoApi.getLookups()
      .then(({ coins, holdingStatus }) => {
        setCoins(
          coins?.map((r) =>
            FieldConstructor.option(r, r.name as string, r.id)
          ) || []
        );
        setStatus(
          holdingStatus?.map((r) =>
            FieldConstructor.option(r, r.name as string, r.id)
          ) || []
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
      [cryptoUtility.propertyOf("name")]: FieldConstructor.text({
        title: "Coin Name",
      }),
      [cryptoUtility.propertyOf("holdingStatus")]: FieldConstructor.text({
        title: "Status",
      }),
      [cryptoUtility.propertyOf("purchaseDate")]: FieldConstructor.date({
        title: "Purchase Date",
      }),
      [cryptoUtility.propertyOf("purchasePrice")]: FieldConstructor.currency({
        title: "Purchase Price",
      }),
      [cryptoUtility.propertyOf("quantity")]: FieldConstructor.number({
        title: "Quantity",
      }),
      [cryptoUtility.propertyOf("purchaseValue")]: FieldConstructor.currency({
        title: "Purchase Value",
      }),
      [cryptoUtility.propertyOf("marketValue")]: FieldConstructor.currency({
        title: "Market Value",
      }),
      [cryptoUtility.propertyOf("sellDate")]: FieldConstructor.date({
        title: "Sell Date",
      }),
      [cryptoUtility.propertyOf("sellValue")]: FieldConstructor.currency({
        title: "Sell Value",
      }),
      [cryptoUtility.propertyOf("sellPrice")]: FieldConstructor.currency({
        title: "Sell Price",
      }),
      [cryptoUtility.propertyOf("netGain")]: FieldConstructor.currency({
        title: "Net Gain",
      }),
    },
    object: {} as CryptoInvestmentTableRecord,
  } as FormSchema<CryptoInvestmentTableRecord>;

  const filterSchema = {
    title: "Filter Investments",
    properties: {
      [cryptoUtility.propertyOfFilter("coins")]: FieldConstructor.multiselect({
        title: "Coins",
        options: coinsLookup,
      }),
      [cryptoUtility.propertyOfFilter("status")]: FieldConstructor.select({
        title: "Status",
        options: statusLookup,
      }),
      [cryptoUtility.propertyOfFilter(
        "yearSold"
      )]: FieldConstructor.multiselect({
        title: "Sell Years",
        options: FormYearOptions,
      }),
    },
    object: {
      coins: [],
      status: undefined,
      yearSold: [],
    } as CryptoFilter,
    type: "FILTER",
    save: (_: CryptoInvestmentTableRecord) => Promise.resolve(null), // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<CryptoFilter>;

  const add = (obj: CryptoInvestmentTableRecord) => null;
  // CryptoApi.createCrypto(cryptoUtility.mapToCryptoRecord(obj));
  const save = (obj: CryptoInvestmentTableRecord) => null;
  // CryptoApi.updateCrypto(
  //   obj.id as number,
  //   // cryptoUtility.mapToCryptoRecord(obj)
  // );

  const schemaEditProps = {
    delete: (obj: ObjectEntity) => CryptoApi.delete(obj.id),
    get: (action) => {
      switch (action.type) {
        case "ADD":
          return {
            ...schema,
            object: {},
            type: "ADD",
            title: "New Crypto Investment",
            save: add as any,
          } as FormSchema<CryptoInvestmentTableRecord>;
        case "EDIT":
          return {
            ...schema,
            object: action.obj as any,
            type: "EDIT",
            title: "Edit Investment",
            save: save as any,
          } as FormSchema<CryptoInvestmentTableRecord>;
        case "FILTER":
          return {
            ...filterSchema,
            title: "Filter Cryptos",
          } as FormSchema<CryptoFilter>;
      }
    },
  } as EditSchemaContextProps<CryptoInvestmentTableRecord>;

  return (
    <CryptoSchemaContext.Provider value={{ ...schemaEditProps }}>
      {children}
    </CryptoSchemaContext.Provider>
  );
}

export { CryptoSchemaContext, CryptoSchemaContextProvider };
