import React from 'react'
import { Grid, Paper, Typography, TextField, Button, makeStyles, InputAdornment } from '@material-ui/core'
import { NavLink, useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import lscache from 'lscache';
import { Alert } from '@mui/material';

export default React.forwardRef((props, ref) => {
    const navigate = useNavigate();

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

            if (response.error != 0) {
                setFailureMessage('Account with that email already exists');
            } else {
                setFailureMessage('');

                lscache.set('token', response.token, 1440 /* minutes */);

                navigate('/Landing', { replace: true });
            }
        } catch (e) {

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
        
        <Paper elevation={0} className={classes.paperStyle}>
            <Grid align='center'>
                <div>
                    <NavLink to="/" exact  className={classes.linkcustom} style={{color: '#F5BB10', justifyContent: 'center'}}>
                        eZ Schedule.
                    </NavLink>
                 </div>
                <h2 className={classes.headerStyle}>Sign Up</h2>
                <Typography variant='caption' gutterBottom style={{fontFamily: 'Arvo'}}>Please fill this form to create an account!</Typography>
            </Grid>
            <form id='reg-form'>
                <TextField fullWidth id="name" 
                label='Name' 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start">
               <AccountCircleIcon/></InputAdornment>}}               
                />
                <TextField fullWidth id="email" 
                label='Email' 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start">
               <EmailIcon/></InputAdornment>}}          
                />
                {/* <FormControl component="fieldset" className={classes.marginTop}></FormControl> */}
                <TextField fullWidth id="password" 
                label='Password'
                type="password" 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start">
                <LockIcon/></InputAdornment>}}                         
                />
                <TextField fullWidth 
                label='Confirm Password' 
                type="password" 
                margin="normal"
                InputProps={{startAdornment: <InputAdornment position="start">
                <LockIcon/></InputAdornment>}}          
                />
                { failureMessage.length > 0 && <Alert severity="error" style={{ marginTop: 25 }}>{failureMessage}</Alert> }
                <Button style={{marginTop: 25}} type='submit' variant='contained' color='secondary' onClick={registerUser}>Create Account</Button>
            </form>
        </Paper>
     
    )
    
})
