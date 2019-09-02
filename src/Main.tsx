import React from 'react';
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme, Toolbar, Container, Box } from "@material-ui/core";
import Header from "./core/Header";
import { Route } from "react-router";
import Home from "./core/Home";
import OrgContentRoute from "./org/OrgContentRoute";
import Login from "./core/Login";
import ScrollToTop from './core/components/ScrollToTop';
import Books from './books/Books';

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      app: {
        display:'flex',
        minHeight:'100vh',
        width:'100%',
        margin: '0 auto',
        background: theme.palette.primary.main
      },
      main: {
        flexGrow:1,
        overflow:'hidden',
        paddingBottom:theme.spacing(2),
        marginBottom:theme.spacing(4)
      },
      container: {
      }
    });
  },
);



function Main() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <Header />
      <main className={classes.main}>
        <Toolbar />
        <Container className={classes.container}>
          <Box my={4}>
            <ScrollToTop >
              <Route exact path="/" component={Home} />
              <Route exact path="/org/*" component={OrgContentRoute} />
              <Route exact path="/books" component={Books} />
              <Route exact path="/login" component={Login} />
            </ ScrollToTop>
          </Box>
        </Container>
      </main>
    </div>
  )
}

export default Main;