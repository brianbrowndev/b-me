import { TransactionClient, BankClient, TransactionCategoryClient, FinanceClient }from './index';

const TransactionApi = new TransactionClient();
const BankApi = new BankClient();
const TransactionCategoryApi = new TransactionCategoryClient();
const FinanceApi = new FinanceClient();

export {TransactionApi, BankApi, TransactionCategoryApi, FinanceApi};
