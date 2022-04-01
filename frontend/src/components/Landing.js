import react from 'react';
import {RaisedButton} from './button'
import {Choices, Header} from './components' //will this work?
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useState} from 'react';
import './Landing.css';

export default function WelcomeScreen() {

	const [textInput, setTextInput] = useState(''); //data of text field stored in the state textInput

	const handleInputChange = event => {
		setTextInput(event.target.value);
	};

	return (
 		<>
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
					<TextField id="outlined-required" label="Course" onChange={handleInputChange} style={{ width: '40%', position: 'absolute', left: '29%', top: '450px'}} />
					</div>
				</Box>
			</Choices>
			</section>
		</>
	)
}
