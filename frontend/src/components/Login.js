import React from 'react'
import { Dialog, Grid, Typography, Alert } from '@mui/material'
import { InputAdornment, makeStyles, Paper } from '@material-ui/core'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SignUpModal from './SignUpModal'
import loginImage from '../media/books1.webp'
import lscache from 'lscache';
import { useUser } from './User';

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

                console.log(response);

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

    return (
        <div {...props} ref={ref}>
            { user.loggedIn && <Navigate to="/" replace/> }
            <Grid container style={{minHeight: '100vh', overflow: 'hidden'}} >
                <Grid item xs={12} sm={6}>
                    <img src={loginImage} style={{width: '100%', height: '100vh', objectFit: 'cover'}} alt=""/>
                </Grid>
                <Grid container item xs={12} sm={6} 
                alignItems="center" 
                direction="column" 
                justifyContent="space-between"
                style={{padding: 10}}
                >
                    <Paper elevation={20} className={classes.paperStyle}>
                        <div style={{display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                            <Grid container justify="center">
                                <div><NavLink to="/" className={classes.linkcustom} style={{color: '#F5BB10'}}>
                                    eZ Schedule.</NavLink>
                                </div>
                            </Grid>
                            <form id="login-form" onSubmit={handleLogIn}>
                                <TextField label="Email" margin="normal" id="login-email"
                                InputProps={{startAdornment:<InputAdornment position="start"><EmailIcon/></InputAdornment>}}
                                />
                                <TextField label="Password" margin="normal" type="password" id="login-password"
                                InputProps={{startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment>}}
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
            <Dialog open={open} onClose={handleClose}>
                <SignUpModal/>
            </Dialog>
        </div>
    )
});
