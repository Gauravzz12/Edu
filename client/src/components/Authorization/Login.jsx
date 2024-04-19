import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch('https://edu-track-dusky.vercel.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 400 || !data) {
      window.alert('Invalid Credentials');
    } else {
      window.alert('Login Successful');

      sessionStorage.setItem('name', data.name);
      sessionStorage.setItem('id', data.id);
      sessionStorage.setItem('clg_id', data.clg_id);

      setLoggedIn(true);
      navigate('/');
    }
  };

  return (
    <div className='container'>
        <div className='row'>
            <div className='cols '>
                <h1 className="heading">
                    EDUTRACK+
                    <br />
                    Tracking Academic Success
                    <br/>
                    <span className="subheading">Efficiently</span>
                </h1>
                <p className='paragraph'>
                    Precision for Progress, Insight for Impact. Track your academic journey with efficiency, unlock potential, and inspire a future of achievements
                </p>
            </div>
            <div className='col position-relative'>
                

          <section className="signup">
            <div className="signup-form">
              <form className="regis-form" id="regis-form">
                <div className="form-group">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your Password"
                  />
                </div>

                <input
                  type="submit"
                  name="signin"
                  id="signup"
                  className="form-submit btn-primary w-100 mb-4"
                  onClick={loginUser}
                  value="Log In"
                />
              </form>

              <span className="login-link text-light fs-6 text-capitalize" style={{ marginRight: "20px" }}>
                Do not have an account?
              </span>
              <NavLink to="/Register" className="login-link text-light fs-6 text-capitalize">
                Sign Up
              </NavLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
