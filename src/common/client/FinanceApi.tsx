import { TransactionClient, BankClient, TransactionCategoryClient, FinanceClient, TransactionTagClient }from './index';

const TransactionApi = new TransactionClient();
const BankApi = new BankClient();
const TransactionCategoryApi = new TransactionCategoryClient();
const TransactionTagApi = new TransactionTagClient();
const FinanceApi = new FinanceClient();

export {TransactionApi, BankApi, TransactionCategoryApi, TransactionTagApi, FinanceApi};
