const express = require("express");
const session = require("express-session");
const axios = require("axios");
const app = express();
const cors = require("cors");
const PORT = 5001;
require("dotenv").config();

const { DBSQLClient } = require("@databricks/sql");

const uniData = [
  {
    "Major": "Computer Science",
    "Minor": [
      "Machine Learning",
      "Cyber Security",
    ],
    "Subjects": [
      "Mathematics (Algebra, Calculus)",
      "Computer Programming (Intro to Programming)",
      "Information Technology",
      "Physics",
      "Statistics",
    ],
    "Skills": [
      "Programming Languages (Python, Java)",
      "Problem-Solving",
      "Data Analysis",
      "Critical Thinking",
      "Attention to Detail",
    ],
    "Hobbies": [
      "Coding Projects",
      "Gaming",
      "Robotics",
      "Participating in Hackathons",
      "Building Websites",
    ],
    "URL":
      "https://bulletins.psu.edu/university-course-descriptions/undergraduate/cmpsc/",
  },
  {
    "Major": "Finance",
    "Minor": [
      "Risk Management",
      "Quantitative Finance",
    ],
    "Subjects": [
      "Mathematics (Algebra, Calculus)",
      "Economics",
      "Accounting",
      "Business Studies",
      "Statistics",
    ],
    "Skills": [
      "Financial Analysis",
      "Quantitative Skills",
      "Risk Assessment",
      "Negotiation",
      "Attention to Detail",
    ],
    "Hobbies": [
      "Investing in Stocks",
      "Participating in Finance Clubs",
      "Reading Financial News",
      "Personal Budgeting",
      "Playing Strategy Games",
    ],
    "URL":
      "https://bulletins.psu.edu/university-course-descriptions/undergraduate/fin/",
  },
  {
    "Major": "Marketing",
    "Minor": [
      "Brand Management",
      "Affiliate Marketing",
    ],
    "Subjects": [
      "Business Studies",
      "Economics",
      "Psychology",
      "English (Composition and Communication)",
      "Graphic Design",
    ],
    "Skills": [
      "Creativity",
      "Data Analysis",
      "Communication",
      "Social Media Proficiency",
      "Project Management",
    ],
    "Hobbies": [
      "Blogging or Vlogging",
      "Social Media Management",
      "Photography",
      "Participating in Marketing Competitions",
      "Creating Digital Art",
    ],
    "URL":
      "https://bulletins.psu.edu/university-course-descriptions/undergraduate/mktg/",
  },
  {
    "Major": "Medicine",
    "Minor": [
      "Surgery",
      "Pediatrics",
    ],
    "Subjects": [
      "Biology",
      "Chemistry",
      "Physics",
      "Health Science",
      "Mathematics (Statistics)",
    ],
    "Skills": [
      "Diagnostic Skills",
      "Interpersonal Skills",
      "Critical Thinking",
      "Time Management",
      "Attention to Detail",
    ],
    "Hobbies": [
      "Volunteering at Health Clinics",
      "Participating in Science Fairs",
      "Reading Medical Literature",
      "Shadowing Healthcare Professionals",
      "Joining Health-Related Clubs",
    ],
    "URL":
      "https://bulletins.psu.edu/university-course-descriptions/undergraduate/nurs/",
  },
  {
    "Major": "Law",
    "Minor": [
      "Litigation",
      "Contracts",
    ],
    "Subjects": [
      "Government (Civics)",
      "History (U.S. History or World History)",
      "English (Writing and Literature)",
      "Economics",
      "Debate or Public Speaking",
    ],
    "Skills": [
      "Legal Research",
      "Analytical Thinking",
      "Negotiation",
      "Public Speaking",
      "Writing Skills",
    ],
    "Hobbies": [
      "Participating in Debate Club",
      "Reading Legal Thrillers",
      "Volunteering for Advocacy Groups",
      "Mock Trials",
      "Engaging in Community Service",
    ],
    "URL":
      "https://bulletins.psu.edu/university-course-descriptions/undergraduate/blaw/",
  },
];

