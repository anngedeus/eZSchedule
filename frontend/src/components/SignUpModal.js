import React from 'react'
import { Grid, Paper, Typography, TextField, Button, makeStyles, InputAdornment } from '@material-ui/core'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import lscache from 'lscache';
import { Alert, DialogActions, DialogTitle, IconButton } from '@mui/material';
import { useUser } from './User';
import CloseIcon from '@mui/icons-material/Close';

export default React.forwardRef((props, ref) => {
    const navigate = useNavigate();
    const user = useUser();

    const [failureMessage, setFailureMessage] = React.useState('');

    async function registerUser(event) {
        event.preventDefault();
        const name = document.querySelector('#name').value
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value

        try {
            const result = await fetch('/api/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const response = await result.json();

            if (response.error !== 0) {
                setFailureMessage('Account with that email already exists');
            } else {
                setFailureMessage('');

                lscache.set('token', response.token, 1440 /* minutes */);
                lscache.set('name', name);
                user.updateUser(response.token, response.name, response.major);

                navigate('/', { replace: true });
            }
        } catch (e) {
            setFailureMessage('An internal error occurred');
        }
    }

    const UseStyles = makeStyles((theme) => ({
        paperStyle: {
            padding: '30px 20px', 
            width: 300, 
            margin: "20px auto" 
        },
        headerStyle: {
            margin: 0,
            marginTop: 15,
            fontFamily: 'Arvo'
        },
        marginTop: {
            marginTop: 5
        },
        linkcustom: {
            fontFamily: 'Callie Chalk Font',
            fontSize: "40px",
            textDecoration: "none",
            color: "black",
            display: "flex",
        },

    }))

    const classes = UseStyles();

    return (
        <form id='reg-form' onSubmit={registerUser} style={{height: '100%'}}>
            { user.loggedIn && <Navigate to="/" replace /> }
            <DialogTitle>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <IconButton onClick={props.handleClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Paper elevation={0} className={classes.paperStyle} style={{marginTop: 0, paddingTop: 0, marginBottom: 0, paddingBottom: 0}}>
                <Grid align='center'>
                    <div>
                        <NavLink to="/" className={classes.linkcustom} style={{color: '#F5BB10', justifyContent: 'center'}}>
                            eZ Schedule.
                        </NavLink>
                    </div>
                    <h2 className={classes.headerStyle}>Sign Up</h2>
                    <Typography variant='caption' gutterBottom style={{fontFamily: 'Arvo'}}>Please fill out this form to create an account!</Typography>
                </Grid>
                <TextField fullWidth id="name" 
                label='Name' 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start"><AccountCircleIcon/></InputAdornment>}}
                />
                <TextField fullWidth id="email" 
                label='Email' 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start"><EmailIcon/></InputAdornment>}}
                />
                <TextField fullWidth id="password" 
                label='Password'
                type="password" 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment>}}
                />
                <TextField fullWidth 
                label='Confirm Password' 
                type="password" 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment>}}
                />
                { failureMessage.length > 0 && <Alert severity="error" style={{ marginTop: 25 }}>{failureMessage}</Alert> }
            </Paper>
            <DialogActions sx={{paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px'}}>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Button type='submit' variant='contained' color='secondary'>Create Account</Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </form>
    )
})
