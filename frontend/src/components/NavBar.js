import React, {useState} from 'react'
import {
    Toolbar,
    Typography,
    makeStyles,
    AppBar,
    Hidden,

} from "@material-ui/core";
import { NavLink, useNavigate } from 'react-router-dom'
import { IconButton } from '@material-ui/core'
import { Menu } from '@material-ui/icons';
import { SwipeableDrawer } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { List } from '@material-ui/core';
import { ListItem } from '@material-ui/core';
import { useUser } from './User';
import lscache from 'lscache';

const UseStyles = makeStyles((theme) => ({

    appBar: {
        // background: "#ECECFF",
        background: "white",
    },
    linkcustom: {
        textDecoration: "none",
        color: "black",
        marginLeft: theme.spacing(15),
        "&:hover": {
            color: "#2EC400",
        },
        display: "flex",
    },
    nameLarge: {
        color: "black",
        fontSize: "20px",
        fontFamily: 'Callie Chalk Font',
        fontWeight: "bolder",
        marginLeft: theme.spacing(15),
        flexGrow: "1",
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        }
    },
    nameSmall: {
        color: "black",
        fontSize: "15px",
        fontFamily: 'Callie Chalk Font',
        fontWeight: "bolder",
        display: "block",
        flexGrow: "1",
        marginLeft: theme.spacing(15),
        [theme.breakpoints.up("sm")]: {
            display: "none",
        }
    },
    navlinks: {
        marginLeft: theme.spacing(-60),
        display: "flex",
      },

}));

export default function NavBar() {
    const classes = UseStyles();
    const [open, setOpen] = useState(false)
    const user = useUser();
    const navigate = useNavigate();

    let bigLogInOrOutLink;
    let smallLogInOrOutLink;

    const handleLogOut = (event) => {
        event.preventDefault();

        lscache.remove('token');
        user.updateUser(null, null);

        navigate('/');
    };

    if (user.loggedIn) {
        bigLogInOrOutLink =
            <a className={classes.linkcustom} style={{fontFamily: 'Arvo', fontSize: '15px'}} href="#" onClick={handleLogOut}>
                Logout
            </a>
        smallLogInOrOutLink =
            <ListItem>
                <a className={classes.linkcustom} fontSize="15px" href="#" onClick={handleLogOut}>
                    Logout
                </a>
            </ListItem>
    } else {
        bigLogInOrOutLink =
            <NavLink to="/Login" className={classes.linkcustom} style={{fontFamily: 'Arvo', fontSize: '15px' }}>
                Login
            </NavLink>
        smallLogInOrOutLink =
            <ListItem>
                <NavLink to="/Login" className={classes.linkcustom} fontSize="15px">
                    Login
                </NavLink>
            </ListItem>
    }

    return (
        <AppBar className={classes.appBar} elevation={2} position='fixed' top='0'>
        <Toolbar>
            <Typography component={'div'} className={classes.nameLarge}>
                <div><NavLink to="/" className={classes.linkcustom} style={{marginLeft: -50, color: '#F5BB10'}}>eZ Schedule.</NavLink></div>
            </Typography>
            <Typography component={'div'} className={classes.nameSmall}>
                <div><NavLink to="/" className={classes.linkcustom} style={{color: '#F5BB10'}}>eZ Schedule.</NavLink></div>
            </Typography>
            <Typography component={'div'}>
                <Hidden smDown>
                    <div className={classes.navlinks}>
                        <NavLink to="/" className={classes.linkcustom} style={{fontFamily: 'Arvo', fontSize: '15px' }}>
                            Home
                        </NavLink>
                        {bigLogInOrOutLink}
                    </div>
                </Hidden>
            </Typography>
            <Hidden mdUp>
                <IconButton>
                    <Menu onClick={() => setOpen(true)}/>
                </IconButton>
            </Hidden>
        </Toolbar>
        <SwipeableDrawer anchor="right" open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
            <div>
                <IconButton>
                    <ChevronRight onClick={() => setOpen(false)}/>
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem>
                    <NavLink to="/" className={classes.linkcustom} fontSize="15px">
                        Home
                    </NavLink>
                </ListItem>
                {smallLogInOrOutLink}
            </List>
        </SwipeableDrawer>
        </AppBar>
    )
}

