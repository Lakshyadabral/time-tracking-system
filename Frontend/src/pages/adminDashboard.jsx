import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";


export default function AdminDashboardPage({ loggedInUser }) {
    const [adminInfo, setAdminInfo] = useState(null); 
    const [approvedTimesheets, setApprovedTimesheets] = useState([]);
    const [flaggedRows, setFlaggedRows] = useState({});
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        // Check sessionStorage for existing admin info
        const storedAdminInfo = JSON.parse(sessionStorage.getItem("adminInfo"));

        if (!storedAdminInfo && loggedInUser?.role === "admin") {
            // Save admin info in sessionStorage for the current tab
            const info = {
                name: loggedInUser.name,
                role: loggedInUser.role,
                employeeId: loggedInUser.employeeId,
            };
            sessionStorage.setItem("adminInfo", JSON.stringify(info));
            setAdminInfo(info);
        } else if (storedAdminInfo) {
            // Load admin info from sessionStorage
            setAdminInfo(storedAdminInfo);
        } else {
            // Redirect if no valid admin info is found
            navigate("/login");
        }
    }, [loggedInUser]);

    useEffect(() => {
        const getApprovedTimesheets = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/timesheets/approved");
                if (!response.ok) {
                    throw new Error("Failed to fetch approved timesheets.");
                }
                const data = await response.json();
                setApprovedTimesheets(data);
            } catch (error) {
                console.error("Error fetching approved timesheets:", error);
            }
        };

        getApprovedTimesheets();
    }, []);

    const handleSendToPayroll = (timesheetId) => {
        console.log(`Timesheet ${timesheetId} sent to payroll.`); // For debug
        setShowPopup(true); // Show the popup
    };
    

    const handleFlag = (timesheetId) => {
        const reason = prompt("Why are you flagging this timesheet?"); // Prompt for a reason
        if (!reason) return; // If no reason is provided, don't flag
    
        setFlaggedRows((prevFlaggedRows) => {
            const updatedFlaggedRows = { ...prevFlaggedRows };
    
            if (updatedFlaggedRows[timesheetId]) {
                delete updatedFlaggedRows[timesheetId]; // Unflag if already flagged
            } else {
                updatedFlaggedRows[timesheetId] = reason; // Add the reason
            }
    
            console.log("Updated flaggedRows:", updatedFlaggedRows);
            return updatedFlaggedRows;
        });
    };



    const handlePrintTimesheet = (timesheet) => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Timesheet</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                        }
                        .timesheet-container {
                            border: 2px solid #000;
                            padding: 20px;
                            max-width: 800px;
                            margin: auto;
                        }
                        .header, .footer {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        .table th, .table td {
                            border: 1px solid #000;
                            padding: 8px;
                            text-align: left;
                        }
                        .table th {
                            background-color: #dbe4f1;
                        }
                        .highlight {
                            background-color: #e9f3ff;
                        }
                    </style>
                </head>
                <body>
                    <div class="timesheet-container">
                        <div class="header">
                            <h1>Timesheet for Casual and Auxiliary Hours</h1>
                            <p><strong>Employee Name:</strong> ${timesheet.employeeName || "N/A"} &nbsp;&nbsp;
                               <strong>Employee ID:</strong> ${timesheet.employeeId}</p>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Hours Worked</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${timesheet.hours.map((entry) => `
                                    <tr>
                                        <td>${entry.date}</td>
                                        <td>${entry.hoursWorked || "N/A"}</td>
                                        <td>${entry.details || "N/A"}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                        <div class="footer">
                            <p>Week Total: ${timesheet.totalHours || "N/A"} Hours</p>
                            <p>Generated on: ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    

 
 
    return (
        <div className="admin-dashboard-container">
            {/* Admin Info */}
            <div className="admin-info">
                <h2>Admin Information</h2>
                <div>
                    <p><strong>Name:</strong> {adminInfo?.name || "N/A"}</p>
                    <p><strong>Role:</strong> {adminInfo?.role || "N/A"}</p>
                    <p><strong>Admin ID:</strong> {adminInfo?.employeeId || "N/A"}</p>
                </div>
            
            </div>

            {/* Approved Timesheets Table */}
            <h2>Approved Timesheets</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Total Hours</th>
                        <th>Supervisor ID</th>
                        <th>Approved</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {approvedTimesheets.map((timesheet) => (
                        <tr    key={timesheet._id}
                        className={flaggedRows[timesheet._id] ? "flagged-row" : ""}
                        title={flaggedRows[timesheet._id] || ""} // Show reason as a tooltip
                
                        >

                            
                            <td>{timesheet.employeeId}</td>
                            <td>
                                {timesheet.hours.reduce((total, entry) => {
                                    const [hr, min] = entry.hoursWorked.split(":").map(Number);
                                    return total + hr * 60 + min;
                                }, 0) / 60} hr
                            </td>
                            <td>{timesheet.supervisorId}</td>
                            <td>{timesheet.hours.every((entry) => entry.approved) ? "Yes" : "No"}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleSendToPayroll(timesheet._id)}
                                >
                                    Send to Payroll
                                </button>
                                <button
                            className={`btn btn-sm ${flaggedRows[timesheet._id] ? "btn-danger" : "btn-warning"} me-2`}
                            onClick={() => handleFlag(timesheet._id)}
                        >
                            {flaggedRows[timesheet._id] ? "Unflag" : "Flag"}
        </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handlePrintTimesheet(timesheet)}
                                >
                                    Print Timesheet
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flagged-count">
    <p>
        Total Flagged Rows: <span className="badge bg-danger">{Object.keys(flaggedRows).length}</span>
    </p>
</div>

               {/* Popup */}
               {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Timesheet Sent!</h3>
                        <p>The timesheet has been successfully sent to payroll.</p>
                        <button className="btn btn-primary" onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
