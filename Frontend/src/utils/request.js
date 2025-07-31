const BASE_URL = "http://localhost:3000";

export async function login(employeeId, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
    });
    return response.json();
}

export async function fetchDashboard(employeeId) {
    const response = await fetch(`${BASE_URL}/dashboard/${employeeId}`);
    return response.json();
}

export async function fetchSupervisorDashboard(supervisorId) {
    const BASE_URL = "http://localhost:3000";
    try {
        const response = await fetch(`${BASE_URL}/supervisor/timesheets?supervisorId=${supervisorId}`);
        if (!response.ok) {
            throw new Error(`Error fetching supervisor dashboard: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in fetchSupervisorDashboard:", error);
        throw error;
    }
}
