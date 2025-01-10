import React, { useEffect } from 'react';
import StudentMajorGraph from './StudentMajorGraph';
import { Typography } from '@mui/material';

const Admin = () => {

    return (
        <div style={{width:'100%', height:'90%', display:'flex', flexFlow:'column', background:'#f5f7fa'}}>
            <Typography variant="h4" style={{height:'20%', display:'flex', justifyContent:'center', alignItems:'center'}}> Analytics on Student Data</Typography>
            <StudentMajorGraph />
        </div>

    );
};

export default Admin;