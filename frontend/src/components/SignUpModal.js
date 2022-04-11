import React from 'react'
import { Grid, Paper, Typography, TextField, Button, makeStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import { NavLink } from 'react-router-dom'


export default function SignUp() {

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('#reg-form')
        const submit = document.querySelector('submit')
        form.addEventListener(submit, registerUser)

        async function registerUser(event) {
            event.preventDefault();
            const name = document.querySelector('#name').value
            const email = document.querySelector('#email').value
            const password = document.querySelector('#password').value
    
            const result = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify ({
                    name,
                    email,
                    password     
                }).then((res) => res.json())
            })
    
            console.log(result)
    
        }
    });

    const UseStyles = makeStyles((theme) => ({
        paperStyle: {
            padding: '30px 20px', 
            width: 300, 
            margin: "20px auto" 
        },
        headerStyle: {
            margin: 0,
            marginTop: 15
        },
        avatarStyle: {
            backgroundColor: '#1bbd7e'
        },
        marginTop: {
            marginTop: 5
        },
        linkcustom: {
            fontFamily: "Arvo",
            fontSize: "40px",
            textDecoration: "none",
            color: "black",
            display: "flex",
        },

    }))

    const classes = UseStyles();

    return (  
        
        <Grid>
        <Paper elevation={20} className={classes.paperStyle}>
            <Grid align='center'>
                <div>
                    <NavLink to="/" exact  className={classes.linkcustom} style={{color: '#FEDB74', justifyContent: 'center'}}>
                        eZ Schedule.
                    </NavLink>
                 </div>
                <h2 className={classes.headerStyle}>Sign Up</h2>
                <Typography variant='caption' gutterBottom>Please fill this form to create an account!</Typography>
            </Grid>
            <form id='reg-form'>
                <TextField fullWidth id="name" label='Name' placeholder="Enter your name" />
                <TextField fullWidth id="email" label='Email' placeholder="Enter your email" />
                <FormControl component="fieldset" className={classes.marginTop}></FormControl>
                <TextField fullWidth id="password" label='Password' placeholder="Enter your password" type="password"/>
                <TextField fullWidth label='Confirm Password' placeholder="Confirm your password" type="password"/>
                <Button style={{marginTop: 25}} type='submit' variant='contained' color='secondary'>Create Account</Button>
            </form>
        </Paper>
    </Grid>
     
    )
    
}