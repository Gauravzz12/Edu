import styled from "styled-components";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  background-color: #f0f0f0;
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
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  background-color: #f0f0f0;
  padding: 20px 0;
`;

const Performer = styled.div`
  min-height: 60px;
  min-width: 300px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background-color: white;
  font-family: cursive;
  font-size: small;
  padding: 10px;
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
  const [rankings, setRankigs] = useState([]);
  const [data, setData] = useState([]);

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
      console.log(response.data);+
      setData(response.data);
      getRankings("DSA", "FA", response.data);
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
    setRankigs(userRankingsArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getRankings(subject, testType);
  }, [subject, testType]);

  const topPerformers = rankings.slice(0, 3);
  const remainingPerformers = rankings.slice(3);
const xlabel=rankings.map((performer) => performer.name);
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
        <TopBox>
          {topPerformers.map((performer, index) => (
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
              {remainingPerformers.map((performer, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      performer.name === sessionStorage.getItem("name")
                        ? "lightBlue"
                        : "inherit",
                  }}
                >
                  <Td>{index + 3}</Td>
                  <Td>{performer.name}</Td>
                  <Td>{performer.totalMarks}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
      </Container>
    </>
  );
}
export default Ranking;
