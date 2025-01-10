import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Container, Grid, Typography, Button, Box,
    Stepper, Step, StepLabel, Chip, Paper, ThemeProvider, createTheme
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Sample data
const data = [
    {
        Major: "Computer Science",
        Minor: ["Machine Learning", "Cyber Security"],
        Subjects: ["Mathematics (Algebra, Calculus)", "Computer Programming (Intro to Programming)", "Information Technology", "Physics", "Statistics"],
        Skills: ["Programming Languages (Python, Java)", "Problem-Solving", "Data Analysis", "Critical Thinking", "Attention to Detail"],
        Hobbies: ["Coding Projects", "Gaming", "Robotics", "Participating in Hackathons", "Building Websites"]
    },
    {
        Major: "Finance",
        Minor: ["Risk Management", "Quantitative Finance"],
        Subjects: ["Mathematics (Algebra, Calculus)", "Economics", "Accounting", "Business Studies", "Statistics"],
        Skills: ["Financial Analysis", "Quantitative Skills", "Risk Assessment", "Negotiation", "Attention to Detail"],
        Hobbies: ["Investing in Stocks", "Participating in Finance Clubs", "Reading Financial News", "Personal Budgeting", "Playing Strategy Games"]
    },
    {
        Major: "Marketing",
        Minor: ["Brand Management", "Affiliate Marketing"],
        Subjects: ["Business Studies", "Economics", "Psychology", "English (Composition and Communication)", "Graphic Design"],
        Skills: ["Creativity", "Data Analysis", "Communication", "Social Media Proficiency", "Project Management"],
        Hobbies: ["Blogging or Vlogging", "Social Media Management", "Photography", "Participating in Marketing Competitions", "Creating Digital Art"]
    },
    {
        Major: "Medicine",
        Minor: ["Surgery", "Pediatrics"],
        Subjects: ["Biology", "Chemistry", "Physics", "Health Science", "Mathematics (Statistics)"],
        Skills: ["Diagnostic Skills", "Interpersonal Skills", "Critical Thinking", "Time Management", "Attention to Detail"],
        Hobbies: ["Volunteering at Health Clinics", "Participating in Science Fairs", "Reading Medical Literature", "Shadowing Healthcare Professionals", "Joining HealthRelated Clubs"]
    },
    {
        Major: "Law",
        Minor: ["Litigation", "Contracts"],
        Subjects: ["Government (Civics)", "History (U.S. History or World History)", "English (Writing and Literature)",
            "Economics", "Debate or Public Speaking"],
        Skills: ["Legal Research", "Analytical Thinking", "Negotiation", "Public Speaking", "Writing Skills"],
        Hobbies: ["Participating in Debate Club", "Reading Legal Thrillers", "Volunteering for Advocacy Groups", "Mock Trials", "Engaging in Community Service"]
    }
    // Other data entries...
];

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});


