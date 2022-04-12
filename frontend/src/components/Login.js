import React from 'react'
import { Grid, Typography } from '@mui/material'
import { InputAdornment, makeStyles, Paper } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Modal from '@mui/material/Modal'
import SignUpModal from './SignUpModal'
import loginImage from '../media/books1.webp'



export default function Login() {

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

    return (
        <div>
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
                    <div />
                    <Paper elevation={20} className={classes.paperStyle}>
                        <div style={{display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                            <Grid container justify="center">
                                <div><NavLink to="/" exact  className={classes.linkcustom} style={{color: '#F5BB10'}}>
                                    eZ Schedule.</NavLink>
                                </div>
                            </Grid>
                            <TextField label="Email" margin="normal" 
                            InputProps={{startAdornment:<InputAdornment position="start">
                                <EmailIcon/></InputAdornment>}} 
                            />
                            <TextField label="Password" margin="normal" type="password" 
                            InputProps={{startAdornment: <InputAdornment position="start">
                                <LockIcon/></InputAdornment>}}
                            />
                            <div style={{height: 20}} />
                                <Button color="secondary" variant="contained">
                                    Log In
                                </Button>
                            <div style={{height: 20}} />
                            <Typography style={{ fontFamily: 'Arvo', fontSize: '14px'}}>Don't have an account?
                                <Button onClick={handleOpen} variant="text" style={{fontWeight: 'bold', fontFamily: 'Arvo',  fontSize: '14px'}}>
                                    Sign Up Here!
                                </Button>
                                <Modal open={open} onClose={handleClose} style={{marginTop: 100}}>                             
                                    <SignUpModal/>                                
                                </Modal>
                            </Typography>
                            </div>
                        </Paper>
                        <div />
                    <div />

                </Grid>
            </Grid>
        </div>
    )
}