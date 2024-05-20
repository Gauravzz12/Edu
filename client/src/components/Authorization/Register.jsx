import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../Loader/Loader";


const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to left, #ddf0ed, #abb0b6, #b4cfff); 
`;

const FormContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  min-height: 300px;
  display: flex;
  gap: 30px;
  img{
    max-width: 500px;
    height: auto;
    object-fit: contain;
  }
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.8);

`;

const Heading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  color:#12376e;
  margin-bottom:-15px;
`;

const Paragraph = styled.p`
  font-size: 22px;
  text-align: center;
  font-family:'comic sans ms';
  font-style: italic;
  color:brown;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 5px;
`;
const Select = styled.select`
  width: 96%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #cccccc;
  border-radius: 5px;
`;
const Button = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Link = styled(NavLink)`
  display: block;
  text-align: center;
  font-size: 14px;
  color: #007bff;
  margin-top: 10px;
`;
const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    year: "",
  });

  const handleInputs = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  

  const PostData = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(
      "https://edu-track-dusky.vercel.app/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    setLoading(false);
    const data = await res.json();
    console.log(res.status);
    console.log(data);
     if(res.status==400){
      window.alert("User with this email already exists")
      setLoading(false);
    }
    else if(res.status==422){
      window.alert("Please Fill all the Required Fields");
      setLoading(false);
      
    }
    else if (data.error || !data) {
      window.alert("Invalid Registration");
    }
    
    else {
      navigate("/Login");
    }
  };

  return (
    <Container>
       {loading && (
        <LoaderOverlay>
          <Loader />
        </LoaderOverlay>
      )}
        <Heading>EDUTRACK+</Heading>
        <Paragraph>
          Precision for Progress, Insight for Impact. Track your academic journey with efficiency, unlock potential, and inspire a future of achievements
        </Paragraph>
      <FormContainer>
        <Form onSubmit={PostData}>
          <FormGroup>
            <Label htmlFor="name">Your Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              value={user.name}
              onChange={handleInputs}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="id">Student ID</Label>
            <Input
              type="number"
              name="id"
              id="id"
              placeholder="Your Id"
              value={user.id}
              onChange={handleInputs}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email ID</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email"
              value={user.email}
              onChange={handleInputs}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="year">Year</Label>
            <Select
              name="year"
              id="year"
              value={user.year}
              onChange={handleInputs}
            >
              <option value="">Select Year</option>
              <option value="one">1st</option>
              <option value="two">2nd</option>
              <option value="three">3rd</option>
              <option value="four">4th</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              value={user.password}
              onChange={handleInputs}
            />
          </FormGroup>
          <Button type="submit" value="Register" />
        <Link to="/">Already own an account? Click here</Link>
        </Form>
        <img src="/assets/Logo.jpeg"></img>

      </FormContainer>
    </Container>
  );
};

export default Register;
