import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Chip, Divider, Button } from '@mui/material';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { ProfileCarousel } from './ProfileCarousel';
import { UpdatesCard } from './UpdatesCard';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Career = () => {
  const [selectedMajorData, setSelectedMajorData] = useState(null);
  const navigate = useNavigate();

  const pageBgColor = '#f5f7fa'; // Light gray-blue for the page background
  const cardBgColor = '#ffffff'; // White for the cards
  const primaryAccentColor = '#0077b6'; // Blue for key elements
  const secondaryAccentColor = '#ff6b6b'; // Red for highlights
  const textColor = '#333333'; // Dark gray for primary text
  const mutedTextColor = '#6c757d'; // Muted gray for secondary text

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('http://localhost:5001/auth/current_user', {
          withCredentials: true,
        });
        if (response.status === 200) {
          Cookies.set('userId', response.data._id, { expires: 7 });
          checkselectedmajors();
        }
      } catch (error) {
        console.error('Failed to retrieve user:', error);
        window.location.href = '/';
      }
    };

    checkUser();
  }, []);

  // Fetch selected major and parse data
  const checkselectedmajors = async () => {
    try {
      const userId = Cookies.get('userId'); // Get user ID from cookies
      const response = await axios.get(`http://localhost:5001/api/selectedmajors/${userId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log(response);
        setSelectedMajorData(response.data); // Set the selected major data
        
      }
    } catch (error) {
      console.error('Failed to retrieve selected majors:', error);
    }
  };

  const data = {
    major: selectedMajorData ? selectedMajorData.Major : "Loading...",
    minor: selectedMajorData && selectedMajorData.Minor.length > 0 ? selectedMajorData.Minor.join(", ") : "Loading...",
    skills: selectedMajorData ? selectedMajorData.SkillsToImprove : [],
  };

  // Timeline status
  const progress = 15; // Hardcoded for now
  const isOnTrack = true; // Hardcoded for now

  return (
    <Box
      sx={{
        p: 3,
        width:'100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        bgcolor: pageBgColor,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          alignSelf: 'flex-start',
          mb: 2,
          pl: 3,
          width:'100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
          color: primaryAccentColor,
        }}
      >
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, alignItems: 'center' }}>
          {['Major', 'Minor'].map((title, idx) => (
            <Card
              key={idx}
              sx={{
                bgcolor: cardBgColor,
                width: 300,
                height: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 1,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: textColor }}>
                  {title}
                </Typography>
                <Typography variant="h5" sx={{ color: mutedTextColor }} noWrap={false}>
                  {title === 'Major' ? data.major : data.minor}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Skills card */}
        <Card sx={{ flex: 1, bgcolor: cardBgColor }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: textColor }}>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {data.skills.map((skill, idx) => (
                <Chip
                  key={idx}
                  label={skill}
                  sx={{
                    bgcolor: primaryAccentColor,
                    color: '#fff',
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card sx={{ flex: 1, bgcolor: cardBgColor }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: textColor }}>Timeline</Typography>
            <Box sx={{ mt: 2 }}>
              <ProgressBar
                animated
                now={progress}
                style={{ height: '20px' }}
                variant={isOnTrack ? "success" : "danger"}
              />
            </Box>
            <Typography
              sx={{
                mt: 2,
                color: isOnTrack ? 'green' : secondaryAccentColor,
                fontWeight: 'bold',
              }}
            >
              {isOnTrack ? 'On Track' : 'Delayed'}
            </Typography>
            {/* Academia Track */}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              
            >
              <Typography 
                variant="body1" 
                component="a" 
                href="/timeline/research" 
                sx={{ textDecoration: 'none', color: primaryAccentColor }} // Use primary accent color
              >
                Academia Track
              </Typography>
              <Box
                sx={{
                  bgcolor: 'white',
                  color: 'green',
                  borderRadius: '15px',
                  padding: '5px 10px',
                  textAlign: 'center',
                  border: '1px solid green',
                }}
                onClick = {() => {navigate('/timeline/research')}}
              >
                Pursuing
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Industry Track */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography 
                variant="body1" 
                component="a" 
                href="/timeline/industry" 
                sx={{ textDecoration: 'none', color: primaryAccentColor }} // Use primary accent color
              >
                Industry Track
              </Typography>
              <Box
                sx={{
                  bgcolor: 'white',
                  color: secondaryAccentColor,
                  borderRadius: '15px',
                  padding: '5px 10px',
                  textAlign: 'center',
                  border: `1px solid ${secondaryAccentColor}`,
                }}

                onClick = {() => {navigate('/timeline/industry')}}
              >
                Backup
              </Box>
            </Box>
            {/* Help Button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<QuestionAnswerIcon />}
                sx={{
                  borderColor: 'black',
                  color: 'black',
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => { navigate('/chat') }}
              >
                MORE HELP
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Updates Card */}
        <Card sx={{ flex: 1, bgcolor: cardBgColor }}>
          <UpdatesCard />
        </Card>
      </Box>

      {/* Profile Carousel */}
      <ProfileCarousel />
    </Box>
  );
};

export default Career;
