import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {  MenuItem, useTheme, TextField  } from '@material-ui/core';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';
import FormOptionType from '../core/components/forms/FormOptionType';
import FormSelect from '../core/components/forms/FormSelect';
import FormAppBar from '../core/components/forms/FormAppBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),

      "& > div": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    },
    menu: {
      width: 200,
    },
  }),
);


interface BookEditFormProps {
  book?: Book
  onCancel(): void;
  onSubmit(): void;
}

const readYears = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"].map(year => ({value: year, label:year} as FormOptionType));

export default function BookEditForm({ book, onCancel, onSubmit }: BookEditFormProps) {
  const classes = useStyles();
  const theme = useTheme();

  
  const [editBook, setBook] = useState<Book>({...(book || {readYear: `${new Date().getFullYear()}`} as Book)});
  const [authors, setAuthors] = useState<FormOptionType[]>([]);
  const [categories, setCategories] = useState<FormOptionType[]>([]);
  const [statuses, setStatuses] = useState<FormOptionType[]>([]);


  const handleChange = (propertyName: keyof Book) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setBook({ ...editBook, [propertyName]: event.target.value });
  };
  const handleSelectChange = (propertyName: keyof Book) => (obj: any) => {
    setBook({...editBook, [propertyName]:obj})
  };

  useEffect(
    (() => {
      const setOption = (label:string, value: string | number | undefined) => ({label:label, value:value} as FormOptionType);
      BookApi.getAuthors().then(result => setAuthors(result.map(r => setOption(r.name, r.id))) 
      ).catch(err => {
        // setError(`Error fetching books: ${err.message}`)
        // setIsLoading(false);
        // setBooks([]);
      });
      BookApi.getBookCategories().then(result => setCategories(result.map(r => setOption(r.name, r.id))) 
      ).catch(err => {
        // setError(`Error fetching books: ${err.message}`)
        // setIsLoading(false);
        // setBooks([]);
      });
       BookApi.getStatuses().then(result => setStatuses(result.map(r => setOption(r.name, r.id))) 
      ).catch(err => {
        // setError(`Error fetching books: ${err.message}`)
        // setIsLoading(false);
        // setBooks([]);
      });
 
    }), 
    [] 
  );


  const handleSubmit = (evt: React.FormEvent) => {
      // setError(false);
      // setDisabled(true);
      // evt.preventDefault();
      // authContext.login(username, pw, onLogin)
  }


  const propertyOf = (e: keyof Book) => e;

  return (
    <div className={classes.root}>
      <FormAppBar title="New Book" onCancel={onCancel} disabled={false} onSubmit={onSubmit} />
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id={propertyOf('name')}
          label="Name"
          value={editBook.name}
          onChange={handleChange(propertyOf('name'))}
        />
        <FormSelect
          label='Author'
          id={propertyOf('bookAuthor')}
          options={authors}
          obj={editBook.bookAuthor}
          valueProperty='id'
          labelProperty='name'
          onChange={handleSelectChange(propertyOf('bookAuthor'))}
        />
        <FormSelect
          label='Category'
          id={propertyOf('bookCategory')}
          options={categories}
          obj={editBook.bookCategory}
          valueProperty='id'
          labelProperty='name'
          onChange={handleSelectChange(propertyOf('bookCategory'))}
        />
        <FormSelect
          label='Status'
          id={propertyOf('bookStatus')}
          options={statuses}
          obj={editBook.bookStatus}
          valueProperty='id'
          labelProperty='name'
          onChange={handleSelectChange(propertyOf('bookStatus'))}
        />
        <TextField
          id={propertyOf('readYear')}
          select
          label="Year Book Read"
          value={editBook.readYear}
          onChange={handleChange(propertyOf('readYear'))}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {readYears.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </div>
  );
}