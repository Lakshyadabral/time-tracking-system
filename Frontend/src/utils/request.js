const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Auth
export async function login(employeeId, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
        credentials: "include",
    });
    return response.json();
}

//  Employee Dashboard
export async function fetchDashboard(employeeId) {
    const response = await fetch(`${BASE_URL}/dashboard/${employeeId}`, {
        credentials: "include",
    });
    return response.json();
}

// Supervisor Dashboard (list view)
export async function fetchSupervisorDashboard(supervisorId) {
    try {
        const response = await fetch(`${BASE_URL}/supervisor/timesheets?supervisorId=${supervisorId}`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`Error fetching supervisor dashboard: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in fetchSupervisorDashboard:", error);
        throw error;
    }
}

// Supervisor Timesheet CRUD
export async function getSupervisorTimesheets(supervisorId) {
    const response = await fetch(`${BASE_URL}/supervisor/timesheets/${supervisorId}`, {
        credentials: "include",
    });
    return await response.json();
}

export async function toggleApproval(timesheetId) {
    const response = await fetch(`${BASE_URL}/supervisor/timesheets/toggle-approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timesheetId }),
        credentials: "include",
    });
    return response.json();
}

export async function bulkApprove(supervisorId) {
    const response = await fetch(`${BASE_URL}/supervisor/timesheets/approve-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId }),
        credentials: "include",
    });
    return response.json();
}

export async function sendToAdmin(supervisorId, timesheets) {
    const response = await fetch(`${BASE_URL}/supervisor/timesheets/send-to-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supervisorId, timesheets }),
        credentials: "include",
    });
    return response.json();
}


export async function getApprovedTimesheets() {
    const response = await fetch(`${BASE_URL}/admin/timesheets/approved`);
    return response.json();
}

export async function getEmployeeHours(employeeId) {
    const response = await fetch(`${BASE_URL}/api/get-hours/${employeeId}`);
    return response.json();
}

export async function saveEmployeeHours({ employeeId, date, hoursWorked }) {
    const response = await fetch(`${BASE_URL}/api/save-hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date, hoursWorked }),
    });
    return response.json();
}

export async function submitTimesheet({ employeeId, hours }) {
    const response = await fetch(`${BASE_URL}/timesheet/submit-timesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, hours }),
    });
    return response.json();
}
