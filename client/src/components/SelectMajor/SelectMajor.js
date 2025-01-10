import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    Container, Grid, Typography, Button, Box, Stepper, Step, StepLabel,
    Card, CardContent, Paper, ThemeProvider, createTheme, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0077b6',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#6c757d',
        },
    },
});

const SelectMajor = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [selectedMinor, setSelectedMinor] = useState(null);
    const [item, setItem] = useState([]);
    const { user } = useContext(UserContext);

    const steps = ['Select Major', 'Select Minor', 'Submit'];
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = Cookies.get('userId');
                setUserId(id);
                const response = await axios.get(`http://localhost:5001/api/topmajors/${id}`);
                const formattedData = response.data.map(item => ({
                    ...item,
                    MajorData: JSON.parse(item.OpenAIResponse).Major,
                    MinorData: Object.keys(JSON.parse(item.OpenAIResponse).Minor),
                    MinorDataValue: Object.values(JSON.parse(item.OpenAIResponse).Minor),
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleMajorClick = (major) => {
        setSelectedMajor(major.Major);
        setItem(major);
        setSelectedMinor(null);
        setActiveStep(1);
    };

    const handleMinorClick = (minor) => {
        setSelectedMinor(minor);
        setItem((prevItem) => ({
            ...prevItem,
            MinorSelected: minor,
        }));
        setActiveStep(2);
    };

    const handleSubmit = async () => {
        const payload = {
            selectedMajor: item,
            _id: userId
        };
        try {
            console.log("I send this", payload)
            const response = await axios.post(`http://localhost:5001/api/career-timeline`, payload);
            if (response.status === 200) {
                navigate('/career');
            } else {
                alert("Some error occurred. Please try later.");
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        {data.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.Major}>
                                <Card
                                    onClick={() => handleMajorClick(item)}
                                    sx={{
                                        bgcolor: selectedMajor === item.Major ? theme.palette.primary.main : theme.palette.background.paper,
                                        color: selectedMajor === item.Major ? theme.palette.background.paper : theme.palette.text.primary,
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 4 },
                                        transition: 'background-color 0.3s',
                                        height: '100%',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {item.Major}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.MajorData}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={2}>
                        {item.MinorData?.map((minor, index) => (
                            <Grid item xs={12} sm={6} md={4} key={minor}>
                                <Card
                                    onClick={() => handleMinorClick(minor)}
                                    sx={{
                                        bgcolor: selectedMinor === minor ? theme.palette.primary.main : theme.palette.background.paper,
                                        color: selectedMinor === minor ? theme.palette.background.paper : theme.palette.text.primary,
                                        cursor: 'pointer',
                                        '&:hover': { boxShadow: 4 },
                                        transition: 'background-color 0.3s',
                                        height: '100%',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {minor}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.MinorDataValue[index]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 2:
                return (
                    <Box
                        mt={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        sx={{
                            backgroundColor: '#f0f8ff',
                            padding: '2rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography variant="h4" gutterBottom color="primary" align="center">
                            Your Selection Summary
                        </Typography>
                        <Card sx={{ width: '100%', mb: 3, backgroundColor: '#ffffff' }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" color="primary" display="inline">
                                    Major:
                                </Typography>
                                <Typography variant="h6" display="inline" sx={{ ml: 1 }}>
                                    {selectedMajor}
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="h6" color="primary" display="inline">
                                        Minor:
                                    </Typography>
                                    <Typography variant="h6" display="inline" sx={{ ml: 1 }}>
                                        {selectedMinor}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                            Please review your selections before submitting.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit}
                            disabled={!selectedMinor}
                            sx={{
                                mt: 2,
                                px: 4,
                                py: 1,
                                fontSize: '1.1rem',
                                backgroundColor: '#3bbf5e',
                                '&:hover': {
                                    backgroundColor: '#1b5c2c',
                                    boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            Confirm and Submit
                        </Button>
                    </Box>
                );


            default:
                return null;
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom align="center">
                            {steps[activeStep]}
                        </Typography>
                        {renderStep()}
                    </Box>
                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setActiveStep((prev) => prev - 1)}
                            disabled={activeStep === 0}
                        >
                            Previous
                        </Button>
                        {activeStep < 2 && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setActiveStep((prev) => prev + 1)}
                                disabled={activeStep === 1 && !selectedMinor}
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

export default SelectMajor;