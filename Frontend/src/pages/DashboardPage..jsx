import React, { useEffect, useState } from "react";
import { fetchDashboard } from "../utils/request";
import { useParams } from "react-router-dom";
import "./employeeDashboard.css";
import addAlarmIcon from "../assets/addAlarmIcon.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import { format, eachDayOfInterval } from "date-fns";




export default function DashboardPage() {
    const { employeeId } = useParams();

    const [userData, setUserData] = useState(null);
    const [hours, setHours] = useState({});
    const [editingDate, setEditingDate] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false); 


    const days = [
        { date: "01/17/2025", day: "Monday" },
        { date: "01/18/2025", day: "Tuesday" },
        { date: "01/19/2025", day: "Wednesday" },
        { date: "01/20/2025", day: "Thursday" },
        { date: "01/21/2025", day: "Friday" },
        { date: "01/22/2025", day: "Saturday" },
        { date: "01/23/2025", day: "Sunday" },
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchDashboard(employeeId);
                setUserData(data.user);

                const hoursResponse = await fetch(
                    `http://localhost:3000/api/get-hours/${employeeId}`
                );
                if (hoursResponse.ok) {
                    const { hours: fetchedHours } = await hoursResponse.json();
                    const formattedHours = {};
                    fetchedHours.forEach((entry) => {
                        formattedHours[entry.date] = entry.hoursWorked;
                    });
                    setHours(formattedHours);
                } else {
                    console.error("Failed to fetch hours");
                }
            } catch (err) {
                console.error(err);
                alert("Failed to fetch dashboard data");
            }
        };

        getData();
    }, [employeeId]);

    const updateDateRange = (start, end) => {
        if (start && end) {
            const range = eachDayOfInterval({ start, end }).map((date) => ({
                date: format(date, "yyyy-MM-dd"),
                day: format(date, "EEEE"),
            }));
            setDateRange(range);
        }
    };


    const handleIconClick = (date) => {
        setEditingDate(date);
        setInputValue(hours[date] || "");
    };

    const handleSaveHours = async (date) => {
        try {
            const response = await fetch("http://localhost:3000/api/save-hours", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, hoursWorked: inputValue, employeeId }),
            });

            if (response.ok) {
                setHours({ ...hours, [date]: inputValue });
                setEditingDate(null);
                setInputValue("");
                alert("Hours saved successfully!");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to save hours");
            }
        } catch (error) {
            console.error("Error saving hours:", error);
            alert("Failed to save hours");
        }
    };

    const handleCancel = () => {
        setEditingDate(null);
        setInputValue("");
    };

    const handleIncrement = () => {

        if (!inputValue || !inputValue.includes(":")) {
            setInputValue("00:00"); // Default to "00:00" if input is invalid
            return;
        }
        let [hours, minutes] = inputValue.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            minutes += 60; // Increment by 60 minutes
            if (minutes >= 60) {
                minutes = 0;
                hours += 1;
            }
            setInputValue(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
        }
    };
    
    const handleDecrement = () => {
        let [hours, minutes] = inputValue.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            minutes -= 15; // Decrement by 15 minutes
            if (minutes < 0) {
                minutes = 45;
                hours = Math.max(0, hours - 1); // Prevent negative hours
            }
            setInputValue(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
        }
    };
    


    const handleSubmit = async () => {
        const allHoursFilled = days.every(({ date }) => hours[date]);
        if (!allHoursFilled) {
            alert("Please fill all hours before submitting.");
            return;
        }

        setShowConfirmation(true); // Show confirmation popup
    };

    const confirmSubmit = async () => {
        try {

                    // Transform hours object into an array
                const formattedHours = Object.entries(hours).map(([date, hoursWorked]) => ({
                    date,
                    hoursWorked,
                    approved: false, // Default value
                }));

            const response = await fetch("http://localhost:3000/timesheet/submit-timesheet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId, hours: formattedHours }),
            });

            if (response.ok) {
                alert("Timesheet submitted successfully!");
                setShowConfirmation(false);
            } else {
                alert("Failed to submit timesheet.");
            }
        } catch (err) {
            console.error("Error submitting timesheet:", err);
            alert("Failed to submit timesheet.");
        }
    };

    const totalHours = Object.values(hours).reduce((acc, time) => {
        const [hr, min] = time.split(":").map(Number);
        return acc + hr * 60 + min;
    }, 0);

    const formatTotalHours = `${Math.floor(totalHours / 60)
        .toString()
        .padStart(2, "0")}:${(totalHours % 60).toString().padStart(2, "0")}hr`;

    if (!userData) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="dashboard-container">
            {/* Employee Information */}
            <div className="employee-info">
                <h2>Employee Information</h2>
                <div>
                    <p><strong>Name:</strong> {userData.name || "N/A"}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Employee ID:</strong> {userData.employeeId}</p>
                </div>
            </div>

            {/* Work Hours Table */}
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Add/Edit Hours</th>
                        <th>Hours Worked</th>
                    </tr>
                </thead>
                <tbody>
                    {days.map(({ date, day }) => (
                        <tr key={date}>
                            <td>{date}</td>
                            <td>{day}</td>
                            <td>
                           {editingDate === date ? (
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
        <button onClick={() => handleSaveHours(date)} className="btn btn-primary save-btn">
            {hours[date] ? "Edit" : "Add"}
        </button>
        <button className="btn btn-secondary cancel-btn" onClick={handleCancel}>
            Cancel
        </button>
    </div>
) : (
    <img
        src={addAlarmIcon}
        alt="Add Hours"
        className="clock-icon"
        onClick={() => handleIconClick(date)}
    />
)}


                            </td>
                            <td>{hours[date] || "--:--"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total Hours */}
            <div className="total-hours">Total hours: {formatTotalHours}</div>

            {/* Submit Button */}
            <div className="text-center mt-4">
                <button onClick={handleSubmit} className="btn btn-primary btn-lg">
                    Submit Timesheet
                </button>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
    <div className="confirmation-overlay">
        <div className="confirmation-popup">
            <h4 className="confirmation-title">Submit Timesheet</h4>
            <p>Are you sure you want to submit the timesheet? <br></br>Please review your hours.</p>
            <div className="popup-buttons">
                <button onClick={confirmSubmit} className="btn btn-primary">
                    Yes
                </button>
                <button onClick={() => setShowConfirmation(false)} className="btn btn-secondary">
                    No
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}
