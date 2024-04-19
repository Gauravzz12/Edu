import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import ChatBot from './ChatBot';
import GradeIcon from "@mui/icons-material/Grade";
import FlagIcon from "@mui/icons-material/Flag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
const Container = styled(Box)`
  margin: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;

 
  }
`;

const Title = styled.h1`
  margin-bottom: 10px;
  color: #3f51b5; /* Updated to a green color */
  font-weight: bold;
`;

const SubTitle = styled.h2`
  margin-bottom: 20px;
  color: #3f51b5;
`;

const Features = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  overflow-x: auto;
`;

const FeatureCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:first-child {
    margin-left: 20px;
  }

  &:last-child {
    margin-right: 20px;
  }
`;

const FeatureTitle = styled.h3`
  margin-bottom: 10px;
  color: #3f51b5;
`;

const FeatureDescription = styled.p`
  color: #555;
`;

const Dashboard = () => {
  const name = sessionStorage.getItem('name');

  return (
    <Container>
      <Content>
        <Title>Hello {name}, Welcome To EduTrack+</Title>
      
  
      </Content>
      <Features>
        <FeatureCard>
          <FeatureTitle><GradeIcon/> Grades Tracker</FeatureTitle>
          <FeatureDescription>Visualize your academic journey with detailed progress tracking.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle><FlagIcon/>Set Goals</FeatureTitle>
          <FeatureDescription>Define and achieve your academic goals efficiently.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle><AutoStoriesIcon/>Access Resources</FeatureTitle>
          <FeatureDescription>Explore a wealth of educational resources to support your learning.</FeatureDescription>
        </FeatureCard>
      </Features>
      <ChatBot />
    </Container>
  );
};

export default Dashboard;
