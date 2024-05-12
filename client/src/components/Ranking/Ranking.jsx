import styled from "styled-components";
import React, { useEffect, useState } from "react";
import medal1 from "../../assets/award_medals_1.jpg";
import medal2 from "../../assets/award_medals_2.jpg";
import medal3 from "../../assets/award_medals_3.jpg";
import axios from "axios";
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

const Stats = styled.div`
  min-width: 300px;
  min-height: 200px;
  border: 2px solid black;
  background-color: #ffff;
  box-shadow: 22px 22px 46px #828282, -22px -22px 46px #ffffff;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const Performer = styled.div`
  min-height: 100px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  img {
    width: 40px;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const RemainingPerformers = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const RemainingPerformer = styled.div`
  min-height: 100px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Ranking() {
  const [subject, setSubject] = useState("DSA");
  const [testType, setTestType] = useState("FA");
  const [performers, setPerformers] = useState([]);
  const [rankings,setRankigs]=useState([]);
  const [data,setData]=useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject") {
      setSubject(value);
    } else if (name === "testType") {
      setTestType(value);
    }
    getRankings(subject,testType);
  };
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/marks/getRankings`, {
        params: { id: sessionStorage.getItem("id") },
      });
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
          console.log(name)
          console.log(user);
          if (!userRankings[name]) {
            userRankings[name] = 0;
          }
          userRankings[name] += scoredMarks;
        }
      });
    });
    const userRankingsArray = Object.entries(userRankings).map(([name, totalMarks]) => ({ name, totalMarks }));
    userRankingsArray.sort((a, b) => b.totalMarks - a.totalMarks);
    setRankigs(userRankingsArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getRankings(subject, testType);
  }, [subject, testType]);
  const topPerformers = performers.slice(0, 3);
  const remainingPerformers = performers.slice(3);

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
          <option value="NALR">NALR</option>
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
        <center>
          <h1>Top Performers </h1>
        </center>

        <TopBox>
          {topPerformers.map((performer, index) => (
            <Performer key={index}>
              <h2>{performer.name}</h2>
              <img src={performer.img} alt={performer.name} />
            </Performer>
          ))}
        </TopBox>

        <center>
          <h1>Remaining Performers </h1>
        </center>

        <RemainingPerformers>
          {remainingPerformers.map((performer, index) => (
            <RemainingPerformer key={index}>
              <h2>{performer.name}</h2>
              <img src={performer.img} alt={performer.name} />
            </RemainingPerformer>
          ))}
        </RemainingPerformers>
        <div>
          {rankings.map((ranking, index) => (
            <div key={index}>
              <p>UserID: {ranking.name}</p>
              <p>Total Marks: {ranking.totalMarks}</p>
              <hr />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

export default Ranking;
