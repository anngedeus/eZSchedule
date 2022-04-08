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
        marginBottom: theme.spacing(-90),
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
        fontSize: "30px",
        fontFamily: "Arvo",
        fontWeight: "lighter",
        marginLeft: theme.spacing(20),
    }

}));



export default function Welcome() {

    const classes = UseStyles();

    return (
       <Container>
           <Typography className={classes.welcomeMessage}>
                <span style={{color: '#9695F0'}}>Welcome!</span> to your very own <br/>eZ Schedule
           </Typography>
           <Toolbar>
               <img src={webdesign} alt="" className={classes.design}/>
           </Toolbar>
       </Container>
    )
}