const MajorSelectorCarousel = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [selectedMajors, setSelectedMajors] = useState([]);
    const [selectedMinors, setSelectedMinors] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleMajorSelect = (major) => {
        setSelectedMajors((prev) =>
            prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major]
        );
    };

    const handleMinorSelect = (minor) => {
        setSelectedMinors((prev) =>
            prev.includes(minor) ? prev.filter((m) => m !== minor) : [...prev, minor]
        );
    };

    const toggleSelection = (item, selectedArray, setSelectedArray) => {
        setSelectedArray((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    useEffect(() => {
        const checkUser = async () => {
          try {
            const response = await axios.get('http://localhost:5001/auth/current_user', {
              withCredentials: true, // Include credentials for authentication
            });
            if (response.status === 200) {
              Cookies.set('userId', response.data._id, { expires: 7 });
              setUserId(response.data._id);
            }
          } catch (error) {
            console.error('Failed to retrieve user:', error);
            window.location.href = '/';
          }
        };
    
        checkUser();
      }, []);

    const handleSubmit = async () => {
        const mergedData = {
            Major: selectedMajors,
            Minor: selectedMinors,
            Subjects: [...new Set(selectedSubjects)],
            Skills: [...new Set(selectedSkills)],
            Hobbies: [...new Set(selectedHobbies)],
        };
        
        const payload = {
            _id : userId,
            selectedInfo: mergedData
        }
        console.log("Setup submits", payload)
        try {
            const response = await axios.post('http://localhost:5001/api/career-advice', payload);
            console.log('Response from server:', response.data);
            navigate('/selectMajor');
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const aggregatedSubjects = [...new Set(selectedMajors.flatMap(major => data.find(item => item.Major === major).Subjects))];
    const aggregatedSkills = [...new Set(selectedMajors.flatMap(major => data.find(item => item.Major === major).Skills))];
    const aggregatedHobbies = [...new Set(selectedMajors.flatMap(major => data.find(item => item.Major === major).Hobbies))];

    const totalSlides = 5; // Update this if you add more slides

    const goToNextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const slides = [
        // Slide 1: Select Majors 
        <Box key="majors" sx={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#0077b6', height: '20%', display: 'flex', alignItems: 'center' }}>Select Your Majors</Typography>
            <Grid container spacing={2} justifyContent="center" style={{ height: '80%', overflowY: 'scroll' }}>
                {data.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: selectedMajors.includes(item.Major) ? '#0077b6' : '#ffffff',
                                cursor: 'pointer',
                                '&:hover': { boxShadow: 4 },
                            }}
                            onClick={() => handleMajorSelect(item.Major)}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedMajors.includes(item.Major) ? '#ffffff' : '#333333'}}>
                                    {item.Major}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>,

        // Slide 2: Select Minors
        selectedMajors.length > 0 && (
            <Box key="minors" sx={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#0077b6', height: '20%', display: 'flex', alignItems: 'center' }}>Select Your Minors</Typography>
                <Grid container spacing={2} justifyContent="center" style={{ height: '80%', overflowY: 'scroll' }}>
                    {selectedMajors.flatMap(major => {
                        const majorData = data.find(item => item.Major === major);
                        return majorData ? majorData.Minor : [];
                    }).map((minor, minorIndex) => (
                        <Grid item key={minorIndex} xs={12} sm={6} md={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    bgcolor: selectedMinors.includes(minor) ? '#0077b6' : '#ffffff',
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: 4 },
                                }}
                                onClick={() => handleMinorSelect(minor)}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedMinors.includes(minor) ? '#ffffff' : '#333333' }}>
                                        {minor}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ),

        // Slide 3: Select Subjects
        selectedMajors.length > 0 && (
            <Box key="subjects" sx={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#0077b6', height: '20%', display: 'flex', alignItems: 'center' }}>Select Subjects</Typography>
                <Grid container spacing={2} justifyContent="center" style={{ height: '80%', overflowY: 'scroll' }}>
                    {aggregatedSubjects.map((subject, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    bgcolor: selectedSubjects.includes(subject) ? '#0077b6' : '#ffffff',
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: 4 },
                                }}
                                onClick={() => toggleSelection(subject, selectedSubjects, setSelectedSubjects)}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedSubjects.includes(subject) ? '#ffffff' : '#333333' }}>
                                        {subject}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ),

        // Slide 4: Select Skills
        selectedMajors.length > 0 && (
            <Box key="skills" sx={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#0077b6', height: '20%', display: 'flex', alignItems: 'center' }}>Select Skills</Typography>
                <Grid container spacing={2} justifyContent="center" style={{ height: '80%', overflowY: 'scroll' }}>
                    {aggregatedSkills.map((skill, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    bgcolor: selectedSkills.includes(skill) ? '#0077b6' : '#ffffff',
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: 4 },
                                }}
                                onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedSkills.includes(skill) ? '#ffffff' : '#333333' }}>
                                        {skill}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ),

        // Slide 5: Select Hobbies
        selectedMajors.length > 0 && (
            <Box key="hobbies" sx={{ height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#0077b6', height: '20%', display: 'flex', alignItems: 'center' }}>Select Hobbies</Typography>
                <Grid container spacing={2} justifyContent="center" style={{ height: '80%', overflowY: 'scroll' }}>
                    {aggregatedHobbies.map((hobby, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    bgcolor: selectedHobbies.includes(hobby) ? '#0077b6' : '#ffffff',
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: 4 },
                                }}
                                onClick={() => toggleSelection(hobby, selectedHobbies, setSelectedHobbies)}
                            >
                                <CardContent>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedHobbies.includes(hobby) ? '#ffffff' : '#333333' }}>
                                        {hobby}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        ),

        // Final Slide: Submit Selections
        // selectedMajors.length > 0 && (
        //     <Box key="submit" sx={{ height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: '#f5f7fa' }}>
        //         <Typography variant="h4" gutterBottom sx={{ color: '#0077b6' }}>Your Selections</Typography>
        //         <Grid container justifyContent="center">
        //             <Button variant="contained" sx={{ bgcolor: '#0077b6', color: '#fff' }} onClick={handleSubmit}>
        //                 Submit Selections
        //             </Button>
        //         </Grid>
        //     </Box>
        // ),
    ];

    const steps = ['Select Majors', 'Select Minors', 'Select Subjects', 'Select Skills', 'Select Hobbies'];

    const renderSlide = (index) => {
        switch (index) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        {data.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={item.Major}
                                    onClick={() => handleMajorSelect(item.Major)}
                                    color={selectedMajors.includes(item.Major) ? "primary" : "default"}
                                    variant={selectedMajors.includes(item.Major) ? "filled" : "outlined"}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        {selectedMajors.flatMap(major => {
                            const majorData = data.find(item => item.Major === major);
                            return majorData ? majorData.Minor : [];
                        }).map((minor, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={minor}
                                    onClick={() => handleMinorSelect(minor)}
                                    color={selectedMinors.includes(minor) ? "primary" : "default"}
                                    variant={selectedMinors.includes(minor) ? "filled" : "outlined"}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        {aggregatedSubjects.map((subject, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={subject}
                                    onClick={() => toggleSelection(subject, selectedSubjects, setSelectedSubjects)}
                                    color={selectedSubjects.includes(subject) ? "primary" : "default"}
                                    variant={selectedSubjects.includes(subject) ? "filled" : "outlined"}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        {aggregatedSkills.map((skill, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={skill}
                                    onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                                    color={selectedSkills.includes(skill) ? "primary" : "default"}
                                    variant={selectedSkills.includes(skill) ? "filled" : "outlined"}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={2}>
                        {aggregatedHobbies.map((hobby, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={hobby}
                                    onClick={() => toggleSelection(hobby, selectedHobbies, setSelectedHobbies)}
                                    color={selectedHobbies.includes(hobby) ? "primary" : "default"}
                                    variant={selectedHobbies.includes(hobby) ? "filled" : "outlined"}
                                    style={{ width: '100%', height: '40px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Stepper activeStep={currentIndex} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom align="center">
                            {steps[currentIndex]}
                        </Typography>
                        {renderSlide(currentIndex)}
                    </Box>
                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={goToPrevSlide}
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </Button>
                        {currentIndex === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                                disabled={selectedMajors.length === 0}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={goToNextSlide}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default MajorSelectorCarousel;
