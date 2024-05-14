import styled from "styled-components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";

const Table = styled.table`
  width: 60%;
  border: none;
  margin-top: 20px;
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: center;
  padding: 8px;
  background-color: lightcoral;
  font-weight: bold;
  color: black;
  font-size: x-large;
  font-family: cursive;
`;

const Td = styled.td`
  text-align: center;
  padding: 8px;
  font-size: larger;
  font-family: cursive;
  color: #12376e;
`;

const Title = styled.h1`
  color: #12376e;
  font-weight: bold;
  font-size: 3rem;
`;

const Box = styled.div`
  flex-direction: column;
  justify-content: center;
  display: flex;
  align-items: center;
  margin: 20px;
  height: 100px;
  border-radius: 35px;
  box-shadow: 22px 22px 46px #828282, -22px -22px 46px #ffffff;
  border: 2px solid black;
`;

const Dropdiv = styled.div`
  margin-left: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 70%;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Left = styled.div`
  flex: 3;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Right = styled.div`
  flex: 1;
  width: 100%;
  border-left: 5px solid black;
  padding-left: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  h1 {
    color: red;
  }
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  background-color: #f4f4f4;
  padding: 20px 0;
`;

const Performer = styled.div`
  min-height: 60px;
  min-width: 250px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background-color: white;
  font-family: cursive;
  font-size: small;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-image: linear-gradient(to right, #9c812e, #fffca4, #ffe45d);
`;

const PerformerName = styled.h2`
  margin: 0;
  color: #12376e;
`;

const PerformerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: brightness(1.12);
`;

function Ranking() {
  const [subject, setSubject] = useState("DSA");
  const [testType, setTestType] = useState("FA");
  const [rankings, setRankings] = useState([]);
  const [data, setData] = useState([]);
  const [bestSubject, setBestSubject] = useState("None");
  const [worstSubject, setWorstSubject] = useState("None");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject") {
      setSubject(value);
    } else if (name === "testType") {
      setTestType(value);
    }
    getRankings(subject, testType);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://edu-track-dusky.vercel.app/marks/getRankings`,
        {
          params: { year: sessionStorage.getItem("year") },
        }
      );
      console.log(sessionStorage.getItem("year"));
      setData(response.data);
      getRankings("DSA", "FA", response.data);
      calculateSubjectPerformances(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRankings = (subject, testType, x) => {
    const userRankings = {};
    (x || data).forEach((user) => {
      user.marks.forEach((mark) => {
        if (mark.subject === subject && mark.testType === testType) {
          const { scoredMarks } = mark;
          const name = user.name;

          if (!userRankings[name]) {
            userRankings[name] = 0;
          }
          userRankings[name] += scoredMarks;
        }
      });
    });
    const userRankingsArray = Object.entries(userRankings).map(
      ([name, totalMarks]) => ({ name, totalMarks })
    );
    userRankingsArray.sort((a, b) => b.totalMarks - a.totalMarks);
    setRankings(userRankingsArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getRankings(subject, testType);
  }, [subject, testType]);
  const calculateSubjectPerformances = (x) => {
    const subjectsData = {};

    x.forEach((user) => {
      if(user.name === sessionStorage.getItem("name")) {
      user.marks.forEach((mark) => {
        console.log(mark);
        const { subject, scoredMarks } = mark;

        if (!subjectsData[subject]) {
          subjectsData[subject] = {
            totalMarks: 0,
            count: 0,
          };
        }

        subjectsData[subject].totalMarks += scoredMarks;
        subjectsData[subject].count++;
      });
    }
    });

    const subjectAverages = Object.keys(subjectsData).map((subject) => ({
      subject,
      averageMarks:
        subjectsData[subject].totalMarks / subjectsData[subject].count,
    }));

    const sortedSubjects = subjectAverages
      .slice()
      .sort((a, b) => b.averageMarks - a.averageMarks);
    console.log(sortedSubjects);
    setBestSubject(sortedSubjects[0].subject);
    setWorstSubject(sortedSubjects[sortedSubjects.length - 1].subject);
  };

  const totalPerformers = rankings.length;
  let currentUserIndex = -1;
  if (sessionStorage.getItem("name")) {
    currentUserIndex = rankings.findIndex(
      (performer) => performer.name === sessionStorage.getItem("name")
    );
  }

  let performersAhead = 0;
  let performersBehind = 0;
  if (currentUserIndex !== -1) {
    performersAhead = currentUserIndex;
    performersBehind = totalPerformers - currentUserIndex - 1;
  }

  let performersAheadPercentage = 0;
  let performersBehindPercentage = 0;
  if (totalPerformers > 1) {
    performersAheadPercentage = (performersAhead / (totalPerformers - 1)) * 100;
    performersBehindPercentage =
      (performersBehind / (totalPerformers - 1)) * 100;
  } else if (totalPerformers === 1) {
    performersAheadPercentage = 100;
  }

  console.log(`Total performers: ${totalPerformers}`);
  console.log(`Current user index: ${currentUserIndex}`);
  console.log(`Performers ahead: ${performersAhead}`);
  console.log(`Performers behind: ${performersBehind}`);
  console.log(
    `Percentage of performers ahead: ${performersAheadPercentage.toFixed(2)}%`
  );
  console.log(
    `Percentage of performers behind: ${performersBehindPercentage.toFixed(2)}%`
  );

  return (
    <>
      <Box>
        <Title>Rankings</Title>
      </Box>
      <Dropdiv>
        <label htmlFor="subject">Subject:</label>
        <select id="subject" name="subject" onChange={handleInputChange}>
          <option value="DSA">DSA</option>
          <option value="WEB">WEB</option>
          <option value="SD">SD</option>
          <option value="CLOUD">CLOUD</option>
          <option value="IP">IP</option>
        </select>
        <label htmlFor="testType">Test-Type:</label>
        <select id="testType" name="testType" onChange={handleInputChange}>
          <option value="FA">FA</option>
          <option value="ST1">ST1</option>
          <option value="ST2">ST2</option>
          <option value="ETE">ETE</option>
        </select>
      </Dropdiv>
      <Container>
        <Left>
          <TopBox>
            {rankings.slice(0, 3).map((performer, index) => (
              <Performer key={index}>
                <h2>Rank : {index + 1}</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "-30px",
                    justifyContent: "center",
                    marginBottom: "-30px",
                  }}
                >
                  <PerformerName>{performer.name}</PerformerName>
                  <PerformerImage
                    src={`/src/assets/medal${index + 1}.jpg`}
                    alt={performer.name}
                  />
                </div>
                <h2>Marks : {performer.totalMarks}</h2>
              </Performer>
            ))}
          </TopBox>
          {rankings.length > 3 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Table>
                <thead>
                  <tr>
                    <Th>Rank</Th>
                    <Th>Name</Th>
                    <Th>Marks</Th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.slice(3).map((performer, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          performer.name === sessionStorage.getItem("name")
                            ? "lightBlue"
                            : "inherit",
                      }}
                    >
                      <Td>{index + 4}</Td>
                      <Td>{performer.name}</Td>
                      <Td>{performer.totalMarks}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Left>
        <Right>
          <h1>Statistics</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "18px" }}>
              <p style={{ margin: "0", color: "#ff6347" }}>
                {`Percentage of Performers Ahead: ${performersAheadPercentage.toFixed(
                  2
                )}%`}
              </p>
              <p style={{ margin: "0", color: "#4682b4" }}>
                {`Percentage of Performers Behind: ${performersBehindPercentage.toFixed(
                  2
                )}%`}
              </p>
              <div>
                <p style={{ margin: "0", color: "#4682b4" }}>
                  Best Performing Subject: {bestSubject}
                </p>
                <p style={{ margin: "0", color: "#ff6347" }}>
                  Worst Performing Subject: {worstSubject}
                </p>
              </div>
            </div>
          </div>

          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: performersAhead, label: " Ahead" },
                  { id: 1, value: performersBehind, label: " Behind" },
                ],
                valueFormatter: (v, { dataIndex }) => {
                  if (dataIndex === 0) {
                    const performersAheadNames = rankings
                      .slice(0, currentUserIndex)
                      .map((performer) => performer.name);
                    return performersAheadNames.map((name) => <li>{name}</li>);
                  } else {
                    const performersBehindNames = rankings
                      .slice(currentUserIndex + 1)
                      .map((performer) => performer.name);
                    return performersBehindNames.map((name) => <li>{name}</li>);
                  }
                },

                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            width={400}
            height={200}
          />
        </Right>
      </Container>
    </>
  );
}

export default Ranking;
