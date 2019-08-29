import React, { useState, useEffect } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles, List, ListItemText, ListItem } from '@material-ui/core';
import AppLink from '../core/components/AppLink';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    },
    description: {
      min:'60px'
    }
  })
});

function RecentBooksCard() {
  const classes = useStyles();

  // view
  const [books, setBooks] = useState<Array<Book>>([]);

  useEffect(
      (() => {
          BookApi.getRecentBooks().then(books => {
              setBooks(books)
              // setIsLoading(false);
          }).catch(err => {
              // setError(`Error fetching events: ${err.message}`)
              setBooks([]);
          });
      }), 
      [] // only call the fetch once by passing in empty params
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom> 
          Recent Reads 
        </Typography>
        <Typography variant="body2"  className={classes.description}>
            <List disablePadding component="div" dense>
               {books.map(book => 
                  <ListItem key={book.id}>
                    <ListItemText primary={book.name} secondary={book.bookAuthor ? book.bookAuthor.name : null}/>
                  </ListItem>
                )}
            </List>
          </Typography>
      </CardContent>
    </Card>
    // <AppLink >
    // </AppLink>
  );
}

export default RecentBooksCard;
