import React, { Fragment, useContext, useState, useEffect } from "react";
import withProvider from "../core/components/withProvider";
import SchemaTable, {
  PaginatedResult,
  SchemaTableConfig,
  schemaTableConfig,
} from "../core/components/tables/SchemaTable";
import { FormSchema } from "../core/components/forms/SchemaForm";
import { ObjectEntity } from "../core/components/forms/ObjectEntityType";
import {
  BlogPostSchemaContextProvider,
  BlogPostSchemaContext,
  PostsTableConfig,
  PostFilter,
} from "./BlogPostSchemaContext";
import { Post } from "../common/client";
import { LookupEntityFilter } from "../core/components/forms/lookups/LookupEntity.interface";
import { BlogPostApi } from "../common/client/BlogPostApi";

function Posts() {
  const schemaContext = useContext(BlogPostSchemaContext);

  const [filterSchema, setFilterSchema] = useState<
    FormSchema<LookupEntityFilter>
  >(() => schemaContext.get({ type: "FILTER" }));
  const [page, setPage] = React.useState<PaginatedResult>({
    items: [],
    count: 0,
  } as PaginatedResult);
  const [config, setConfig] = React.useState<PostsTableConfig>({
    ...schemaTableConfig,
    filter: schemaContext.get<PostFilter>({ type: "FILTER" }).object,
    sort: "date_desc",
    orderBy: "date",
    order: "asc",
  });

  useEffect(() => {
    BlogPostApi.getBlogPostPage(
      config.sort,
      config.pageNumber + 1,
      config.rowsPerPage,
      config.filter.title,
      config.filter.description,
      config.filter.postGroup.map((b) => b.id as number)
    ).then((result) => setPage(result as PaginatedResult));
  }, [config]);

  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setFilterSchema(schemaContext.get({ type: "FILTER" }));
  }, [schemaContext]);

  const handleGetEntitySchema = (obj?: ObjectEntity) =>
    obj !== undefined
      ? (schemaContext.get({
          type: "EDIT",
          obj: obj as Post,
        }) as FormSchema<ObjectEntity>)
      : (schemaContext.get({ type: "ADD" }) as FormSchema<ObjectEntity>);
  const handleDeleteEntity = (obj: ObjectEntity) =>
    BlogPostApi.deleteBlogPost(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) =>
    setConfig(pageConfig as PostsTableConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setConfig({ ...config, filter: obj as PostFilter });
    setFilterSchema({ ...filterSchema, object: obj as PostFilter });
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
        title="Content"
      />
    </Fragment>
  );
}

export default withProvider(Posts, BlogPostSchemaContextProvider);
