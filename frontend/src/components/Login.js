import React from 'react'
import { Grid, Typography } from '@mui/material'
import loginImage from '../media/ufcampus1.jpeg'
import { InputAdornment, makeStyles } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Modal from '@mui/material/Modal';
import SignUpModal from './SignUpModal'



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Login() {

    const UseStyles = makeStyles((theme) => ({
        linkcustom: {
            fontFamily: "Arvo",
            fontSize: "40px",
            textDecoration: "none",
            color: "black",
            display: "flex",
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
                    <div style={{display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300}}>
                        <Grid container justify="center">
                            <div><NavLink to="/" exact  className={classes.linkcustom} style={{color: '#FEDB74'}}>
                                eZ Schedule.</NavLink>
                            </div>
                        </Grid>
                        <TextField label="Email" margin="normal" 
                        InputProps={{startAdornment:<InputAdornment position="start">
                            <AccountCircleIcon/></InputAdornment>}} 
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
                        <Typography>Don't have an account?
                        {/* <Button component={NavLink} to="/SignUp" variant="text" style={{fontWeight: 'bold'}}> 
                                Sign Up
                        </Button>                         */}
                        <Button onClick={handleOpen} variant="text" style={{fontWeight: 'bold'}}>Sign Up Here!</Button>
                            <Modal open={open} onClose={handleClose}>                             
                                <SignUpModal/>                                
                            </Modal>
                        </Typography>
                        
                    </div>
                    <div />
                    <div />
                </Grid>
            </Grid>
        </div>
    )
}