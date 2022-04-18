import TextField from '@mui/material/TextField';
import {Select } from '@material-ui/core';
import {Paper, makeStyles, Typography, Button} from '@material-ui/core'
import DeleteIcon from '@mui/icons-material/Delete';
import {useEffect, useState} from 'react';
import { useUser } from '../User';
import { Navigate } from 'react-router-dom';
import { Autocomplete, CircularProgress, Grid, IconButton, List, ListItem, ListItemText, useMediaQuery} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import lscache from 'lscache';
import { createTheme } from '@mui/system';

const theme = createTheme();

export default function Landing() {
	const user = useUser();
	
	const [majors, setMajors] = useState([]);
	const [courses, setCourses] = useState([]);
	const [courseHistory, setCourseHistory] = useState([]);
	const [targetCourse, setTargetCourse] = useState(null);
	const [targetMajor, setTargetMajor] = useState(null);
	const [schedule, setSchedule] = useState([]);
	const [loadingSchedule, setLoadingSchedule] = useState(true);
	const [loadingCourseHistory, setLoadingCourseHistory] = useState(true);
	const [loadingMajors, setLoadingMajors] = useState(true);
	const [loadingCourses, setLoadingCourses] = useState(true);
	const [coursesOpen, setCoursesOpen] = useState(false);

	const loadCourses = async () => {
		const coursesRes = await fetch('/api/courses');
		const coursesResponse = await coursesRes.json();
		setCourses(coursesResponse.courses);
		setLoadingCourses(false);
	};

	useEffect(() => {
		if (coursesOpen && loadingCourses) {
			loadCourses();
		}
	}, [coursesOpen, loadingCourses]);

	useEffect(() => {
		(async () => {
			const majorsRes = await fetch('/api/majors');
			const majorsResponse = await majorsRes.json();
			setMajors(majorsResponse.majors);

			setLoadingMajors(false);

			if (user.major) {
				const target = majorsResponse.majors.find(obj => obj.code === user.major);
				if (target) {
					setTargetMajor(target.name);
				}
			}
		})();
	}, []);

	const updateCourseHistory = async () => {
		setLoadingCourseHistory(true);

		const res = await fetch('/api/course-history', {
			headers: {
				'Authorization': 'Bearer ' + user.token,
			},
		});
		const response = await res.json();

		setLoadingCourseHistory(false);

		setCourseHistory(response.courses);
	};

	const updateSchedule = async () => {
		setLoadingSchedule(true);

		const res = await fetch('/api/schedule', {
			headers: {
				'Authorization': 'Bearer ' + user.token,
			},
		});
		const response = await res.json();

		setLoadingSchedule(false);

		if (response.error === 0) {
			setSchedule(response.schedule);
		}
	};

	useEffect(() => {
		updateCourseHistory();
		updateSchedule();
	}, []);

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
		},
		input: {
			display: "none",
		},
		

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

			await updateSchedule();
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

		await Promise.allSettled([
			updateCourseHistory(),
			updateSchedule(),
		]);
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

		await Promise.allSettled([
			updateCourseHistory(),
			updateSchedule(),
		]);
	};

	const breakpoint = useMediaQuery(theme.breakpoints.down("sm"));

	const height100Style = breakpoint ? {} : {
		height: '100%',
	};

	return (
		<Grid
		container
		justifyContent="center"
		alignItems="stretch"
		direction="row"
		sx={{
			...height100Style,
		}}
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
							<input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
							<label htmlFor="icon-button-file">		
								<IconButton aria-label="upload picture" component="span"><Avatar style={{width: 150, height: 150}}/></IconButton>
							</label>
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
			<Grid item sx={{
				flexGrow: 2,
				...height100Style,
			}}>
				<Grid
				container
				direction={breakpoint ? 'row' : 'column'}
				sx={{
					height: {
						xs: null,
						sm: '100%',
					},
				}}
				>
					<Grid item sx={{
						flexGrow: 2,
						...height100Style,
					}}>
						<Grid
						container
						alignItems="center"
						justifyContent="space-evenly"
						sx={{
							...height100Style,
						}}
						>
							<Grid item sx={{
								flexGrow: 1,
								...height100Style,
								marginRight: 3,
								marginLeft: 3,
							}}>
								<Grid
								container
								direction={breakpoint ? 'row' : 'column'}
								sx={{
									...height100Style,
								}}>
									<Grid item sx={{
										flexGrow: {
											xs: 1,
											sm: 0,
										},
									}}>
										<Paper elevation={20} className={classes.minimalPaperStyle} style={{marginBottom: '10px'}}>
											<form onSubmit={handleSetMajor}>
												{
													loadingMajors ?
													<Grid container justifyContent="center" alignItems="center" sx={{
														...height100Style,
													}}>
														<Grid item>
															<CircularProgress/>
														</Grid>
													</Grid>
													:
													<Grid container
													direction="row"
													justifyContent={{
														xs: 'center',
														sm: null,
													}}
													alignItems={{
														xs: 'center',
														sm: null,
													}}
													>
														<Grid item sx={{
															flexGrow: 1,
															margin: 'auto 1em',
															width: {
																xs: 'calc(100% - 2em)',
																sm: null,
															},
															boxSizing: {
																xs: 'border-box',
																sm: null,
															},
														}}>
															<Autocomplete className={classes.boxStyle}
															options={majors.map(i => ({label: i.name, id: i.code}))}
															renderInput={(params) => <TextField {...params} label="Major"/>}
															selectOnFocus
															clearOnBlur
															handleHomeEndKeys
															value={targetMajor}
															onChange={(e, v) => setTargetMajor(v)}
															isOptionEqualToValue={(option, value) => option.label === value}
															loading={loadingMajors}
															/>
														</Grid>
														<Grid item>
															<Button style={{marginTop: 25}} type='submit' variant='contained' color='secondary'>Set Major</Button>
														</Grid>
													</Grid>
												}
											</form>
										</Paper>
									</Grid>
									<Grid item sx={{flexGrow: 1}}>
										<Paper elevation={20} className={classes.minimalPaperStyle} style={{height: 'calc(100% - 30px)', boxSizing: 'border-box', marginTop: '10px', marginBottom: '10px'}}>
											<Grid
											container
											direction={breakpoint ? 'row' : 'column'}
											sx={{
												...height100Style,
											}}
											>
												<Grid item sx={{
													flexGrow: {
														xs: 1,
														sm: 0,
													},
												}}>
													<Typography className={classes.textStyle}>Your Previous Courses</Typography>
												</Grid>
												<Grid item sx={{flexGrow: 1, position: 'relative'}}>
													{
														loadingCourseHistory ?
														<Grid container justifyContent="center" alignItems="center" sx={{
															...height100Style,
														}}>
															<Grid item>
																<CircularProgress/>
															</Grid>
														</Grid>
														:
														<List sx={{
															position: {
																xs: null,
																sm: 'absolute',
															},
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
													}
												</Grid>
												<Grid item sx={{
													flexGrow: {
														xs: 1,
														sm: 0,
													},
												}}>
													<form onSubmit={handleAddCourse}>
														<Grid container>
															<Grid item sx={{flexGrow: 1, margin: 'auto 10px'}}>
																<Autocomplete className={classes.boxStyle}
																options={courses}
																renderInput={(params) =>
																	<TextField
																	{...params}
																	label="Courses"
																	InputProps={{
																		...params.InputProps,
																		endAdornment: (
																			<>
																				{(loadingCourses && coursesOpen) ? <CircularProgress color="inherit" size={20} /> : null}
																				{params.InputProps.endAdornment}
																			</>
																		),
																	}}
																	/>
																}
																selectOnFocus
																clearOnBlur
																handleHomeEndKeys
																value={(targetCourse) ? targetCourse : null}
																onChange={(e, v) => setTargetCourse(v)}
																onInputChange={(e, v) => setTargetCourse(v)}
																loading={loadingCourses}
																open={coursesOpen}
																onOpen={() => setCoursesOpen(true)}
																onClose={() => setCoursesOpen(false)}
																/>
															</Grid>
															<Grid item sx={{flexGrow: 0}}>
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
							<Grid item sx={{
								flexGrow: 1,
								...height100Style,
								marginRight: 3,
								marginLeft: 3,
							}}>
								<Paper elevation={20} className={classes.minimalPaperStyle} style={{height: 'calc(100% - 40px)', boxSizing: 'border-box'}}>
									<Grid
									container
									direction={breakpoint ? 'row' : 'column'}
									sx={{
										...height100Style,
									}}
									>
										<Grid item sx={{flexGrow: 0}}>
											<Typography className={classes.textStyle}>Suggested plan</Typography>
										</Grid>
										<Grid item sx={{flexGrow: 1, position: 'relative'}}>
											{
												loadingSchedule ?
												<Grid container justifyContent="center" alignItems="center" sx={{
													...height100Style,
												}}>
													<Grid item>
														<CircularProgress/>
													</Grid>
												</Grid>
												:
												<List sx={{
													position: {
														xs: null,
														sm: 'absolute',
													},
													top: 0,
													left: 0,
													right: 0,
													bottom: 0,
													overflow: 'auto',
												}}>
												{schedule.map((v, i) =>
													<ListItem
													key={i}
													>
														<Grid
														container
														direction="column"
														>
															<Grid item>
																<ListItemText primaryTypographyProps={{fontFamily: 'Arvo', fontSize: '30px'}} primary={`Semester ${i + 1}`}/>
															</Grid>
															<Grid item>
																<List>
																{v.map((v2, i2) =>
																	<ListItem key={`${v2}-${i2}`}>
																		<ListItemText primaryTypographyProps={{fontFamily: 'Arvo', fontSize: '15px'}} primary={v2}/>
																	</ListItem>
																)}
																</List>
															</Grid>
														</Grid>
													</ListItem>
												)}
												</List>
											}
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
