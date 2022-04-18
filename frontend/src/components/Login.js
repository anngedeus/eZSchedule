import React from 'react'
import { Dialog, Grid, Typography, Alert, useMediaQuery } from '@mui/material'
import { InputAdornment, makeStyles, Paper } from '@material-ui/core'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SignUpModal from './SignUpModal'
import loginImage from '../media/books1.webp'
import lscache from 'lscache';
import { useUser } from './User';
import { createTheme } from '@mui/system';

const theme = createTheme();

export default React.forwardRef((props, ref) => {
    const navigate = useNavigate();
    const user = useUser();

    const UseStyles = makeStyles((theme) => ({
        linkcustom: {
            fontFamily: 'Callie Chalk Font',
            fontSize: "40px",
            textDecoration: "none",
            color: "black",
            display: "flex",
        },
        paperStyle: {
            padding: '30px 20px', 
            width: 300, 
            margin: "20px auto" 
        },

    }));

    const classes = UseStyles();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [invalidLogin, setInvalidLogin] = React.useState(false);

    const handleLogIn = async (event) => {
        event.preventDefault();

        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;

        try {
            const result = await fetch('/api/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const response = await result.json();

            if (response.error !== 0) {
                setInvalidLogin(true);
            } else {
                setInvalidLogin(false);

                lscache.set('token', response.token, 1440 /* minutes */);
                lscache.set('name', response.name);
                if (response.major) {
                    lscache.set('major', response.major);
                }
                user.updateUser(response.token, response.name, response.major);

                navigate('/', { replace: true });
            }
        } catch (e) {
            setInvalidLogin(true);
        }
    };

    const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));

    const heightOrWidth = breakpoint ? {
        width: '100%',
    } : {
        height: '100%',
    };

    return (
        <div {...props} ref={ref} style={{height: '100%'}}>
            { user.loggedIn && <Navigate to="/" replace/> }
            <Grid
            container
            style={{height: '100%'}}
            direction="row"
            >
                { !breakpoint &&
                    <Grid item style={{padding: 10, height: '100%', flexGrow: 1, boxSizing: 'border-box', maxWidth: '50%'}}>
                        <Grid container justifyContent="center" alignItems="center" style={{height: '100%'}}>
                            <Grid item style={{height: '100%'}}>
                                <img src={loginImage} style={{...heightOrWidth, objectFit: 'cover'}} alt=""/>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                <Grid
                item
                style={{padding: 10, height: '100%', flexGrow: 1, boxSizing: 'border-box'}}
                >
                    <Grid
                    container
                    alignItems="center" 
                    direction="column" 
                    justifyContent="center"
                    style={{height: '100%'}}
                    >
                        <Grid item>
                            <Paper elevation={20} className={classes.paperStyle}>
                                <div style={{display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                                    <Grid container justify="center">
                                        <Grid item>
                                            <NavLink to="/" className={classes.linkcustom} style={{color: '#F5BB10'}}>
                                                eZ Schedule.
                                            </NavLink>
                                        </Grid>
                                    </Grid>
                                    <form id="login-form" onSubmit={handleLogIn}>
                                        <TextField label="Email" margin="normal" id="login-email"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><EmailIcon/></InputAdornment>
                                        }}
                                        style={{width: '100%'}}
                                        />
                                        <TextField label="Password" margin="normal" type="password" id="login-password"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment>
                                        }}
                                        style={{width: '100%'}}
                                        />
                                        <div style={{height: 20}} />
                                        { invalidLogin && <Alert severity="error" style={{ marginBottom: 20 }}>Invalid username/password</Alert> }
                                        <Button color="secondary" variant="contained" type='submit'>
                                            Log In
                                        </Button>
                                    </form>
                                    <div style={{height: 20}} />
                                    <Typography component={'div'} style={{ fontFamily: 'Arvo', fontSize: '14px'}}>Don't have an account?
                                        <Button onClick={handleOpen} variant="text" style={{fontWeight: 'bold', fontFamily: 'Arvo',  fontSize: '14px'}}>
                                            Sign Up Here!
                                        </Button>
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} fullScreen={breakpoint}>
                <SignUpModal handleClose={handleClose} breakpoint={breakpoint}/>
            </Dialog>
        </div>
    )
});
