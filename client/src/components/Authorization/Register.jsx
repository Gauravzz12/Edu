import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./register.css";
const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    id: "",
    email: "",
    password: "",
    year: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const PostData = async (e) => {
    e.preventDefault();

    const { name, id, email, password,year } = user;

    const res = await fetch(
      "https://edu-track-dusky.vercel.app/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, id, email, phone, password,year }),
      }
    );

    const data = await res.json();

    if (data.error || !data) {
      window.alert("Invalid Registration");
    } else {
      window.alert("Registration Successful");

      navigate("/Login");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="cols ">
          <h1 className="heading">
            EDUTRACK+
            <br />
            Tracking Academic Success
            <br />
            <span className="subheading">efficiently</span>
          </h1>
          <p className="paragraph">
            Precision for Progress, Insight for Impact. Track your academic
            journey with efficiency, unlock potential, and inspire a future of
            achievements
          </p>
        </div>
        <div className="col position-relative">
          <section className="signup">
            <div className="form my-5 bg-glass p-5">
              <form method="POST" className="regis-form" id="regis-form">
                <div className="group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    id="name"
                    placeholder="Your Name"
                    value={user.name}
                    onChange={handleInputs}
                  />
                </div>

                <div className="group">
                  <label htmlFor="id">Student ID</label>
                  <input
                    type="number"
                    name="id"
                    className="input"
                    id="id"
                    placeholder="Your Id"
                    value={user.id}
                    onChange={handleInputs}
                  />
                </div>

                <div className="group">
                  <label htmlFor="email">Email ID</label>
                  <input
                    type="email"
                    name="email"
                    className="input"
                    id="email"
                    placeholder="Your Email"
                    value={user.email}
                    onChange={handleInputs}
                  />
                </div>
                <div className="group">
                  <label htmlFor="year">Year</label>
                  <select
                    type="text"
                    name="year"
                    className="input"
                    id="year"
                    placeholder="Your year"
                    value={user.year}
                    onChange={handleInputs}
                  >
                    <option value="">Select Year</option>
                  <option value="first">1st</option>
                  <option value="second">2nd</option>
                  <option value="third">3rd</option>
                  <option value="fourth">4th</option>
                  </select>
                </div>


                <div className="group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="input"
                    placeholder="Your Password"
                    value={user.password}
                    onChange={handleInputs}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="submit"
                    name="signup"
                    id="signup"
                    className="button-30"
                    value="Register"
                    onClick={PostData}
                  />
                </div>
              </form>
              <span className="link" style={{ marginRight: "20px" }}>
                Already own an account?
              </span>
              <NavLink to="/" className="link">
                Click here
              </NavLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Register;
