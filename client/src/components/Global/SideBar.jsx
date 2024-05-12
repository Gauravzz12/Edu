import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SchoolIcon from '@mui/icons-material/School';
import FlagIcon from "@mui/icons-material/Flag";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Link to={to}>{title}</Link>
    </MenuItem>
  );
};

const Sidebars = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    alert("Log Out Successfull")
    window.location.reload();

  };

  return (
    <ProSidebar collapsed={isCollapsed}>
      <Menu iconShape="square">
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
        >
          {!isCollapsed && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "4px",
                marginBottom:"-20px"
              }}
            >
              <h1 style={{color:"gold"}}>EDUTRACK+</h1>
            </div>
          )}
        </MenuItem>

        {!isCollapsed && (
          <div >
            <div
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "left",
                marginLeft: "20%",
              }}
            >
              <h1>{sessionStorage.getItem("name")}</h1>
            </div>
          </div>
        )}

        <div style={{ paddingLeft: isCollapsed ? undefined : "10%" }}>
          <Item
            title="Dashboard"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Item
            title="Resources"
            to="/ResourceLibrary"
            icon={<AutoStoriesIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Item
            title="Goals"
            to="/goalsList"
            icon={<FlagIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Grade Tracker"
            to="/GradeTracker"
            icon={<SchoolIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Rankings"
            to="/Rankings"
            icon={<LeaderboardIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <MenuItem icon={<ExitToAppIcon />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </div>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebars;
