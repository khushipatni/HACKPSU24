// ProfileCarousel.js
import React, { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ProfileCard } from './ProfileCard'; // Use named export
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function ProfileCarousel() {
  const carouselRef = useRef(null);

  const profiles = [
    {
      name: 'Natalie Paisley',
      title: 'CEO / Co-Founder',
      imgSrc: 'https://docs.material-tailwind.com/img/team-3.jpg',
    },
    {
      name: 'John Doe',
      title: 'Software Engineer',
      imgSrc: 'https://docs.material-tailwind.com/img/team-2.jpg',
    },
    {
      name: 'Jane Smith',
      title: 'Product Manager',
      imgSrc: 'https://docs.material-tailwind.com/img/team-4.jpg',
    },
    {
      name: 'Emily Johnson',
      title: 'UX Designer',
      imgSrc: 'https://docs.material-tailwind.com/img/team-1.jpg',
    },
    {
      name: 'Michael Brown',
      title: 'Data Scientist',
      imgSrc: 'https://docs.material-tailwind.com/img/team-5.jpg',
    },
    {
      name: 'Sarah Green',
      title: 'DevOps Engineer',
      imgSrc: 'https://docs.material-tailwind.com/img/team-6.jpg',
    },
    {
      name: 'Chris Evans',
      title: 'Cloud Architect',
      imgSrc: 'https://docs.material-tailwind.com/img/team-1.jpg',
    },
    {
      name: 'Alex Wilson',
      title: 'Mobile Developer',
      imgSrc: 'https://docs.material-tailwind.com/img/team-2.jpg',
    },
  ];

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <Box sx={{ width: '100%', padding: '20px 0', position: 'relative' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 1 }}>
        People to Connect
      </Typography>

      {/* Left Arrow */}
      <IconButton
        sx={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
        onClick={scrollLeft}
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* Carousel Container */}
      <Box
        ref={carouselRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          gap: 1,
          whiteSpace: 'nowrap',
          height: '350px', // Set a fixed height for the carousel
          padding: '0 50px', // Optional: Padding to give space on sides
          '&::-webkit-scrollbar': { display: 'none' }, // Optional: Hide scrollbar
        }}
      >
        {profiles.sort(function(){ return 0.5 - Math.random() }).slice(0,5).map((profile, index) => (
          <Box key={index} sx={{ minWidth: 300 }}>
            <ProfileCard {...profile} />
          </Box>
        ))}
      </Box>

      {/* Right Arrow */}
      <IconButton
        sx={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
        onClick={scrollRight}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}
