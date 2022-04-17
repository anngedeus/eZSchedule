import {RaisedButton} from './button'
import {Choices, Header} from './components' //will this work?
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@material-ui/core';
import { Grid, Paper, Typography, makeStyles} from '@material-ui/core'
import {useState} from 'react';
import { useUser } from '../User';
import { Navigate } from 'react-router-dom';

export default function Landing() {
	const user = useUser();
	
	
	const [major, setMajor] = useState('');
	const [course, setCourse] = useState('');

	const handleCourse = (e) => {
		e.preventDefault()
		console.log(course)
	}
	const handleMajor = (e) => {
		e.preventDefault()	
		console.log(major)
	}

	const useStyles = makeStyles((theme) => ({
		
		field: {
			marginTop: 20,
			marginBottom: 20,
			display: 'block'
		},


	}))

	const classes = useStyles();

	return (
		<>
			{ !user.loggedIn && <Navigate to="/Login" replace /> }

			<Paper>
			   <form noValidate autoComplete="off" onSubmit={handleMajor}>
			   <TextField
			   		onChange={(e) => setMajor(e.target.value)}
					label="Major"
					variant="standard"
					required
					className={classes.field}
				/>
					<Button  
					type="submit"
					color="secondary"
					variant="contained">
						submit
					</Button>		
			   </form>
			   <form noValidate autoComplete="off" onSubmit={handleCourse}>
				<TextField
					onChange={(e) => setCourse(e.target.value)}
					label="Courses"
					variant="standard"
					required
					className={classes.field}
				/>
					<Button  
					type="submit"
					color="secondary"
					variant="contained">
						submit
					</Button>		
			    </form>			
			</Paper>
			<Header>
				<h1>Welcome to the eZ Scheduler!</h1>
				<h2>I don't know anything about you. Let's find that out, shall we?</h2>
			</Header>
			<section style={{fontFamily: 'Courier new', fontSize: '15px'}}>
				<p>We need to know:</p>
				<ul>
					What year you entered UF? When do you plan on graduating? What do you want to major in? and anything you've already taken?
				</ul>
				<p>
					We're working on a few ways to import this information, but for now you can just fill everything out manually or import a file.
				</p>

				<Choices>
					<RaisedButton to="upload" style={{ width: '20%', position: 'absolute', left: '40%'}}>
						Upload a File
					</RaisedButton>
					<Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
						<div>
						<TextField id="outlined-required" label="Major" style={{width: '40%', position: 'absolute', left: '29%', top: '350px'}} />
						</div>
						<div>
						</div>
					</Box>
				</Choices>
			</section>
		</>
	);
}
