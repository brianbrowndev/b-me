import React, { Fragment, useContext, useState, useEffect } from 'react';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import {BookAuthorApi} from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';
import { BookAuthorSchemaContextProvider, BookAuthorSchemaContext } from './BookAuthorSchemaContext';
import { BookAuthor } from '../common/client';
import { LookupEntityFilter } from '../core/components/forms/lookups/LookupEntity.interface';

function BookAuthors() {
  const schemaContext = useContext(BookAuthorSchemaContext);


  const [filterSchema, setFilterSchema] = useState<FormSchema<LookupEntityFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>({...schemaTableConfig, sort:'name_asc', orderBy:'name', order:'asc'});

  useEffect(
    (() => {
      BookAuthorApi.getAuthorsPage(
        config.sort, 
        config.pageNumber + 1, 
        config.rowsPerPage,
        config.filter.name
      ).then(result => setPage(result as PaginatedResult))
    }), 
    [config] 
  );

  const handleGetEntitySchema = (obj?: ObjectEntity) => obj !== undefined ? schemaContext.get({type:'EDIT', obj:obj as BookAuthor}) as FormSchema<ObjectEntity> : schemaContext.get({type:'ADD'}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => BookAuthorApi.deleteAuthor(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({...config, filter:obj as LookupEntityFilter});
    setFilterSchema({...filterSchema, object:obj as LookupEntityFilter});
  };

  return (
    <Fragment>
      <SchemaTable 
        filterSchema={filterSchema as FormSchema<ObjectEntity>}
        onFilter={handleOnFilter}
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Book Authors"
      />
    </Fragment>
  );
}

export default withProvider(BookAuthors, BookAuthorSchemaContextProvider);
