import React, { useState } from 'react';
import { Card, CardContent, Typography, Divider, Box, Pagination } from '@mui/material';
import { AccessTime, School, Computer } from '@mui/icons-material'; // Example icons for updates

const updatesData = [
  {
    headline: "New Course in Cloud Infrastructure",
    icon: <School />,
  },
  {
    headline: "Research Paper Published",
    icon: <Computer />,
  },
  {
    headline: "Webinar on System Design",
    icon: <AccessTime />,
  },
  {
    headline: "React Workshop",
    icon: <Computer />,
  },
  {
    headline: "AWS Certification Preparation",
    icon: <School />,
  },
  {
    headline: "AI Seminar Announced",
    icon: <AccessTime />,
  },
  {
    headline: "New Internship Opportunities",
    icon: <Computer />,
  },
  {
    headline: "Data Science Course Released",
    icon: <School />,
  },
  {
    headline: "Updates on Cloud Security",
    icon: <AccessTime />,
  },
];

export function UpdatesCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentUpdates = updatesData.slice(startIdx, endIdx);

  return (
    <Card sx={{ bgcolor: '#fffcfc', flex: 1, maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 0 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Updates</Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {currentUpdates.map((update, idx) => (
            <div key={idx}>
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Box sx={{ mr: 2 }}>
                  {update.icon}
                </Box>
                <Typography variant="body1">
                  {update.headline}
                </Typography>
              </Box>
              {/* Only add a divider if it's not the last item on the page */}
              {idx < currentUpdates.length - 1 && (
                <Divider sx={{ my: 1, backgroundColor: 'black', height: '2px' }} />
              )}
            </div>
          ))}
        </Box>
      </CardContent>

      {/* Pagination Control with Bottom Padding */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 5 }}> {/* Adjusted padding bottom */}
        <Pagination 
          count={Math.ceil(updatesData.length / itemsPerPage)} 
          variant="outlined" 
          color="primary" 
          page={currentPage}
          onChange={handlePageChange} 
        />
      </Box>
    </Card>
  );
}
