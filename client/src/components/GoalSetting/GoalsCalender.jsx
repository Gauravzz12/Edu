import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import "./GoalsCalender.css";

const localizer = momentLocalizer(moment);
const GoalDisplay = ({ goals, onClose }) => {
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "It always seems impossible until it is done. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
  ];

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">Close</button>
        <h1>Goals</h1><br></br>
        <p className="motivational-quote">{getRandomQuote()}</p>
        <ul className="goal-list">
          {goals.map((goal, index) => (
            <li key={index}>
              <span className="serial-number">{index + 1}. </span>
              {goal.goal}
              {"   "}
              <span style={{ fontWeight: 'bold', marginLeft: '10px', color: goal.completed ? 'green' : 'red' }}>
                Status: {goal.completed ? "Accomplished" : "Pending"}
              </span>            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("https://edu-track-dusky.vercel.app/goals/getgoals", {
          params: { id: sessionStorage.getItem("id") },
        });
        
        setGoals(response.data); 
        const mappedEvents = response.data.map(({ goal, deadline,completed }) => ({
          title: goal,
          start: new Date(deadline),
          end: new Date(deadline),
          status:completed
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []); 

  const handleSelectEvent = (event) => {
    const selectedGoals = goals.filter((goal) =>
      moment(goal.deadline).isSame(event.start, "day")
    );
    setSelectedDate(event.start);
  };
  const handleCloseGoalDisplay = () => {
    setSelectedDate(null);
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
      />
       {selectedDate && (
        <GoalDisplay
          goals={goals.filter((goal) =>
            moment(goal.deadline).isSame(selectedDate, "day")
          )}
          onClose={handleCloseGoalDisplay}
        />
      )}
    </div>
  );
};

export default MyCalendar;
