import React from 'react';
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme, Toolbar, Container, Box } from "@material-ui/core";
import Header from "./core/Header";
import { Route } from "react-router";
import Home from "./core/Home";
import OrgContentRoute from "./org/OrgContentRoute";
import Login from "./core/Login";

const useStyles = makeStyles((theme: Theme) =>
  {
    return createStyles({
      app: {
        display:'flex',
        minHeight:'100vh',
        width:'100%',
        margin: '0 auto',
        background: '#ffffff'
      },
      main: {
        flexGrow:1,
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
        <Container>
          <Box my={2}>
            <Route exact path="/" component={Home} />
            <Route exact path="/org/*" component={OrgContentRoute} />
            <Route exact path="/login" component={Login} />
          </Box>
        </Container>
      </main>
    </div>
  )
}

export default Main;