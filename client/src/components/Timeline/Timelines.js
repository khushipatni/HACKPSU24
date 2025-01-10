import React, { useEffect, useState } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

import Pagination from '@mui/material/Pagination';

import AcUnitIcon from '@mui/icons-material/AcUnit';
import ForestIcon from '@mui/icons-material/WbSunnyTwoTone';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const timelineData = {
    "industry": "{\n  \"Year 1\": {\n    \"January\": {\n      \"Courses\": [\n        \"FIN 301 - Corporate Finance\",\n        \"RISK 301 - Risk Management & Insurance\",\n        \"FIN 320 - Investment Theory & Practice\"\n      ],\n      \"Activities\": [\"Apply for Summer Internship\", \"Join Finance Club\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Attend Resume Writing Workshop\", \"Meet with Career Advisor\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Prepare for Midterms\", \"Research Finance Industry Trends\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Attend Finance Networking Event\", \"Finalize Resume\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Submit Summer Internship Applications\", \"Participate in Mock Interviews\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Start Summer Internship\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Gain Experience in Summer Internship\"]\n    },\n    \"August\": {\n      \"Courses\": [\n        \"FIN 431 - International Corporate Finance\",\n        \"RISK 411 - Enterprise Risk Management\",\n        \"FIN 405 - Derivatives & Financial Markets\"\n      ],\n      \"Activities\": [\"Update LinkedIn Profile\", \"Attend Job Fair\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Network with Finance Professionals\", \"Research Potential Employers\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Fall Internships\", \"Prepare for Interviews\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Attend Finance Conference\", \"Connect with Alumni\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Reflect on Semester Performance\", \"Prepare Career Goals for Next Year\"]\n    }\n  },\n  \"Year 2\": {\n    \"January\": {\n      \"Courses\": [\n        \"FIN 412 - Fixed Income Analysis\",\n        \"RISK 402 - Quantitative Finance & Risk Analysis\",\n        \"FIN 445 - Mergers & Acquisitions\"\n      ],\n      \"Activities\": [\"Apply for Spring Internships\", \"Join Professional Finance Association\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Meet with Industry Mentors\", \"Attend Financial Modeling Workshop\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Prepare for Internship Interviews\", \"Research Industry Certifications\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Attend Finance Career Fair\", \"Update Portfolio Projects\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Secure Spring Internship\", \"Participate in Case Competitions\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Start Spring Internship\", \"Explore Summer Study Abroad Programs\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Gain Experience in Spring Internship\"]\n    },\n    \"August\": {\n      \"Courses\": [\n        \"FIN 445 - Portfolio Management\",\n        \"RISK 425 - Strategic Risk Management\",\n        \"FIN 429 - Financial Modeling\"\n      ],\n      \"Activities\": [\"Enhance Technical Skills\", \"Attend Job Search Strategies Workshop\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Network with Recruiters\", \"Attend Finance Conferences\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Summer Internships\", \"Prepare for Career Fair\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Engage in Industry Projects\", \"Connect with Industry Leaders\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Reflect on Yearly Accomplishments\", \"Set Career Milestones for Next Year\"]\n    }\n  },\n  \"Year 3\": {\n    \"January\": {\n      \"Courses\": [\n        \"FIN 471 - Real Estate Finance\",\n        \"RISK 419 - Cyber Risk Management\",\n        \"FIN 465 - Financial Statement Analysis\"\n      ],\n      \"Activities\": [\"Apply for Summer Analyst Programs\", \"Engage in Research Projects\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Attend Financial Planning Seminar\", \"Join Professional Development Workshops\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Prepare for Technical Interviews\", \"Attend Industry Speaker Series\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Network with Recruiters\", \"Update Professional Resume\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Secure Summer Analyst Position\", \"Participate in Case Study Competitions\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Start Summer Analyst Program\", \"Enhance Presentation Skills\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Gain Experience in Summer Analyst Role\", \"Contribute to Projects\"]\n    },\n    \"August\": {\n      \"Courses\": [\n        \"FIN 442 - Wealth Management\",\n        \"RISK 450 - Operational Risk Management\",\n        \"FIN 490 - Financial Ethics & Regulations\"\n      ],\n      \"Activities\": [\"Pursue Industry Certifications\", \"Attend Job Search Bootcamp\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Network with Industry Professionals\", \"Reflect on Career Goals\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Fall Analyst Programs\", \"Prepare for Grad School Applications\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Attend Finance Symposium\", \"Connect with Alumni Networks\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Evaluate Yearly Progress\", \"Set Long-term Career Objectives\"]\n    }\n  },\n  \"Year 4\": {\n    \"January\": {\n      \"Courses\": [\n        \"FIN 408 - Advanced Financial Management\",\n        \"RISK 485 - Crisis Management & Business Continuity\",\n        \"FIN 455 - Global Markets & Institutions\"\n      ],\n      \"Activities\": [\"Apply for Full-time Positions\", \"Join Executive Mentorship Program\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Prepare for Behavioral Interviews\", \"Participate in Mock Assessment Centers\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Research Potential Employers\", \"Attend Career Transition Workshops\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Network at Industry Events\", \"Finalize Job Applications\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Secure Full-time Job Offer\", \"Prepare for Graduation\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Complete Final Projects\", \"Apply for Professional Memberships\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Transition into Full-time Role\", \"Continue Professional Development\"]\n    },\n    \"August\": {\n      \"Courses\": [\n        \"FIN 495 - Case Studies in Finance\",\n        \"RISK 497 - Advanced Risk Management Seminar\"\n      ],\n      \"Activities\": [\"Reflect on Academic Journey\", \"Help Incoming Students with Career Advice\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Attend Industry Conferences\", \"Evaluate Career Progress\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Engage in Alumni Networking\", \"Set Future Career Goals\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Celebrate Career Milestones\", \"Plan for Continued Education or Certifications\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Graduate with Finance and Risk Management degrees\", \"Begin Professional Career\"]\n    }\n  }\n}",
    "research": "{\n  \"Year 1\": {\n    \"January\": {\n      \"Courses\": [\"FIN 100: Introduction to Finance\", \"R M 100: Introduction to Risk Management\"],\n      \"Activities\": [\"Join Finance and Risk Management Society\", \"Attend Career Fair\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Meet with Academic Advisor for Course Planning\", \"Attend Resume Building Workshop\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Participate in Mock Interview Sessions\", \"Prepare for Midterm Exams\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Attend Networking Event with Finance Professionals\", \"Refine Resume and Cover Letter\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Finalize Summer Internship Applications\", \"Prepare for Finals\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Start Summer Internship in Finance\", \"Attend Industry Seminars/Webinars\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Gain Hands-on Experience in Financial Analysis\", \"Network with Colleagues and Supervisors\"]\n    },\n    \"August\": {\n      \"Courses\": [\"FIN 300: Corporate Finance\", \"R M 200: Enterprise Risk Management\"],\n      \"Activities\": [\"Update LinkedIn Profile\", \"Attend Finance Career Development Workshop\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Explore Research Opportunities in Finance\", \"Attend Finance Industry Panel Discussion\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Research Assistant Positions\", \"Participate in Quantitative Analysis Workshop\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Attend Graduate School Info Session for Finance Programs\", \"Research Potential Research Topics\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Reflect on Academic Progress\", \"Prepare for End-of-Year Exams\"]\n    }\n  },\n  \"Year 2\": {\n    \"January\": {\n      \"Courses\": [\"FIN 400: Financial Markets and Institutions\", \"R M 300: Insurance and Internal Risk Management\"],\n      \"Activities\": [\"Engage in Research Projects\", \"Attend Finance Guest Speaker Events\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Meet with Faculty for Research Guidance\", \"Participate in Data Analysis Workshop\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Present Research Findings at Student Conference\", \"Prepare for Midterm Exams\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Interact with Alumni in Finance Field\", \"Start Drafting Research Paper\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Apply for Summer Research Opportunities\", \"Prepare for Finals\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Begin Summer Research Project\", \"Attend Academic Conferences\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Continue Data Analysis for Research\", \"Seek Mentorship in Finance\"]\n    },\n    \"August\": {\n      \"Courses\": [\"FIN 450: Investment Analysis\", \"R M 400: Enterprise Risk Management Simulation\"],\n      \"Activities\": [\"Update Research Portfolio\", \"Connect with Industry Professionals on LinkedIn\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Work on Research Proposal for Graduate Studies\", \"Attend Research Methodology Seminar\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Research Grants\", \"Participate in Finance Case Competitions\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Attend Academic Writing Workshop\", \"Start Preparing for Graduate School Applications\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Review Semester Achievements\", \"Request Letters of Recommendation for Grad School\"]\n    }\n  },\n  \"Year 3\": {\n    \"January\": {\n      \"Courses\": [\"FIN 470: Applied Portfolio Management\", \"R M 450: Cyber Risk Management\"],\n      \"Activities\": [\"Join Graduate School Interest Group\", \"Attend Finance Industry Summit\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Meet with Graduate Program Advisors\", \"Participate in Mock Interviews for PhD Programs\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Present Research at Academic Symposium/Conference\", \"Prepare for Midterm Exams\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Engage in Peer Review for Research Publications\", \"Refine Research Methods\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Apply for Summer Research Grants\", \"Prepare for Finals\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Commence Summer Research Project\", \"Attend Research Networking Events\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Analyze Research Data collected\", \"Seek Publication Opportunities\"]\n    },\n    \"August\": {\n      \"Courses\": [\"FIN 500: Financial Derivatives\", \"R M 500: Applied Risk Modeling\"],\n      \"Activities\": [\"Update Academic CV and Portfolio\", \"Participate in Research Paper Competitions\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Research Potential Dissertation Topics\", \"Participate in Research Ethics Training\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Apply for Research Fellowships\", \"Attend Finance Doctoral Program Info Sessions\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Start Working on Doctoral Program Applications\", \"Reach out to Potential PhD Advisors\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Reflect on Academic Progress\", \"Prepare for Comprehensive Exams\"]\n    }\n  },\n  \"Year 4\": {\n    \"January\": {\n      \"Courses\": [\"FIN 550: Advanced Corporate Finance\", \"R M 550: Strategic Risk Management\"],\n      \"Activities\": [\"Engage in PhD Research Seminars\", \"Attend International Academic Conferences\"]\n    },\n    \"February\": {\n      \"Activities\": [\"Meet with Thesis Committee Members\", \"Present Research Proposals for Dissertation\"]\n    },\n    \"March\": {\n      \"Activities\": [\"Research and Write Dissertation Chapters\", \"Prepare for PhD Qualifying Exams\"]\n    },\n    \"April\": {\n      \"Activities\": [\"Attend Research Workshops for Doctoral Students\", \"Revise Dissertation based on Feedback\"]\n    },\n    \"May\": {\n      \"Activities\": [\"Prepare for Doctoral Candidacy Exam\", \"Apply for Teaching Assistant Positions\"]\n    },\n    \"June\": {\n      \"Activities\": [\"Continue Dissertation Writing\", \"Attend Doctoral Research Colloquiums\"]\n    },\n    \"July\": {\n      \"Activities\": [\"Analyze Dissertation Data\", \"Submit Research Articles for Publication\"]\n    },\n    \"August\": {\n      \"Courses\": [\"FIN 600: Financial Engineering\", \"R M 600: Advanced Risk Analytics\"],\n      \"Activities\": [\"Prepare for Dissertation Defense\", \"Network with Postdoctoral Researchers\"]\n    },\n    \"September\": {\n      \"Activities\": [\"Finalize Dissertation, Defense Preparation\", \"Attend Academic Job Market Workshops\"]\n    },\n    \"October\": {\n      \"Activities\": [\"Defend Dissertation\", \"Begin Job Search for Postdoc or Academic Positions\"]\n    },\n    \"November\": {\n      \"Activities\": [\"Complete PhD Graduation Formalities\", \"Apply for Academic Research Grants\"]\n    },\n    \"December\": {\n      \"Activities\": [\"Plan Postdoctoral Research Projects\", \"Reflect on PhD Journey\"]\n    }\n  }\n}"
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Timelines = ({ type }) => {
    const data = JSON.parse(timelineData[type]);
    const [currentYear, setCurrentYear] = useState(1);
    const [page, setPage] = React.useState(1);

    const [startMonthIndex, setStartMonthIndex] = useState(0);
    const [endMonthIndex, setEndMonthIndex] = useState(4);
    const [monthsData, setMonthsData] = useState([]);

    useEffect(() => {
        setMonthsData(getMonthsData(currentYear))
    },[])
    const getMonthsData = (year) => {
        return monthNames.map(month => ({
            name: month,
            data: data[`Year ${year}`]?.[month] || {}
        }));
    };

    const handleChange = (event, value) => {
        setPage(value);
        setStartMonthIndex((4*(value-1))%12)
        setEndMonthIndex((4*(value))%12 === 0 ? 12 : (4*(value))%12)
        setCurrentYear(Math.ceil(value/4.0))
        setMonthsData(getMonthsData(Math.ceil(value/4.0)))
        console.log(Math.ceil(value/4.0))
        console.log(value)
    };

    return (
        <div style={{ background: '#f5f7fa',display:'flex', height:'90%', width:'100%', alignItems:'center', justifyContent: 'center', flexFlow:'column'}}>
            <Typography variant="h4" color="textPrimary" style={{FontFace: 'bold'}}>
                        Year {currentYear} : {type.charAt(0).toUpperCase() + type.slice(1)} Track
                </Typography>
        
            <Timeline position="alternate" style={{display:'flex', height:'80%', width:'100%',  alignItems:'center', justifyContent: 'center'}}>
        {monthsData.slice(startMonthIndex, endMonthIndex).map((month, index) => (
            <TimelineItem key={index} style={{height:'25%', width:'100%'}}>
                <TimelineOppositeContent style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Typography variant="h4" color="textSecondary">
                        {month.name}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineConnector />
                    
                        {index + startMonthIndex < 2 ? <TimelineDot style={{background:'#ADD8E6'}}><AcUnitIcon /></TimelineDot> : index + startMonthIndex < 5 ? <TimelineDot style={{background:'#90EE90'}}><LocalFloristIcon /></TimelineDot> : index + startMonthIndex < 8 ? <TimelineDot style={{background:'#8B8000'}}><ForestIcon /></TimelineDot> : index + startMonthIndex < 11 ?<TimelineDot style={{background:'#e09f3e'}}><EnergySavingsLeafIcon /></TimelineDot> : <TimelineDot style={{background:'#ADD8E6'}}><AcUnitIcon /></TimelineDot>}
                    
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Typography>{month.data.Courses && month.data.Courses.length > 0 && (
                                        <>
                                            <Typography variant="h6" style={{overflowY:'scroll'}}>Courses</Typography>
                                                {month.data.Courses.map((course, i) => (
                                                    <span key={i}>{course}{i === month.data.Courses.length - 1? '' : ', ' }</span>
                                                ))}
                                        </>
                                    )}
                                    {month.data.Activities && month.data.Activities.length > 0 && (
                                        <>
                                            <Typography variant="h6" style={{overflowY:'scroll'}}>Activities</Typography>
                                                {month.data.Activities.map((activity, i) => (
                                                    <span key={i}>{activity}{i === month.data.Activities.length - 1? '' : ', ' }</span>
                                                ))}
                                        </>
                                    )}
        </Typography>
                </TimelineContent>
            </TimelineItem>
        ))}
    </Timeline>
    <Pagination count={16} page={page} onChange={handleChange}/>
    </div>
    );
};

export default Timelines;
