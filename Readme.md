# Time Tracking System

The **Time Tracking System** is designed to efficiently manage employee timesheets. The system allows employees to submit and edit their work hours, supervisors to review and approve timesheets, and admins to manage approved timesheets. With an intuitive interface and streamlined workflow, this application simplifies timesheet management for all user roles.

---


### Employees
- Submit weekly timesheets with daily work hours.
- Edit submitted hours before final submission.

### Supervisors
- View submitted timesheets.
- Approve or unapprove timesheets with a single click.
- Edit submitted hours for each employee.
- Approve all timesheets at once.
- Send all approved timesheets to the admin.

### Admins
- View approved timesheets received from supervisors.

---

## Prerequisites

Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- npm or yarn

---

## Setup Instructions

### Backend

1. Extract the zip file,
2. Install Dependencies 
- Npm Install
3. Seed the Database which is inside index.js
4. Start the backend server 
- nodemon app.js 


### Frontend 

1. Navigate to the Frontend Directory
- cd Frontend
2. Install Dependencies 
- Npm Install
3. Start the Frontend Server
- npm run dev

### Login Details
- Use the following credentials to log in:

### Employees

- Username: EMP001
Password: DefaultPassword123

### Supervisor

- Username: SUP001
Password: DefaultPassword123


- You can modify these credentials by updating the user database in MongoDB.

## Usage

- Roles and Responsibilities

## Employees:

Log in using your employee credentials.

Fill in your daily hours for the week and submit your timesheet.

You can edit your hours before submitting.

## Supervisors:

Log in using your supervisor credentials.

View submitted timesheets for all employees under your supervision.

Approve, unapprove, or edit timesheets.

Approve all timesheets at once and forward them to the admin.


## API Endpoints

- Auth

- POST /auth/loginLog in as an employee, supervisor

## Employee Timesheet

- POST /timesheet/submit-timesheetSubmit employee timesheets.

- GET /api/get-hours/:employeeIdFetch hours submitted by a specific employee.

## Supervisor Actions

- GET /supervisor/timesheets/:supervisorIdFetch all timesheets for a supervisor.

- PUT /supervisor/timesheets/toggle-approveToggle approval status of a timesheet.

- PUT /supervisor/timesheets/approve-allApprove all timesheets at once.

-  /supervisor/timesheets/send-to-adminSend approved timesheets to the admin.

## Troubleshooting

- Common Errors

- MongoDB connection issues:

- Ensure MongoDB is running locally or update the MONGO_URI in the .env file with your cloud database URL.



# Future Enhancements

Add user role management and detailed permissions.

Integrate email notifications for timesheet approvals.

Add filters and search options for timesheets.

Improve the dashboard UI with advanced analytics.