app.use(cors({
  origin: "http://localhost:3000", // Specify the frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

//Mongo Connection using mongoose
require("./schemas/User");
const mongoose = require("mongoose");
mongoose.connect(process.env.ATLAS_URI)
  .then(function () {
    console.log("Conneted to MongoDB database");
  }).catch(function (err) {
    console.log(err);
  });
////////////////////////////////
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    maxAge: 30 * 24 * 3600 * 1000, //30 days life
    keys: ["key1", "key2"],
  }),
);

const passport = require("passport");
require("./utils/passport");
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth");
authRoutes(app);

const db = require("./routes/db");
db(app);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

async function getOpenAIResponse(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a career advisor assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.choices[0].message.content; // Return the content from the response
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to generate response from OpenAI");
  }
}

const User = mongoose.model("users");

app.post("/api/chat", async (req, res) => {
  const { query, id } = req.body;
  console.log(query)
  try {
    const existingUser = await User.findOne({ _id: id });

    if (existingUser) {
      if (
        Array.isArray(existingUser.topMajors) &&
        existingUser.topMajors.length > 0
      ) {
        const major_info = uniData.find((major) => major.Major === existingUser.selectedMajor.Major);
        const result = `The student's is majoring in ${
          existingUser.selectedMajor.Major
        } and minor in ${
          existingUser.selectedMajor.Minor[0]
        }, help an undergraduate with their query. The courses offered in their major can be found out at ${major_info.URL}. Refrain from answering questions that aren't career/academic oriented. The prompt is ${query}. Keep it at a text conversation level and interactive. Previous context is ${req.allMessages}`;
        const response = await getOpenAIResponse(result);
        return res.json({ response:  response, prev: query  + response});
      } else {
        // Handle case where topMajors is empty or undefined
        console.log(
          "topMajors is either undefined or empty:",
          existingUser.topMajors,
        );
        return res.status(400).json({ error: "User has no topMajors data." });
      }
    } else {
      // If the user is not found
      console.log("User not found for ID:", id);
      return res.status(400).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error while fetching user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/career-advice", async (req, res) => {
  try {
    console.log(req.body);
    const studentProfile = req.body.selectedInfo; // Extracting student profile from request body
    const userId = req.body._id; // Extracting student profile from request body
    if (
      !studentProfile || !studentProfile.Major || !studentProfile.Minor ||
      !studentProfile.Subjects || !studentProfile.Skills ||
      !studentProfile.Hobbies
    ) {
      return res.status(400).json({
        error: "Student profile data is incomplete",
      });
    }

    // Function to score majors based on student's profile
    const scoreMajors = (majorData, studentProfile) => {
      let score = 0;

      // console.log(`Scoring major: ${majorData.Major}`);

      if (studentProfile.Major.includes(majorData.Major)) {
        score += 10;
        // console.log(`Major match found: ${majorData.Major}, Score: ${score}`);
      }

      majorData.Minor.forEach((minor) => {
        if (studentProfile.Minor.includes(minor)) {
          score += 5;
          // console.log(`Minor match found: ${minor}, Score: ${score}`);
        }
      });
      majorData.Subjects.forEach((subject) => {
        if (studentProfile.Subjects.includes(subject)) {
          score += 2;
          // console.log(`Subject match found: ${subject}, Score: ${score}`);
        }
      });
      majorData.Skills.forEach((skill) => {
        if (studentProfile.Skills.includes(skill)) {
          score += 3;
          // console.log(`Skill match found: ${skill}, Score: ${score}`);
        }
      });
      majorData.Hobbies.forEach((hobby) => {
        if (studentProfile.Hobbies.includes(hobby)) {
          score += 1;
          // console.log(`Hobby match found: ${hobby}, Score: ${score}`);
        }
      });

      // console.log(`Final score for ${majorData.Major}: ${score}`);

      return score;
    };

    // Score all majors
    const scoredMajors = uniData.map((majorData) => ({
      ...majorData,
      score: scoreMajors(majorData, studentProfile),
    }));

    // Sort majors by score in descending order and select the top 3
    const topMajors = scoredMajors.filter((major) => major.score >= 25).slice(
      0,
      3,
    );

    // Function to create prompts for OpenAI based on the selected majors
    const createCareerAdvicePrompt = (major, studentProfile) => {
      return `
        Based on the following student's interests:
        
        Major:
        - ${studentProfile.Major.join("\n- ")}
        
        Minor:
        - ${major.Minor.join("\n- ")}
        
        Subjects:
        - ${studentProfile.Subjects.join("\n- ")}
        
        Skills:
        - ${studentProfile.Skills.join("\n- ")}
        
        Hobbies:
        - ${studentProfile.Hobbies.join("\n- ")}
        
        ---
        
        Provide a convincing reasoning for why the student should choose the following major and the following minor as a suitable career path:
        
        Major: ${major.Major}  
        Minor: ${major.Minor.join(", ")}

        Ensure that the reasoning for each major and each minor is in a separate paragraph, and keep each paragraph to a maximum of 50 words.
        
        The reasoning should be formatted in JSON with the following structure:
        {
          "Major name": "reasoning",
          "Minor": {"Minor name 1":"reasoning", "Minor name 2": "reasoning"}
        }
            `.trim();
    };

    const formatPromptOutput = (output) => {
      return output.replace(/\n/g, " ").replace(/ +/g, " ").trim();
    };

    // Collect responses for each top major
    const responses = await Promise.all(topMajors.map(async (major) => {
      const reason = createCareerAdvicePrompt(major, studentProfile);
      const prompt = formatPromptOutput(reason);

      // const response = await getOpenAIResponse(prompt);
      
      return {
        Major: major.Major,
        Minor: major.Minor,
        SkillsToImprove: major.Skills,
        CoursesURL: major.URL,
        OpenAIResponse: prompt,
        //response
        //
      };
    }));

    const responseData = [{
      "Major": "Computer Science",
      "Minor": [
        "Machine Learning",
        "Cyber Security",
      ],
      "SkillsToImprove": [
        "Programming Languages (Python, Java)",
        "Problem-Solving",
        "Data Analysis",
        "Critical Thinking",
        "Attention to Detail",
      ],
      "CoursesURL":
        "https://bulletins.psu.edu/university-course-descriptions/undergraduate/cmpsc/",
      "OpenAIResponse":
        '{\n  "Major": "Computer science is an ideal major for this student due to their strong foundation in programming languages, data analysis, and problem-solving skills. With a focus on computer science, the student can further enhance their technical expertise of software development and technology.",\n  "Minor": {\n    "Machine Learning": "Machine Learning is a promising minor choice as it complements the student\'s interest in data analysis and quantitative skills. This specialization will equip them with advanced knowledge in AI and predictive analytics.",\n    "Cyber Security": "Cyber Security is a valuable minor to pair with Computer Science, given the increasing need for cybersecurity professionals. With this minor, the student can develop expertise in protecting digital systems."\n  }\n}',
    }, {
      "Major": "Finance",
      "Minor": [
        "Risk Management",
        "Quantitative Finance",
      ],
      "SkillsToImprove": [
        "Financial Analysis",
        "Quantitative Skills",
        "Risk Assessment",
        "Negotiation",
        "Attention to Detail",
      ],
      "CoursesURL":
        "https://bulletins.psu.edu/university-course-descriptions/undergraduate/fin/",
      "OpenAIResponse":
        '{\n  "Major": "Finance, combined with minors in Risk Management and Quantitative Finance, is a strong choice because it provides a robust understanding of financial systems while honing skills in assessing and managing risks. This combination equips you with valuable expertise in both strategic decision-making and quantitative analysis, making you highly adaptable in today’s complex financial landscape",\n  "Minor": {\n    "Risk Management": "The combination of financial knowledge with risk management expertise will equip the student to mitigate potential risks in investment decisions, a crucial skill in the finance industry.",\n    "Quantitative Finance": "By specializing in quantitative finance, the student can leverage their strong mathematical and programming skills to analyze complex financial data, enhancing their ability to make data-driven investment decisions."\n  }\n}',
    }, {
      "Major": "Marketing",
      "Minor": [
        "Brand Management",
        "Affiliate Marketing",
      ],
      "SkillsToImprove": [
        "Creativity",
        "Data Analysis",
        "Communication",
        "Social Media Proficiency",
        "Project Management",
      ],
      "CoursesURL":
        "https://bulletins.psu.edu/university-course-descriptions/undergraduate/mktg/",
      "OpenAIResponse":
        '{\n    "Major": "Marketing, with a focus on Brand Management and Affiliate Marketing, is an excellent choice because it blends creativity with data-driven strategies, allowing you to build strong, impactful brands. By improving skills in communication and data analysis, you can effectively engage audiences and drive business growth in a dynamic, digital-first marketplace.",\n    "Minor": {\n        "Brand Management": "The student\'s interests in graphic design, creativity, and social media proficiency make brand management a suitable choice to leverage these skills in building and managing brands effectively.",\n        "Affiliate Marketing": "With a background in programming languages, data analysis, and social media management, affiliate marketing can blend technical expertise with marketing strategies to drive successful online affiliate campaigns."\n    }\n}',
    }];

    User.findByIdAndUpdate(userId, {topMajors: responseData}).then((existingUser) => {
      if(existingUser) {
        res.json({ topMajors: responseData });
      } else {
        res.status(404).construct("User not found")
      }
    })

    // Send back the collected responses
    
  } catch (error) {
    console.error("Error with career advice:", error.message);
    res.status(500).json({
      error: "Failed to fetch career advice",
      details: error.message,
    });
  }
});

app.post("/api/career-timeline", async (req, res) => {
  const { Major, MinorSelected } = req.body.selectedMajor;
  const userId = req.body._id;
  const Minor = MinorSelected;
  const selectedMajorData = req.body.selectedMajor;
  selectedMajorData.Minor = Minor;
  if (!Major || !Minor) {
    return res.status(400).json({ error: "Major and minor are required." });
  }

  User.findByIdAndUpdate(
    userId,
    { selectedMajor: req.body.selectedMajor },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const major_info = uniData.find((major) => major.Major === Major);

      const createHEPrompt = (major, minor, url) => {
        return `
        Generate a 5-year career timeline for a student pursuing a ${major} major and ${minor} minor who is currently in their first year of undergraduate studies. The student is preparing for higher education (e.g., MS/PhD programs, internships in research/academia) after graduation.

        1. **Course Structure**: Provide a course structure based on the available courses at ${url}. Each course number represents increasing levels of complexity. For each year (Year 1 to Year 4), list **4-5 courses** for the Higher Education Track. The courses should only be listed for **January** and **August** semesters.

        2. **Timeline Breakdown**:  For each year, provide activities for every month, including Academic preparation (e.g., research opportunities, seminars) and Networking opportunities (e.g., attending academic conferences).

        3. **Output Format**: Create the entire timeline in a JSON format structured as follows:

        json
        {
            "Year 1": {
                "January": {
                    "Courses": ["Course1", "Course2", "Course3", "Course4"],
                    "Activities": ["Join Research Club", "Attend Introductory Research Methods Workshop"]
                },
                "February": {
                    "Activities": ["Meet with Faculty about Research Interests", "Attend Academic Writing Workshop"]
                },
                "March": {
                    "Activities": ["Participate in Research Panel Discussion", "Prepare for Midterms"]
                },
                "April": {
                    "Activities": ["Attend Networking Event with Graduate Students", "Start Research Project Proposal"]
                },
                "May": {
                    "Activities": ["Finalize Summer Research Internship Applications"]
                },
                "June": {
                    "Activities": ["Start Summer Research Internship"]
                },
                "July": {
                    "Activities": ["Complete Summer Research Internship"]
                },
                "August": {
                    "Courses": ["Course1", "Course2", "Course3", "Course4"],
                    "Activities": ["Attend Academic Conference", "Update CV and LinkedIn Profile"]
                },
                "September": {
                    "Activities": ["Network with Alumni at Welcome Back Event", "Attend Research Ethics Seminar"]
                },
                "October": {
                    "Activities": ["Apply for Fall Research Assistant Positions"]
                },
                "November": {
                    "Activities": ["Attend Graduate School Application Workshop", "Research Potential Graduate Programs"]
                },
                "December": {
                    "Activities": ["Review Semester Performance", "Request Letters of Recommendation"]
                }
            }
        }
        MAKE SURE THAT YOU DON'T MISS OUT ANY MONTH. IT SHOULD CONTAIN DATA FOR ALL MONTHS AND ALL YEARS. PLEASE TAKE YOUR TIME AND DO A CHAIN OF THOUGHT THING BEFORE RESPONDING.
        `.trim();
      };

      const createIPrompt = (major, minor, url) => {
        return `
        Generate a 5-year career timeline for a student pursuing a ${major} major and ${minor} minor who is currently in their first year of undergraduate studies. The student is preparing for industry (e.g., internships, job opportunities) after graduation.

        1. **Course Structure**: Provide a course structure based on the available courses at ${url}. Each course number represents increasing levels of complexity. For each year (Year 1 to Year 4), list **4-5 courses** for the Industry Track. The courses should only be listed for **January** and **August** semesters.

        2. **Timeline Breakdown**: For each year, include activities for internships (e.g., application deadlines, interview preparation) and industry engagement (e.g., networking events, workshops) for every month.

        3. **Output Format**: Create the entire timeline in a JSON format structured as follows:

        json
        {
        "Year 1": {
            "January": {
            "Courses": ["Course1", "Course2", "Course3"],
            "Activities": ["Apply for Summer Internship", "Join Club"]
            },
            "February": {
            "Activities": ["Attend Workshop", "Meet with Advisor"]
            },
            "March": {
            "Activities": ["Prepare for Midterms"]
            },
            "April": {
            "Activities": ["Attend Career Fair"]
            },
            "May": {
            "Activities": ["Finalize Internship Applications"]
            },
            "June": {
            "Activities": ["Start Summer Internship"]
            },
            "July": {
            "Activities": ["Complete Summer Internship"]
            },
            "August": {
            "Courses": ["Course1", "Course2", "Course3"],
            "Activities": ["Prepare Resume", "Attend Job Fair"]
            },
            "September": {
            "Activities": ["Network with Alumni"]
            },
            "October": {
            "Activities": ["Apply for Fall Internships"]
            },
            "November": {
            "Activities": ["Attend Finance Panel"]
            },
            "December": {
            "Activities": ["Review Semester Performance"]
            }
        },
        ...
        }
        MAKE SURE THAT YOU DON'T MISS OUT ANY MONTH. IT SHOULD CONTAIN DATA FOR ALL MONTHS AND ALL YEARS. PLEASE TAKE YOUR TIME AND DO A CHAIN OF THOUGHT THING BEFORE RESPONDING.
        `.trim();
      };

      const formatPromptOutput = (output) => {
        return output.replace(/\n/g, " ").replace(/ +/g, " ").trim();
      };

      const reason1 = createHEPrompt(Major, Minor, major_info.URL);
      const promptR = formatPromptOutput(reason1);

      const reason2 = createIPrompt(Major, Minor, major_info.URL);
      const promptI = formatPromptOutput(reason2);

      try {

        const response = {
          industry: promptI,
          research: promptR,
        };

        res.json(response);
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Failed to generate career timeline." });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    });
});

app.get("/api/students-per-major", async (req, res) => {
  const databricks_client = new DBSQLClient();

  try {
    await databricks_client.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOSTNAME,
      path: process.env.DATABRICKS_HTTP_PATH,
    });

    const session = await databricks_client.openSession();

    const queryOperation = await session.executeStatement(
      `
            WITH YearlyCounts AS (
                SELECT 
                    SUBSTR(AdmitTerm, -4) AS Year,
                    CurrentMajor,
                    COUNT(*) AS StudentCount
                FROM Users
                GROUP BY Year, CurrentMajor
            )
            SELECT 
                Year,
                CurrentMajor,
                StudentCount
            FROM 
                YearlyCounts
            ORDER BY Year, CurrentMajor
            `,
      { runAsync: true },
    );

    const result = await queryOperation.fetchAll();
    await queryOperation.close();

    const years = [...new Set(result.map((row) => row["Year"]))].sort();
    const subjects = {};

    result.forEach((row) => {
      const major = row["CurrentMajor"];
      const studentCount = row["StudentCount"];

      if (!subjects[major]) {
        subjects[major] = new Array(years.length).fill(0); // Initialize array for each year
      }

      const yearIndex = years.indexOf(row["Year"]);
      subjects[major][yearIndex] = studentCount; // Populate counts
    });

    await session.close();
    await databricks_client.close();

    res.json({ years, subjects });
  } catch (error) {
    console.error("Error fetching students per major:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for average salary per major
app.get("/api/average-salary", async (req, res) => {
  const databricks_client = new DBSQLClient();
  try {
    await databricks_client.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOSTNAME,
      path: process.env.DATABRICKS_HTTP_PATH,
    });
    const session = await databricks_client.openSession();

    const queryOperation = await session.executeStatement(
      "SELECT u.CurrentMajor, AVG(e.Salary) AS AverageSalary " +
        "FROM Users u " +
        "JOIN EmploymentStatistics e ON u.User_ID = e.User_ID " +
        "GROUP BY u.CurrentMajor " +
        "ORDER BY u.CurrentMajor",
      { runAsync: true },
    );
    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    // console.log("QUERY RES", result)
    const averageSalaries = {};
    result.forEach((row) => {
      const major = row["CurrentMajor"]; // CurrentMajor
      const averageSalary = row["AverageSalary"]; // AverageSalary
      averageSalaries[major] = averageSalary;
    });

    await session.close();
    await databricks_client.close();

    res.json(averageSalaries);
  } catch (error) {
    console.error("Error fetching average salaries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/academia-vs-job", async (req, res) => {
  const databricks_client = new DBSQLClient();

  try {
    await databricks_client.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOSTNAME,
      path: process.env.DATABRICKS_HTTP_PATH,
    });

    const session = await databricks_client.openSession();

    const queryOperation = await session.executeStatement(
      `
      WITH EmploymentCounts AS (
          SELECT 
              u.CurrentMajor,
              e.EmploymentType,
              COUNT(*) AS Count
          FROM 
              Users u
          JOIN 
              EmploymentStatistics e ON u.User_ID = e.User_ID
          GROUP BY 
              u.CurrentMajor, e.EmploymentType
      ),
      TotalCounts AS (
          SELECT 
              CurrentMajor,
              SUM(Count) AS TotalCount
          FROM 
              EmploymentCounts
          GROUP BY 
              CurrentMajor
      )
      SELECT 
          ec.CurrentMajor,
          CASE 
              WHEN tc.TotalCount = 0 THEN NULL
              ELSE (SUM(CASE WHEN ec.EmploymentType = 'Academia' THEN ec.Count ELSE 0 END) / tc.TotalCount) * 100
          END AS AcademiaPercentage,
          CASE 
              WHEN tc.TotalCount = 0 THEN NULL
              ELSE (SUM(CASE WHEN ec.EmploymentType = 'Industry' THEN ec.Count ELSE 0 END) / tc.TotalCount) * 100
          END AS IndustryPercentage
      FROM 
          EmploymentCounts ec
      JOIN 
          TotalCounts tc ON ec.CurrentMajor = tc.CurrentMajor
      GROUP BY 
          ec.CurrentMajor, tc.TotalCount
      ORDER BY 
          ec.CurrentMajor
      `,
      { runAsync: true },
    );

    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    console.log("acadvsindustry", result);
    const academiaData = {};
    result.forEach((row) => {
      const major = row["CurrentMajor"]; // CurrentMajor
      const academiaPercentage = row["AcademiaPercentage"]; // AcademiaPercentage
      const industryPercentage = row["IndustryPercentage"]; // IndustryPercentage

      academiaData[major] = {
        academia: academiaPercentage,
        job: industryPercentage,
      };
    });

    await session.close();
    await databricks_client.close();

    res.json(academiaData);
  } catch (error) {
    console.error("Error fetching academia vs job data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/dropout-rate", async (req, res) => {
  const databricks_client = new DBSQLClient();
  try {
    await databricks_client.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOSTNAME,
      path: process.env.DATABRICKS_HTTP_PATH,
    });
    const session = await databricks_client.openSession();

    const queryOperation = await session.executeStatement(
      "SELECT u.CurrentMajor, COUNT(d.Dropout_ID) AS NumberOfDropouts " +
        "FROM Dropouts d " +
        "JOIN Users u ON d.User_ID = u.User_ID " +
        "GROUP BY u.CurrentMajor " +
        "ORDER BY u.CurrentMajor",
      { runAsync: true },
    );

    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    console.log("QUERY RES", result);
    const subjects = {};
    result.forEach((row) => {
      const major = row["CurrentMajor"]; // CurrentMajor
      const dropoutCount = row["NumberOfDropouts"]; // AverageSalary
      subjects[major] = dropoutCount;
    });

    await session.close();
    await databricks_client.close();

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching number of dropouts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
