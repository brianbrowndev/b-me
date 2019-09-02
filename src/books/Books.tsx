import React, { Fragment, useState, useContext, useEffect } from 'react';
import BookTable from './BookTable';
import { BookEditContext } from './BookEditContext';
import { FormSchema } from '../core/components/forms/SchemaForm';
import AddModal from '../core/components/forms/AddModal';
import { Book } from '../common/client';

function Books() {


  const bookContext = useContext(BookEditContext);

  const [schema, setSchema] = useState({} as FormSchema);
  const [addedBook, setAddedBook] = useState({} as Book);

  useEffect(() => {
    setSchema(bookContext.get());
  }, [bookContext])


  const handleSave = (book: Book) => {
    setAddedBook(book);
  }

  return (
    <Fragment>
      <BookTable addedBook={addedBook} />
      <AddModal schema={schema} onSaveSuccess={handleSave} />
    </Fragment>
  );
}

export default Books;
