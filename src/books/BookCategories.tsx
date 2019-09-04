import React, { Fragment, useContext, useState, useEffect } from 'react';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookCategorySchemaContextProvider, BookCategorySchemaContext } from './BookCategorySchemaContext';
import { BookCategory } from '../common/client';

function BookCategories() {
  const schemaContext = useContext(BookCategorySchemaContext);


  const [schema, setSchema] = useState<FormSchema>(() => schemaContext.get({type:'ADD'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);

  useEffect(
    (() => {
      BookApi.getCategoriesPage(config.sort, config.pageNumber + 1, config.rowsPerPage).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as BookCategory});
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteCategory(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);

  return (
    <Fragment>
      <SchemaTable 
        schema={schema} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Book Categories"
      />
    </Fragment>
  );
}

export default withProvider(BookCategories, BookCategorySchemaContextProvider);
