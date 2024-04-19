import React, { useState } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import SideBars from './components/Global/SideBar.jsx';
import DashBoard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Authorization/Login.jsx';
import Register from './components/Authorization/Register.jsx';
import GradeTracker from './components/GradeTracker/GradeTracker';
import GoalList from './components/GoalSetting/GoalsList';
import BooksResourcePage from './components/ResourceLibrary/ResourceLibrary'




function App() {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.length>0); 
  if (!loggedIn) {
    return (
      <Router>
            <div className="app">
              <Routes>
              <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
                <Route path="/" element={<Login setLoggedIn={setLoggedIn}/>} />
                <Route path="/Register" element={<Register />} />
              </Routes>
            </div>
      </Router>
    );
  }

  return (
    <Router>
 
          <div className="app">
            <SideBars  />
            <main className="content">
              <Routes>
                <Route path="/" element={<DashBoard />} />
                <Route path="/GradeTracker" element={<GradeTracker />} />
                <Route path='/goalsList' element={<GoalList/>}/>
                <Route path='/ResourceLibrary' element={<BooksResourcePage/>}/>


              </Routes>
            </main>
          </div>

    </Router>
  );
}

export default App;
