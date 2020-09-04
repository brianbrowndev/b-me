import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, makeStyles, Theme, createStyles, List, ListItemText, ListItem, ListItemIcon, CardActions, Button, Divider } from '@material-ui/core';
import AppLink from '../core/components/AppLink';
import { Book } from '../common/client';
import { BookApi } from '../common/client/BookApi';
import BookIcon from '@material-ui/icons/Book';
import AppSpinner from '../core/components/AppSpinner';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    card: {
      width: '300px',
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
      BookApi.getBooks(5).then(books => {
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
        {isLoading ? (<AppSpinner />)
          : (
            <List disablePadding component="div" dense>
              {error &&
                <Typography color="error" variant="overline">{error}</Typography>
              }
              {books.map(book =>
                <ListItem key={book.id}>
                  {(book.bookStatus && book.bookStatus.keyword === 'STARTED') &&
                    <ListItemIcon>
                      <BookIcon color="secondary" />
                    </ListItemIcon>
                  }
                  <ListItemText primary={book.name} secondary={book.bookAuthor ? book.bookAuthor.name : null} />
                </ListItem>
              )}
            </List>
          )}
      </CardContent>
      <Divider />
      <CardActions>
        <AppLink to="/reading/books" exact={true}>
          <Button size="small" color="secondary">
            View More
          </Button>
        </AppLink>
      </CardActions>
    </Card>
  );
}

export default RecentBooksCard;
