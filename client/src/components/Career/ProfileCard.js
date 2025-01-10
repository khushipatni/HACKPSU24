import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export function ProfileCard({ name, title, imgSrc }) {
  const calendlyLink = 'https://calendly.com/rohitchauhanwork/30min'; // Replace with your Calendly link

  return (
    <Card sx={{ maxWidth: 345, margin: 2, bgcolor: '#fffcfc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '30px auto 0 auto',
        }}
      >
        <img
          src={imgSrc}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <CardContent sx={{ textAlign: 'center' }}> {/* Center the text */}
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
      {/* Schedule a meet button */}
      <Button
        variant="contained"
        color="primary"
        href={calendlyLink}
        target="_blank" // Opens Calendly in a new tab
        sx={{ mt: 2, mb: 2 }}
      >
        Schedule a meet
      </Button>
    </Card>
  );
}
