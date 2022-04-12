import React from 'react'
import {
    Toolbar,
    Typography,
    makeStyles,
    Container,

} from "@material-ui/core";
import webdesign from '../media/webdesign.png';

const UseStyles = makeStyles((theme) => ({

    design: {
        marginLeft: theme.spacing(-50),
        marginTop: theme.spacing(-10),
        width: '150%',
        height: '150%',
    },
    welcomeMessage: {
        fontSize: "40px",
        fontFamily: "Arvo",
        fontWeight: "lighter",
        marginLeft: theme.spacing(20),
        marginTop: theme.spacing(20),
    },
    motto: {
        fontSize: "20px",
        fontFamily: "Arvo",
        fontWeight: "lighter",
        marginLeft: theme.spacing(20),
        marginTop: theme.spacing(5),
    }

}));



export default function Welcome() {

    const classes = UseStyles();

    return (
       <Container>
           <Typography className={classes.welcomeMessage}>
                <span style={{color: '#9695F0'}}>Welcome!</span> to your very own <br/>eZ Schedule
           </Typography>
           <Typography className={classes.motto}>
               "We provide the perfect 4-year plan for you" 
               <span style={{fontWeight: 'bold', color: '#2EC400'}}> -21 Savage LLC</span>
           </Typography>
           <Toolbar xs={12} sm={6}>
               <img src={webdesign} alt="" className={classes.design}/>
           </Toolbar>
       </Container>
    )
}