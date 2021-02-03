import {
  BookClient,
  BookAuthorClient,
  BookCategoryClient,
  BookStatusClient,
} from "./index";

const BookApi = new BookClient();
const BookAuthorApi = new BookAuthorClient();
const BookCategoryApi = new BookCategoryClient();
const BookStatusApi = new BookStatusClient();

export { BookApi, BookAuthorApi, BookCategoryApi, BookStatusApi };
