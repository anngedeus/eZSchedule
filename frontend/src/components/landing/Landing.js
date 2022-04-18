import TextField from '@mui/material/TextField';
import {Select } from '@material-ui/core';
import {Paper, makeStyles, Typography, Button} from '@material-ui/core'
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect, useState} from 'react';
import { useUser } from '../User';
import { Navigate } from 'react-router-dom';
import { Autocomplete, Grid, IconButton, List, ListItem, ListItemText} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import lscache from 'lscache';

export default function Landing() {
	const user = useUser();
	
	const [majors, setMajors] = useState([]);
	const [courses, setCourses] = useState([]);
	const [courseHistory, setCourseHistory] = useState([]);
	const [targetCourse, setTargetCourse] = useState(null);
	const [targetMajor, setTargetMajor] = useState(null);

	useEffect(async () => {
		const [majorsRes, coursesRes] = await Promise.allSettled([fetch('/api/majors'), fetch('/api/courses')]);
		const [majorsResponse, coursesResponse] = await Promise.allSettled([ majorsRes.value.json(), coursesRes.value.json() ]);
		setMajors(majorsResponse.value.majors);
		setCourses(coursesResponse.value.courses);

		if (user.major) {
			const target = majorsResponse.value.majors.find(obj => obj.code === user.major);
			if (target) {
				setTargetMajor(target.name);
			}
		}
	}, []);

	const updateCourses = async () => {
		const res = await fetch('/api/course-history', {
			headers: {
				'Authorization': 'Bearer ' + user.token,
			},
		});
		const response = await res.json();

		setCourseHistory(response.courses);
	};

	useEffect(updateCourses, []);

	const useStyles = makeStyles((theme) => ({
		
		paperStyle: {
            padding: '30px 20px', 
            width: 300, 
            margin: "20px auto" 
        },
		minimalPaperStyle: {
			padding: '30px 20px',
			margin: '20px auto',
		},
		textStyle: {
			fontFamily: 'Arvo', 
			fontSize: '20px',
			fontWeight: 'bolder'			
		},
		boxStyle: {
			marginTop: 15,
		},
		listStyle: {
			fontFamily: 'Arvo', 
			fontSize: '10px' 
		},
		userStyle: {
			fontFamily: 'Arvo', 
			fontSize: '20px',
		},
		guide: {
			fontFamily: 'Arvo', 
			fontSize: '15px',
			marginTop: 25,
		}
		

	}))

	const classes = useStyles();

	const handleSetMajor = async (e) => {
		e.preventDefault();

		const major = targetMajor.id;

		const res = await fetch('/api/user-info', {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				major,
			}),
		});
		const response = await res.json();

		if (response.error === 0) {
			lscache.set('major', major);
		}
	};

	const handleAddCourse = async (e) => {
		e.preventDefault();

		const res = await fetch('/api/course-history', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				courseCodes: [targetCourse],
			}),
		});
		const response = await res.json();

		setTargetCourse(null);

		await updateCourses();
	};

	const handleRemoveCourse = async (e, course) => {
		const res = await fetch('/api/course-history', {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + user.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				courseCodes: [course],
			}),
		});
		const response = await res.json();

		await updateCourses();
	};

	return (
		<Grid
		container
		justifyContent="center"
		alignItems="stretch"
		direction="row"
		sx={{height: '100%'}}
		>
			{ !user.loggedIn && <Navigate to="/Login" replace /> }
			<Grid item sx={{flexGrow: 0}}>
				<Paper elevation={20} className={classes.paperStyle} style={{
					marginLeft: 20,
					marginRight: 20,
					width: 250,
					background: '#E9E9FF',
					boxSizing: 'border-box',
					height: 'calc(100% - 40px)',
				}}>
					<Grid container justifyContent="center" alignItems="center">
						<Grid item>
							<IconButton><Avatar style={{width: 150, height: 150}}/></IconButton>
						</Grid>
					</Grid>
					<Typography component={'div'} className={classes.userStyle}>
						<span style={{color: '#FE3B00', fontWeight: 'bolder'}}>WELCOME! </span> To your scheduler {user.name}
					</Typography>
					<Typography component={'div'} className={classes.guide}>
						Quick Guide:
						<List>
							<ListItem>
								1. Input your major
							</ListItem>
							<ListItem>
								2. Input Previous Courses
							</ListItem>
						</List>
					</Typography>

				</Paper>
			</Grid>
			<Grid item sx={{flexGrow: 2, height: '100%'}}>
				<Grid
				container
				direction="column"
				sx={{height: '100%'}}
				>
					<Grid item sx={{flexGrow: 2, height: '100%'}}>
						<Grid
						container
						alignItems="center"
						justifyContent="space-evenly"
						sx={{height: '100%'}}
						>
							<Grid item sx={{flexGrow: 1, height: '100%', marginRight: 3}}>
								<Grid
								container
								direction="column"
								sx={{height: '100%'}}>
									<Grid item sx={{flexGrow: 0}}>
										<Paper elevation={20} className={classes.minimalPaperStyle} style={{marginBottom: '10px'}}>
											<form onSubmit={handleSetMajor}>
												<Grid container>
													<Grid item sx={{flexGrow: 1, margin: 'auto 1em'}}>
														<Autocomplete className={classes.boxStyle}
														options={majors.map(i => ({label: i.name, id: i.code}))}
														renderInput={(params) => <TextField {...params} label="Major"/>}
														selectOnFocus
														clearOnBlur
														handleHomeEndKeys
														value={targetMajor}
														onChange={(e, v) => setTargetMajor(v)}
														isOptionEqualToValue={(option, value) => option.label === value}
														/>
													</Grid>
													<Grid item>
														<Button style={{marginTop: 25}} type='submit' variant='contained' color='secondary'>Set Major</Button>
													</Grid>
												</Grid>
											</form>
										</Paper>
									</Grid>
									<Grid item sx={{flexGrow: 1}}>
										<Paper elevation={20} className={classes.minimalPaperStyle} style={{height: 'calc(100% - 30px)', boxSizing: 'border-box', marginTop: '10px', marginBottom: '10px'}}>
											<Grid
											container
											direction="column"
											sx={{height: '100%'}}
											>
												<Grid item sx={{flexGrow: 0}}>
													<Typography className={classes.textStyle}>Your Previous Courses</Typography>
												</Grid>
												<Grid item sx={{flexGrow: 1, position: 'relative'}}>
													<List sx={{
														position: 'absolute',
														top: 0,
														left: 0,
														right: 0,
														bottom: 0,
														overflow: 'auto',
													}}>
													{courseHistory.map(i =>
														<ListItem  secondaryAction={
															<IconButton edge="end" onClick={(e) => handleRemoveCourse(e, i)}>
																<DeleteIcon/>
															</IconButton>
														}
														key={i}
														>
															<ListItemText primaryTypographyProps={{fontFamily: 'Arvo', fontSize: '15px'}} primary={i}/>
														</ListItem>
													)}
													</List>
												</Grid>
												<Grid item sx={{flexGrow: 0}}>
													<form onSubmit={handleAddCourse}>
														<Grid container>
															<Grid item sx={{flexGrow: 1, margin: 'auto 1em'}}>
																<Autocomplete className={classes.boxStyle}
																options={courses}
																renderInput={(params) => <TextField {...params} label="Courses"/>}
																selectOnFocus
																clearOnBlur
																handleHomeEndKeys
																value={(targetCourse) ? targetCourse : null}
																onChange={(e, v) => setTargetCourse(v)}
																onInputChange={(e, v) => setTargetCourse(v)}
																/>
															</Grid>
															<Grid item>
																<Button style={{marginTop: 25}} type='submit' variant='contained' color='secondary'>Add Course</Button>
															</Grid>
														</Grid>
													</form>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Grid>
							<Grid item sx={{flexGrow: 1, height: '100%', marginRight: 3}}>
								<Paper elevation={20} className={classes.minimalPaperStyle} style={{height: 'calc(100% - 40px)', boxSizing: 'border-box'}}>
									<Typography className={classes.textStyle}>Suggested plan</Typography>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
