import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Paper from '@mui/material/Paper';



import { Button, Card, CardContent, Container, Typography, Box, Stack } from '@mui/material';

const StudentMajorGraph = () => {
    const [chartData, setChartData] = useState({});
    const [salaryData, setSalaryData] = useState([]);
    const [academiaJobData, setAcademiaJobData] = useState([]);
    const [dropoutData, setDropoutData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentChartIndex, setCurrentChartIndex] = useState(0);

    const charts = [
        {
            title: "Number of Students per Major",
            component: (
                <LineChart
                    xAxis={chartData.xAxis}
                    series={chartData.series}
                    height={400}
                />
            ),
        },
        {
            title: "Average Salary per Major",
            component: (
                <BarChart
                    dataset={salaryData}
                    xAxis={[{ scaleType: 'band', dataKey: 'major' }]}
                    series={[{ dataKey: 'salary', label: 'Average Salary' }]}
                    height={400}
                    
                />
            ),
        },
        {
            title: "Academia vs Job for Each Major for Year 2024",
            component: (
                <BarChart
                    dataset={academiaJobData}
                    xAxis={[{ scaleType: 'band', dataKey: 'major' }]}
                    series={[
                        { dataKey: 'academia', label: 'Academia (%)', color: 'blue' },
                        { dataKey: 'job', label: 'Job (%)', color: 'orange' },
                    ]}
                    height={400}
                />
            ),
        },
        {
            title: "Dropout Rate per Major",
            component: (
                <BarChart
                    dataset={dropoutData}
                    xAxis={[{ scaleType: 'band', dataKey: 'major' }]}
                    series={[{ dataKey: 'dropoutRate', label: 'Dropout Rate (%)', color: 'red' }]}
                    height={400}
                />
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/students-per-major');
                const { years, subjects } = response.data;

                const labels = years.map(year => year.toString());
                const series = Object.keys(subjects).map((subject, index) => ({
                    label: subject,
                    data: subjects[subject],
                    color: `hsl(${index * 60}, 70%, 50%)`,
                }));

                setChartData({ xAxis: [{ data: labels, scaleType: 'band' }], series });

                const salaryResponse = await axios.get('http://localhost:5001/api/average-salary');
                const salariesData = salaryResponse.data;

                const barData = Object.keys(salariesData).map((major) => ({
                    major,
                    salary: salariesData[major],
                }));

                setSalaryData(barData);

                const academiaJobResponse = await axios.get('http://localhost:5001/api/academia-vs-job');
                const academiaJobStats = academiaJobResponse.data;

                const academiaJobData = Object.keys(academiaJobStats).map((major) => ({
                    major,
                    academia: academiaJobStats[major].academia,
                    job: academiaJobStats[major].job,
                }));

                setAcademiaJobData(academiaJobData);

                // Fetch dropout data
                const dropoutResponse = await axios.get('http://localhost:5001/api/dropout-rate');
                const dropoutStats = dropoutResponse.data;
                console.log("DROPUT", dropoutStats)
                const dropoutData = Object.keys(dropoutStats).map((major) => ({
                    major,
                    dropoutRate: dropoutStats[major],
                }));

                setDropoutData(dropoutData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    

    const handleNext = () => {
        setCurrentChartIndex((prevIndex) => (prevIndex + 1) % charts.length);
    };

    const handlePrev = () => {
        setCurrentChartIndex((prevIndex) =>
            prevIndex === 0 ? charts.length - 1 : prevIndex - 1
        );
    };

    return (
        <Container style={{width: '100%', height:'70%', display:'flex', justifyContent:'center', alignItems:'center', background: '#f5f7fa'}}>
            {loading ? <Spinner animation="grow" >
                <span className="visually-hidden">Analyzing...</span>
                </Spinner> : <Card variant="outlined" style={{  width: '100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center' }}>
                <Paper square={false} variant="outlined" style={{ border:'black',display: 'flex', width: '100%', height:'100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button onClick={handlePrev} variant="contained" color="dark" style={{ width:"auto" }}>
                        {'<'}
                    </Button>
                    <div style={{ flexGrow: 1, textAlign: 'center', width:"80%", height:'90%' }}>
                        <Typography variant="h5" gutterBottom>
                            {charts[currentChartIndex].title}
                        </Typography>
                        <div style={{ height: '500px', width: '100%' }}>
                            {charts[currentChartIndex].component}
                        </div>
                    </div>
                    <Button onClick={handleNext} variant="contained" color="dark"  style={{ width:"auto" }}>
                        {'>'}
                    </Button>
                </Paper>
            </Card>}
        </Container>
    );
};

export default StudentMajorGraph;
