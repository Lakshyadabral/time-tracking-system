import React, { useState } from "react";
import "./login.css"; 
import { useNavigate } from "react-router-dom";


function Login({ setLoggedInUser }) {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Sending login request with:", { employeeId, password });

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employeeId, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || "Login failed");
                return;
            }

            const data = await response.json(); // Fetching JSON response
            console.log("Login successful. Redirecting to:", data);

            // Save user to localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            setLoggedInUser(data.user);

            if (data.user.role === "employee") {
                navigate(`/dashboard/${data.user.employeeId}`); // Redirect to employee dashboard
            } else if (data.user.role === "supervisor") {
                navigate(`/supervisor-dashboard`); // Redirect to supervisor dashboard
            } else if (data.user.role === "admin") {
                navigate(`/admin-dashboard`); // Redirect to admin dashboard
            } else {
                alert("Unknown role. Unable to navigate.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee ID:</label>
                        <input
                            id="employeeId"
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

