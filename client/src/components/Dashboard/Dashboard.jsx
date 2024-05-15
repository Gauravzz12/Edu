import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import ChatBot from './ChatBot';
import GradeIcon from "@mui/icons-material/Grade";
import FlagIcon from "@mui/icons-material/Flag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Link } from 'react-router-dom';

const Container = styled(Box)`
  margin: 20px;
  background: linear-gradient(135deg, #eceff1, #cfd8dc);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const Content = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
`;

const Description = styled.p`
color: black;
  font-size: large;
  font-style: italic;
  text-shadow: 1px 0px 0px #000;
  letter-spacing: 2px;
  margin-top: 0;
  margin-bottom: 20px;
  padding: 0 20px;  
`;


const Title = styled.h1`
  margin-bottom: 10px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;  
  color: transparent;
  background: linear-gradient(45deg, #6a1b9a, #8e24aa);
  background-clip: text;

  text-align: center;
`;

const SubTitle = styled.h2`
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem; 
  color: transparent;
  background: linear-gradient(45deg, #ec407a, #d81b60);
  background-clip: text;
  text-align: center;
`;

const Features = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const FeatureCard = styled(Link)`
  flex: 1;
  max-width: 250px;
  min-width: 200px;
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  }
`;

const FeatureTitle = styled.h3`
  margin-bottom: 10px;
  color: #3f51b5;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-decoration: underline ;
`;

const FeatureDescription = styled.p`
  color: #555;
`;

const Dashboard = () => {
  const name = sessionStorage.getItem('name');

  return (
    <Container>
    <Content>
      <Title>Hello <span style={{color:"goldenrod",textDecoration:"underline #3f51b5"}}>{name}</span>, Welcome To EduTrack+</Title>
      <SubTitle>Your Personal Academic Performance Tracker</SubTitle>
      <Description>
        EduTrack+ is designed to empower students like you to monitor and enhance their academic performance
        through a suite of tools tailored for goal setting, progress tracking, and accessing rich educational resources.
        Engage with interactive elements like the grades tracker and set precise goals to stay on top of your studies.
        Use the resource library to find additional study materials, and compare your performance with peers via our rankings feature.
      </Description>
    </Content>
    <Features>
      <FeatureCard to="/GradeTracker">
        <FeatureTitle><GradeIcon/> Grades Tracker</FeatureTitle>
        <FeatureDescription>Visualize your academic journey with detailed progress tracking.</FeatureDescription>
      </FeatureCard>
      <FeatureCard to="/goalsList">
        <FeatureTitle><FlagIcon/> Set Goals</FeatureTitle>
        <FeatureDescription>Define and achieve your academic goals efficiently.</FeatureDescription>
      </FeatureCard>
      <FeatureCard to="/ResourceLibrary">
        <FeatureTitle><AutoStoriesIcon/> Access Resources</FeatureTitle>
        <FeatureDescription>Explore a wealth of educational resources to support your learning.</FeatureDescription>
      </FeatureCard>
      <FeatureCard to="/Rankings">
        <FeatureTitle><LeaderboardIcon/> Rankings</FeatureTitle>
        <FeatureDescription>Check your academic rankings against your peers.</FeatureDescription>
      </FeatureCard>
    </Features>
    <ChatBot />
  </Container>
  );
};

export default Dashboard;
