import "./GradeTracker.css";
import UserImage from "/assets/User.png";
import UniImage from "/assets/university.png";
import degree from "/assets/degree.png";
import id from "/assets/Id.png";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { BarChart } from "@mui/x-charts/BarChart";

Modal.setAppElement("#root");
const API_URL = "https://edu-track-dusky.vercel.app/marks";

function GradeTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({
    subject: "",
    testType: "",
    maxMarks: 0,
    scoredMarks: 0,
  });
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

  const fetchGrades = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/getGrades`, {
        params: { id: sessionStorage.getItem("id") },
      });
      const updatedRowData = response.data.map((grade) => ({
        ...grade,
        percentage:
          grade.maxMarks === 0 ? 0 : ((grade.scoredMarks / grade.maxMarks) * 100).toFixed(2),
      }));
      setRowData(updatedRowData);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  }, []);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [RemoveMode, setRemoveMode] = useState(false);
  const setMode = () => {
    setRemoveMode(!RemoveMode);
  };
  const onSelectionChanged = (e) => {
    if (RemoveMode) {
      const selectedRow = e.api.getSelectedRows();
      if (selectedRow.length > 0) {
        const selectedId = selectedRow[0]._id;
        handleRemoveGrade(selectedId);
      }
    }
    else
        e.api.deselectAll();


  };

  const handleRemoveGrade = async (id) => {
    try {
      await axios.post(`${API_URL}/removeGrade`, {
        gradeId: id,
        id: sessionStorage.getItem("id"),
      });
      setRowData((prevData) => prevData.filter((grade) => grade._id !== id));
    } catch (error) {
      console.error("Error removing grade:", error);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewGrade((prevState) => ({
      ...prevState,
      [name]:
        name === "maxMarks" || name === "scoredMarks"
          ? parseFloat(value)
          : value,
    }));
  }, []);

  const handleAddGrade = useCallback(async () => {
    try {

      
      if (rowData.some(item => item.subject === newGrade.subject && item.testType === newGrade.testType)) {
        setIsModalOpen(false);

        alert("Grade already exists for the selected subject and test type");
        return; 
      }

      const response = await axios.post(`${API_URL}/addGrade`, {
        marks: newGrade,
        id: sessionStorage.getItem("id"),
        name:sessionStorage.getItem("name"),
        year:sessionStorage.getItem('year')
      });
      const updatedRowData = {
        ...response.data,
        percentage:
          newGrade.maxMarks === 0
            ? 0
            : ((newGrade.scoredMarks / newGrade.maxMarks) * 100).toFixed(2),
      };
      setRowData((prevData) => [...prevData, updatedRowData]);
      setIsModalOpen(false);
      setNewGrade({ subject: "", testType: "", maxMarks: 0, scoredMarks: 0 });
    } catch (error) {
      console.error("Error adding grade:", error);
    }
  }, [newGrade]);

  const resultArray = useMemo(() => {
    const result = [];
    rowData.forEach((item) => {
      const { subject, testType, scoredMarks } = item;
      let subjectObject = result.find((obj) => obj.Subject === subject);
      if (!subjectObject) {
        subjectObject = { Subject: subject };
        result.push(subjectObject);
      }
      subjectObject[testType] = scoredMarks;
    });
    return result;
  }, [rowData]);

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
            <span className="Grade-username">
              {sessionStorage.getItem("clg_id")}{" "}
            </span>
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
              pagination={true}
              paginationPageSize={5}
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
                  <option value="WEB">WEB</option>
                  <option value="NALR">NALR</option>
                  <option value="CLOUD">CLOUD</option>
                  <option value="IP">IP</option>
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
                  <option value="ETE">ETE</option>
                  <option value="FA">FA</option>
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
        dataset={resultArray}
        series={[
          { dataKey: "FA", label: "FA" },
          { dataKey: "ST1", label: "ST1" },
          { dataKey: "ST2", label: "ST2" },
          { dataKey: "ETE", label: "ETE" },
        ]}
        height={290}
        xAxis={[{ dataKey: "Subject", scaleType: "band" }]}
        margin={{ top: 40, bottom: 30, left: 40, right: 10 }}
      />
    </div>
  );
}

export default GradeTracker;
