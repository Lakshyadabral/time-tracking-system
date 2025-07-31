import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./supervisorDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./employeeDashboard.css";

export default function SupervisorDashboardPage({ loggedInUser }) {
    const [supervisorInfo, setSupervisorInfo] = useState(null); // Store supervisor info
    const [employeeTimesheets, setEmployeeTimesheets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedSupervisorId = sessionStorage.getItem("supervisorId");

        if (!storedSupervisorId && loggedInUser?.role === "supervisor") {
            // Save supervisor info for the current session
            sessionStorage.setItem("supervisorId", loggedInUser.employeeId);
            setSupervisorInfo(loggedInUser); // Store all logged-in user details
        } else if (storedSupervisorId) {
            setSupervisorInfo({
                name: loggedInUser?.name || "N/A",
                role: "supervisor",
                employeeId: storedSupervisorId,
            });
        } else {
            navigate("/login");
        }
    }, [loggedInUser, navigate]);

    useEffect(() => {
        const getTimesheets = async () => {
            try {
                if (supervisorInfo?.employeeId) {
                    const response = await fetch(
                        `http://localhost:3000/supervisor/timesheets/${supervisorInfo.employeeId}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch timesheets.");
                    }
                    const data = await response.json();

                    const timesheetsWithTotalHours = data.timesheets.map((timesheet) => {
                        const totalHoursInMinutes = timesheet.hours.reduce((acc, entry) => {
                            const [hours, minutes] = entry.hoursWorked
                                ? entry.hoursWorked.split(":").map(Number)
                                : [0, 0];
                            return acc + hours * 60 + minutes;
                        }, 0);

                        const hours = Math.floor(totalHoursInMinutes / 60);
                        const minutes = totalHoursInMinutes % 60;
                        const totalHours = `${hours}:${minutes.toString().padStart(2, "0")}`;
                        return {
                            ...timesheet,
                            totalHours,
                        };
                    });

                    setEmployeeTimesheets(timesheetsWithTotalHours);
                }
            } catch (error) {
                console.error("Error fetching timesheets:", error);
            }
        };

        getTimesheets();
    }, [supervisorInfo]);
    const toggleApproval = async (timesheetId, currentApproval) => {
        try {
            const response = await fetch(
                "http://localhost:3000/supervisor/timesheets/toggle-approve",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timesheetId, approved: !currentApproval }),
                }
            );

            if (response.ok) {
                const updatedTimesheets = employeeTimesheets.map((timesheet) =>
                    timesheet._id === timesheetId
                        ? {
                              ...timesheet,
                              hours: timesheet.hours.map((entry) => ({
                                  ...entry,
                                  approved: !currentApproval,
                              })),
                          }
                        : timesheet
                );
                setEmployeeTimesheets(updatedTimesheets);
            } else {
                alert("Failed to update approval status.");
            }
        } catch (err) {
            console.error("Error toggling approval:", err);
        }
    };

    const handleApproveAll = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/supervisor/timesheets/approve-all",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ supervisorId: loggedInUser.employeeId }),
                }
            );

            if (response.ok) {
                const updatedTimesheets = employeeTimesheets.map((timesheet) => ({
                    ...timesheet,
                    hours: timesheet.hours.map((entry) => ({ ...entry, approved: true })),
                }));
                setEmployeeTimesheets(updatedTimesheets);
                alert("All timesheets approved successfully!");
            } else {
                alert("Failed to approve all timesheets.");
            }
        } catch (err) {
            console.error("Error approving all timesheets:", err);
        }
    };

    const handleSendToAdmin = async () => {
        try {
            const approvedTimesheets = employeeTimesheets.filter((timesheet) =>
                timesheet.hours.every((entry) => entry.approved)
            );

            const response = await fetch(
                "http://localhost:3000/supervisor/timesheets/send-to-admin",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        supervisorId: loggedInUser.employeeId,
                        timesheets: approvedTimesheets,
                    }),
                }
            );

            if (response.ok) {
                alert("Approved timesheets sent to Admin successfully!");
            } else {
                alert("Failed to send approved timesheets to Admin.");
            }
        } catch (err) {
            console.error("Error sending approved timesheets to Admin:", err);
        }
    };

    return (
        <div className="supervisor-dashboard-container">
            <div className="employee-info">
                <h2>Supervisor Information</h2>
                <div>
                    <p>
                        <strong>Name:</strong> {loggedInUser.name || "N/A"}
                    </p>
                    <p>
                        <strong>Role:</strong> {supervisorInfo?.role}
                    </p>
                    <p>
                        <strong>Supervisor ID:</strong> {supervisorInfo?.employeeId}
                    </p>
                </div>
            </div>

            <h2>Employee Timesheets</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Total Hours</th>
                        <th>Actions</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeTimesheets.map((timesheet) => (
                        <tr key={timesheet._id}>
                            <td>{timesheet.employeeId}</td>
                            <td>{timesheet.totalHours || "--:--"} hr</td>
                            <td>
                                <button
                                    className={`btn ${
                                        timesheet.hours.every((entry) => entry.approved)
                                            ? "btn-danger"
                                            : "btn-success"
                                    } btn-sm`}
                                    onClick={() =>
                                        toggleApproval(
                                            timesheet._id,
                                            timesheet.hours.every((entry) => entry.approved)
                                        )
                                    }
                                >
                                    {timesheet.hours.every((entry) => entry.approved)
                                        ? "Unapprove"
                                        : "Approve"}
                                </button>
                                <button
                                    className="btn btn-primary btn-sm ms-2"
                                    onClick={() =>
                                        navigate("/edit-timesheet", { state: { timesheet } })
                                    }
                                >
                                    Edit
                                </button>
                            </td>
                            <td>
                                {timesheet.hours.every((entry) => entry.approved) ? "Yes" : "No"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="actions text-center mt-4">
                <button className="btn btn-success me-3" onClick={handleApproveAll}>
                    Approve All
                </button>
                <button className="btn btn-primary" onClick={handleSendToAdmin}>
                    Send All Approved to Admin
                </button>
            </div>
        </div>
    );
}
