import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import addAlarmIcon from "../assets/addAlarmIcon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./employeeDashboard.css"; 
import "./editTimesheet.css"

export default function EditTimesheetPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { timesheet } = location.state; 
    const [hours, setHours] = useState(timesheet.hours);
    const [editingDate, setEditingDate] = useState(null);
    const [inputValue, setInputValue] = useState("");


    const handleSaveHours = () => {
        const updatedHours = hours.map((entry) =>
            entry.date === editingDate ? { ...entry, hoursWorked: inputValue } : entry
        );
        setHours(updatedHours);
        setEditingDate(null);
        setInputValue("");
    };

    const handleIncrement = () => {
        let [hr, min] = inputValue.split(":").map(Number);
        if (!isNaN(hr) && !isNaN(min)) {
            min += 60;
            if (min >= 60) {
                min = 0;
                hr += 1;
            }
            setInputValue(`${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
        }
    };

    const handleDecrement = () => {
        let [hr, min] = inputValue.split(":").map(Number);
        if (!isNaN(hr) && !isNaN(min)) {
            min -= 15;
            if (min < 0) {
                min = 45;
                hr = Math.max(0, hr - 1);
            }
            setInputValue(`${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/timesheet/supervisor/timesheets/update`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        timesheetId: timesheet._id,
                        hours,
                    }),
                }
            );

            if (response.ok) {
                alert("Timesheet updated successfully!");
                navigate(-1); // Go back to the previous page
            } else {
                alert("Failed to update timesheet.");
            }
        } catch (err) {
            console.error("Error saving timesheet:", err);
        }
    };



    return (
        <div className="dashboard-container">
            <h2>Edit Timesheet</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Edit Hours</th>
                        <th>Hours Worked</th>
                    </tr>
                </thead>
                <tbody>
                    {hours.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{new Date(entry.date).toLocaleDateString("en-US", { weekday: "long" })}</td>
                            <td>
                                {editingDate === entry.date ? (
                                    <div className="action-buttons">
                                        <div className="time-controls">
                                            <div className="time-input-wrapper">
                                                <button
                                                    className="increment-btn"
                                                    onClick={handleIncrement}
                                                    aria-label="Increment Time"
                                                >
                                                    ▲
                                                </button>
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    placeholder="HH:MM"
                                                    aria-label="Time Input"
                                                />
                                                <button
                                                    className="decrement-btn"
                                                    onClick={handleDecrement}
                                                    aria-label="Decrement Time"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSaveHours}
                                            className="btn btn-primary save-btn"
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <img
                                        src={addAlarmIcon}
                                        alt="Edit Hours"
                                        className="clock-icon"
                                        onClick={() => {
                                            setEditingDate(entry.date);
                                            setInputValue(entry.hoursWorked || "");
                                        }}
                                    />
                                )}
                            </td>
                            <td>{entry.hoursWorked || "--:--"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-center mt-4 edit-btns">
                <button onClick={handleSave} className="btn btn-primary btn-lg ">
                    Save Changes
                </button>
                <button
                    className="btn btn-secondary btn-lg "
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>


            </div>
        </div>
    );
}
