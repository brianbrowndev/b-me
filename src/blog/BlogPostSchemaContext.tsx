import React, { useEffect, useState } from 'react';
import { FormSchema, SelectFieldSchema, TextFieldSchema, MultiSelectFieldSchema, DateFieldSchema, SwitchFieldSchema } from '../core/components/forms/SchemaForm';
import FormOptionType from '../core/components/forms/FormOptionType';
import { Post, PostGroup } from '../common/client';
import { BlogPostApi } from '../common/client/BlogPostApi';
import EditSchemaContextProps from '../core/components/forms/EditSchemaContextProps.interface';
import { Omit } from '@material-ui/types';
import getLookupName from '../core/components/forms/lookups/getLookupName';
import { SchemaTableConfig } from '../core/components/tables/SchemaTable';

export interface PostFilter extends Omit<Post, 'postGroup'> {
  postGroup: PostGroup[];
}

export interface PostsTableConfig extends Omit<SchemaTableConfig, 'filter'> {
  filter: PostFilter;
};


const BlogPostSchemaContext = React.createContext({} as EditSchemaContextProps<Post | PostFilter>);

const propertyOf = (e: keyof Post) => e;

function BlogPostSchemaContextProvider({ children }: { children: JSX.Element }) {

  const [groups, setGroups] = useState<FormOptionType[]>([]);

  useEffect(
    (() => {
      const setOption = (obj: any, label: string, value: string | number | undefined) => ({ ...obj, label: label, value: value } as FormOptionType);
      Promise.all([BlogPostApi.getBlogPostGroups()]).then(
        ([groups]) => {
          setGroups(groups.map(r => setOption(r, r.name as string, r.id)));
        }
      ).catch(err => {
        // TODO - error handling for user
        console.log(err);
      })
    }), []
  );

  const schema = {
    title: '',
    properties: {
      [propertyOf('postGroup')]: {
        title: "Group",
        type: "select",
        options: groups,
        required: true,
        getVal: getLookupName
      } as SelectFieldSchema,
      [propertyOf('title')]: {
        title: "Title",
        type: "text",
        required: true
      } as TextFieldSchema,
      [propertyOf('description')]: {
        title: "Description",
        type: "text",
        required: false,
      } as TextFieldSchema,
      [propertyOf('path')]: {
        title: "Path",
        type: "text",
        helperText: "e.g. /private/life/homes",
        required: true,
      } as TextFieldSchema,
      [propertyOf('date')]: {
        title: "Date",
        type: "date",
        required: true
      } as DateFieldSchema,
      [propertyOf('authenticate')]: {
        title: "Authenticated",
        type: "switch",
      } as SwitchFieldSchema,
      [propertyOf('star')]: {
        title: "Starred",
        type: "switch",
      } as SwitchFieldSchema,
    },
    object: {} as Post
  } as FormSchema<Post>;

  const filterSchema = {
    title: 'Filter Content',
    properties: {
      [propertyOf('title')]: {
        title: "Title",
        type: "text",
      } as TextFieldSchema,
      [propertyOf('description')]: {
        title: "Description",
        type: "text",
      } as TextFieldSchema,
      [propertyOf('postGroup')]: {
        title: "Group",
        type: "multiselect",
        options: groups,
        required: false,
        getVal: getLookupName,
      } as MultiSelectFieldSchema,
    },
    object: { title: '', description: '', postGroup: [] } as PostFilter,
    type: 'FILTER',
    save: (post: Post) => Promise.resolve(null) // Bypass saving, and apply the filter higher up in a get request
  } as FormSchema<PostFilter>;

  const add = (post: Post) => BlogPostApi.createBlogPost(post);
  const save = (post: Post) => BlogPostApi.updateBlogPost(post.id as number, post);

  const postEditProps = {
    get: action => {
      switch (action.type) {
        case 'ADD':
          return {
            ...schema,
            object: {},
            type: 'ADD',
            title: 'New Post',
            save: add
          } as FormSchema<Post>
        case 'EDIT':
          return {
            ...schema,
            object: action.obj as any,
            type: 'EDIT',
            title: 'Edit Post',
            save: save
          } as FormSchema<Post>
        case 'FILTER':
          return {
            ...filterSchema,
            title: 'Filter Posts',
          } as FormSchema<PostFilter>
      }
    },
  } as EditSchemaContextProps<Post | PostFilter>;

  return (
    <BlogPostSchemaContext.Provider value={{ ...postEditProps }}>
      {children}
    </BlogPostSchemaContext.Provider>
  )
}

export { BlogPostSchemaContext, BlogPostSchemaContextProvider };
