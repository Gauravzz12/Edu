import "./GradeTracker.css";
import UserImage from "../../assets/User.png";
import UniImage from "../../assets/university.png";
import degree from "../../assets/degree.png";
import id from "../../assets/Id.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { BarChart } from '@mui/x-charts/BarChart';

Modal.setAppElement("#root");

function GradeTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({
    subject: "",
    testType: "",
    maxMarks: 0,
    scoredMarks: 0,
  });
  const calculatePercentage = (maxMarks, scoredMarks) => {
    if (maxMarks === 0) {
      return 0;
    }
    const percentage = (scoredMarks / maxMarks) * 100;
    return parseFloat(percentage.toFixed(2));
  };
  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  const onGridSizeChanged = (params) => {
    params.api.sizeColumnsToFit();
  };
  const [rowData, setRowData] = useState([]);

  const [columnDefs, setColumnDefs] = useState([
    { field: "subject", editable: true, headerName: "Subject", filter: true },
    { field: "testType", headerName: "Test Type", filter: true },
    { field: "maxMarks", headerName: "Max Marks", filter: true },
    { field: "scoredMarks", headerName: "Scored Marks", filter: true },
    { field: "percentage", headerName: "Percentage", filter: true },
  ]);

  useEffect(() => {
    fetchGrades();
  }, []);
  const fetchGrades = async () => {
    try {
      const response = await axios.get(
        "https://edu-track-dusky.vercel.app/marks/getGrades",
        {
          params: {
            id: sessionStorage.getItem("id"),
          },
        }
      );
      const updatedRowData = response.data.map((grade) => ({
        ...grade, 
        percentage: calculatePercentage(grade.maxMarks, grade.scoredMarks),
      }));
      setRowData(updatedRowData);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [RemoveMode, setRemoveMode] = useState(false);
  const setMode = () => {
    setRemoveMode(!RemoveMode);
    console.log(RemoveMode);
  };
  const onSelectionChanged = (e) => {
    if (RemoveMode) {
      const selectedRow = e.api.getSelectedRows();
      console.log(selectedRow)
      if (selectedRow.length > 0) {
        const selectedId = selectedRow[0]._id;
        handleRemoveGrade(selectedId);
        e.api.deselectAll();
      }
    }
  };
  
  const handleRemoveGrade = async (id) => {
    try {
      await axios.post("https://edu-track-dusky.vercel.app/marks/removeGrade", {
        gradeId: id,
        id: sessionStorage.getItem("id"),
      });
      setRowData((prevData) => prevData.filter((grade) => grade._id !== id));
    } catch (error) {
      console.error("Error removing grade:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const Value =
      name === "maxMarks" || name === "scoredMarks" ? parseFloat(value) : value;

    setNewGrade((prevState) => ({
      ...prevState,
      [name]: Value,
    }));
  };

  const handleAddGrade = async () => {
    try {
      const response = await axios.post(
        "https://edu-track-dusky.vercel.app/marks/addGrade",
        { marks: newGrade, id: sessionStorage.getItem("id") }
      );
      console.log(response.data);
      const updatedRowData = {
       ...response.data,
        percentage: calculatePercentage(
          newGrade.maxMarks,
          newGrade.scoredMarks
        ),
      };

      setRowData((prevData) => [...prevData, updatedRowData]);
      console.log(rowData); 

      setIsModalOpen(false);
      setNewGrade({
        subject: "",
        testType: "",
        maxMarks: 0,
        scoredMarks: 0,
      });
      setRemoveMode(false);

    } catch (error) {
      console.error("Error adding grade:", error);
    }
  };

  return (
    <div className="grade-tracker-container">
      <div className="grade-tracker-heading">
        <h1>GRADE TRACKER</h1>
      </div>
      <div className="Grade-container">
        <div className="Grade-Box1">
          <div className="Grade-UserInfo">
            <img src={UserImage} alt="User" className="Grade-user-image" />
            <span className="Grade-username">
              {sessionStorage.getItem("name")}{" "}
            </span>
            <img src={UniImage} alt="User" className="Grade-user-image" />
            <span className="Grade-username">Chitkara University</span>
            <img src={degree} alt="User" className="Grade-user-image" />
            <span className="Grade-username">Computer Science</span>
            <img src={id} alt="User" className="Grade-user-image" />
            <span className="Grade-username">{sessionStorage.getItem("clg_id")}{" "}</span>
          </div>
        </div>
        <div className="Grade-Box2">
          <div className="Grade-Heading">
            <button className="button-30" onClick={openModal}>
              Add Data
            </button>
            <button className="button-30" onClick={setMode}>
              {RemoveMode ? "Select Row to remove" : "Remove"}
            </button>
          </div>
          <hr className="grade-hr" />
          <div
            className="ag-theme-quartz"
            style={{
              height: "300px",
              width: "auto",
            }}
          >
            <AgGridReact
              defaultColDef={{ resizable: true }}
              rowData={rowData}
              columnDefs={columnDefs}
              onFirstDataRendered={onFirstDataRendered}
              onGridSizeChanged={onGridSizeChanged}
              rowSelection="single"
              onSelectionChanged={onSelectionChanged}
            />
          </div>

          <hr className="grade-hr" />
          <Modal
            className={" "}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Add Grade Modal"
          >
            <h2 className="Grade-h2">Add Grade</h2>
            <form className="Grade-form">
              <div className="Grade-form-group">
                <label htmlFor="subject" className="Grade-label">
                  Subject:
                </label>
                <select
                  className="Grade-input"
                  id="subject"
                  name="subject"
                  value={newGrade.subject}
                  onChange={handleInputChange}
                >
                  <option value="">Select Subject</option>
                  <option value="DSA">DSA</option>
                  <option value="WEB">JAVA</option>
                  <option value="NALR">NALR</option>
                  <option value="CLOUD">ENGLISH</option>
                  <option value="IP">WDMS</option>
                </select>
              </div>
              <div className="Grade-form-group">
                <label htmlFor="testType" className="Grade-label">
                  Test Type:
                </label>
                <select
                  id="testType"
                  name="testType"
                  value={newGrade.testType}
                  onChange={handleInputChange}
                  className="Grade-input"
                >
                  <option value="">Select Test Type</option>
                  <option value="ST1">ST1</option>
                  <option value="ST2">ST2</option>
                  <option value="ST3">ST3</option>
                  <option value="ETE">ETE</option>
                  <option value="FA1">FA1</option>
                  <option value="FA2">FA2</option>
                </select>
              </div>

              <div className="Grade-form-group">
                <label htmlFor="maxMarks" className="Grade-label">
                  Max Marks:
                </label>
                <input
                  className="Grade-input"
                  type="number"
                  id="maxMarks"
                  name="maxMarks"
                  value={newGrade.maxMarks}
                  onChange={handleInputChange}
                />
              </div>
              <div className="Grade-form-group">
                <label htmlFor="scoredMarks" className="Grade-label">
                  Scored Marks:
                </label>
                <input
                  className="Grade-input"
                  type="number"
                  id="scoredMarks"
                  name="scoredMarks"
                  value={newGrade.scoredMarks}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="button"
                className="button-30"
                onClick={handleAddGrade}
              >
                Add Grade
              </button>
            </form>
          </Modal>
        </div>
      </div>
      <BarChart
      series={[
        { data: [35, 44, 24, 34] },
        { data: [51, 6, 49, 30] },
        { data: [15, 25, 30, 50] },
        { data: [60, 50, 15, 25] },
      ]}
      height={290}
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
    </div>
  );
}

export default GradeTracker;
