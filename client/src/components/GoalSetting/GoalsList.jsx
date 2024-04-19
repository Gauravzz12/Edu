import React, { useState, useEffect } from "react";
import GoalsCalendar from "./GoalsCalender";
import "./goalList.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ConfettiEffect from "../GoalSetting/ConfettiEffect";
function GoalsList() {
  const [newGoal, setNewGoal] = useState({
    Goal: "",
    deadline: new Date(),
    completed: false,
  });
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [completed, setCompleted] = useState(false);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "serialNumber",
      headerName: "S.No.",
      filter: true,
    },
    {
      field: "goal",
      headerName: "Goal Description",
      filter: true,
      editable: true,
    },
    {
      field: "deadline",
      headerName: "Deadline Date",
      filter: true,
      editable: true,
    },
    {
      headerName: "Completed",
      cellRenderer: (params) => {
        return (
          <>
            <input
              type="checkbox"
              defaultChecked={params.data.completed}
              onClick={(event) => markasCompleted(params, event)}
            />
          </>
        );
      },
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <div className="button-container">
            {params.data.editMode ? (
              <>
                <button className="update-button" onClick={() => handleUpdate(params)}>Update</button>
                <button className="cancel-button" onClick={() => handlecancel(params)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={() => handleEdit(params)}>Edit</button>
                <button className="remove-button" onClick={() => handleRemove(params.data)}>Remove</button>
              </>
            )}
          </div>
        );
      },
      
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  ]);
  const handleEdit = (params) => {
    params.data.editMode = true;
    params.api.refreshCells();

    params.api.startEditingCell({
      rowIndex: params.rowIndex,
      colKey: "goal",
    });
  };
  const handlecancel = (params) => {
    params.data.editMode = false;
    params.api.refreshCells();
    params.api.stopEditing();
  };
  const markasCompleted = async (params, event) => {
    const value = event.target.checked;
    console.log(value);
    if (value) {
      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
      }, 4000);
      params.data.completed = true;
      event.target.checked = true;

      handleUpdate(params);
    } else {
      params.data.completed = false;
      event.target.checked = false;
      handleUpdate(params);
    }
  };
  const handleUpdate = async (params) => {
    params.data.editMode = false;
    params.api.stopEditing();
    params.api.refreshCells();

    const updatedData = params.data;
    try {
      const response = await axios.put(
        `https://edu-track-dusky.vercel.app/goals/updateGoals/${updatedData._id}`,
        {
          goal: updatedData,
          id: sessionStorage.getItem("id"),
        }
      );
    } catch (error) {
      console.error("Error updating Goal:", error);
    }
  };

  const handleRemove = async (data) => {
    try {
      await axios.delete(`https://edu-track-dusky.vercel.app/goals/deleteGoals/`, {
        params: { goalId: data._id, id: sessionStorage.getItem("id") },
      });

      toast("Goal Removed Successfully!");
      setRowData((prevData) => {
        return prevData.filter((goal) => goal._id !== data._id);
      });
    } catch (error) {
      console.error("Error removing Goal:", error);
    }
  };

  const onGridSizeChanged = (params) => {
    params.api.sizeColumnsToFit();
  };

  const fetchGoals = async () => {
    try {
      const goal = await axios.get("https://edu-track-dusky.vercel.app/goals/getgoals", {
        params: { id: sessionStorage.getItem("id") },
      });
      const updatedData = goal.data.map((goal) => ({
        ...goal,
        editMode: false,
      }));
      setRowData(updatedData);
    } catch (error) {
      console.error("Error fetching Goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prevData) => ({
      ...prevData,
      [name]: value,
      completed: false,
    }));
  };

  const saveGoals = async () => {
    try {
      const deadlineDate = new Date(newGoal.deadline);
      if (deadlineDate < new Date()) {
        alert("Too late! Please select a future deadline.");
        return;
      }

      const response = await axios.post(
        `https://edu-track-dusky.vercel.app/goals/saveGoals`,
        {
          goal: newGoal,
          id: sessionStorage.getItem("id"),
        }
      );
      const updatedData = {
        ...response.data,
        editMode: false,
      };
      setRowData((prevData) => [...prevData, updatedData]);

      toast("Goal Added Successfully!");
      setNewGoal({ Goal: "", deadline: new Date(), completed: false });
    } catch (error) {
      console.error("Error adding Goal:", error);
    }
  };

  return (
    <>
      <main className="goalContainer m-3">
        <div>
          <div className="grade-tracker-heading">
            <h1>TRACK YOUR GOALS</h1>
          </div>

          <div className="input_holder">
            <label htmlFor="goalInput" style={{ marginTop: "10px" }}>
              Enter Goal:
            </label>

            <input
              id="goalInput"
              value={newGoal.Goal}
              onChange={handleInputChange}
              name="Goal"
              type="text"
              style={{
                backgroundColor: "#eaeaea",
                padding: "2px",
                color: "black",
                width: "20vw",
                height: "6vh",
              }}
              placeholder="Enter Goal.."
            />
            <label htmlFor="deadlineInput" style={{ marginTop: "10px" }}>
              Enter Deadline:
            </label>
            <input
              id="deadlineInput"
              value={newGoal.deadline}
              onChange={handleInputChange}
              type="date"
              name="deadline"
              style={{
                backgroundColor: "#eaeaea",
                padding: "2px",
                width: "20vw",
                height: "6vh",
              }}
              placeholder="Enter deadline"
            />
            <button
              className="button-30"
              style={{
                backgroundColor: "#eaeaea",
                marginRight: "10px",
                border: "2px solid white",
                width: "12vw",
                height: "6vh",
                color: "white",
              }}
              onClick={saveGoals}
            >
              ADD
            </button>
            <br />
            <div>
              <button
                className="button-30"
                style={{
                  width: "14vw",
                  height: "6vh",
                  border: "2px solid white",
                }}
                onClick={() => setShowCalendarModal(true)}
              >
                CALENDAR
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="ag-theme-quartz"
              style={{ height: 400, width: "100%" }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                pagination={true}
                onGridSizeChanged={onGridSizeChanged}
                paginationPageSizeSelector={[10, 20, 30]}
                editType="fullRow"
                suppressClickEdit={true}
                suppressCellFocus={true}
                suppressRowClickSelection={true}
              />
            </div>
          </div>
        </div>

        {showCalendarModal && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setShowCalendarModal(false)}
              >
                &times;
              </span>
              <h2>Goals Calendar</h2>
              <GoalsCalendar />
            </div>
          </div>
        )}
        {completed && <ConfettiEffect message={"Goal Accomplished 🥳🥳"} />}
        
       
      </main>
    </>
  );
}

export default GoalsList;
