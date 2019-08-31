import React, { useState, useEffect } from 'react';
import {  Card, CardContent, Typography, makeStyles, Theme, createStyles, List, ListItemText, ListItem, CircularProgress, Grid, ListItemIcon, CardActions, Button } from '@material-ui/core';
import AppLink from '../core/components/AppLink';
import { Book } from '../common/client';
import BookApi from '../common/client/BookApi';
import BookIcon from '@material-ui/icons/Book';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
        width:'300px',
    },
    progress: {
      margin: theme.spacing(2),
    }
  })
});

function RecentBooksCard() {
  const classes = useStyles();

  const [books, setBooks] = useState<Array<Book>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(
      (() => {
          BookApi.getRecentBooks().then(books => {
              setBooks(books)
              setIsLoading(false);
          }).catch(err => {
              setError(`Error fetching books: ${err.message}`)
              setIsLoading(false);
              setBooks([]);
          });
      }), 
      [] 
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom> 
          Recent Reads 
        </Typography>
        { isLoading ? (
          <Grid container justify="center" alignItems="center">
            <CircularProgress className={classes.progress} color="secondary" />
          </Grid>
        ) : (
          <List disablePadding component="div" dense>
              { error && 
                <Typography color="error" variant="overline">{error}</Typography>
              }
              {books.map(book => 
                <ListItem key={book.id}>
                  { (book.bookStatus && book.bookStatus.name === 'Started') && 
                  <ListItemIcon>
                    <BookIcon color="secondary" />
                  </ListItemIcon>
                  }
                  <ListItemText primary={book.name} secondary={book.bookAuthor ? book.bookAuthor.name : null}/>
                </ListItem>
              )}
          </List>
        ) }
      </CardContent>
      <CardActions>
        <AppLink to="/books" exact={true}>
          <Button size="small" color="secondary">
            View More
          </Button>
        </AppLink>
      </CardActions>
    </Card>
  );
}

export default RecentBooksCard;
