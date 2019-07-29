import React, { Fragment, useContext } from 'react';


import {AuthContext } from './Auth'

import {
  Link,
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import './Header.scss';
import { Typography, Divider,  Button, createStyles, makeStyles, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// const useStyles = makeStyles( () => {
//     createStyles({
//         title: {
//             flexGrow:1
//         }
//     })
// });

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1
    }
  }),
);


function Header({ history}: RouteComponentProps) {

    const authContext = useContext(AuthContext);

    const classes = useStyles();

    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);

    const logout = () => {
        // setAnchorEl(null);
        authContext.logout(() => history.push("/"));
    }

    return (
        <AppBar position="static" color="primary" elevation={1}>
        {/* // <header className="App-header"> */}
            <Toolbar>
                {/* <div className="App-header-logo">
                    <Link to="/"><strong className="App-title">Events</strong></Link>
                </div> */}

                {/* <Icon>
                    <FontAwesomeIcon icon='wind'  />
                </Icon> */}
                <Divider/>
                <Typography variant="h6" className={classes.title} >
                    Me
                </Typography>
                { authContext.authenticated ? (
                    <Fragment>

                    <NavLink exact to="/upcoming" activeClassName="App-header-nav--active">upcoming</NavLink>
                    <IconButton
                        aria-label="User"
                        onClick={logout}>
                        <FontAwesomeIcon icon='sign-out-alt'/>
                    </IconButton>

                    </Fragment>
// // {/* <div className="App-header-nav"> */}
//                         // <div>
//                             {/* &nbsp;|&nbsp; */}
//                             {/* <NavLink exact to="/submit" activeClassName="App-header-nav--active">submit</NavLink> */}
//                         // </div>
//                         // <div>
//                                                     {/* <IconButton
//                                     aria-label="User"
//                                     aria-controls="long-menu"
//                                     aria-haspopup="true"
//                                     onClick={(evt) => setAnchorEl(evt.currentTarget)}>
//                                     <FontAwesomeIcon icon='user-circle'/>
//                                 </IconButton>
//                                 <Menu
//                                     id="long-menu"
//                                     anchorEl={anchorEl}
//                                     open={open}
//                                     onClose={() => setAnchorEl(null)}>
//                                         <Container>
//                                             <div>{authContext.username}</div>
//                                             <MenuItem onClick={logout}>Logout</MenuItem>
//                                         </Container>
//                                 </Menu> */}
//                                 {/* Logout */}
//                             {/* </Button> */}
//                         // </div>
//                     // </div>
            ) : (
                <Button color="inherit">
                    <Link to="/login">login</Link>
                </Button>
                )}
            </Toolbar>
        </AppBar>
        // {/* // </header> */}
    );
}




export default withRouter(Header);
