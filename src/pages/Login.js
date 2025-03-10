import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    function authenticate(e) {
        e.preventDefault();
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.access) {
                localStorage.setItem("token", data.access);
                retrieveUserDetails(data.access);
                notyf.success("Successful login!");
            } else if (data.error === "No Email Found") {
                notyf.error("User not found. Try Again.");
            } else if (data.message === "Email and password do not match") {
                notyf.error("Incorrect Credentials. Please try again.");
            } else {
                notyf.error("An error occurred. Please try again later.");
            }
        })
        .catch(err => console.error("Login error:", err));
    }

    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setUser({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                    isAdmin: data.user.isAdmin
                });

                // Redirect based on role
                if (data.user.isAdmin) {
                    navigate("/dashboard");
                } else {
                    navigate("/profile");
                }
            } else {
                console.error("No user data found.");
            }
        })
        .catch(err => console.error("Error fetching user details:", err));
    }

    return user.id ? <Navigate to="/" /> : (
        <div className="auth-page d-flex justify-content-center align-items-center vh-100">
            <div className="auth-container shadow-lg p-4 rounded">
                <Form onSubmit={authenticate}>
                    <h2 className="mb-4 text-center">Login</h2>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter Email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter Password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button 
                        variant={isActive ? "primary" : "danger"} 
                        type="submit" 
                        className="w-100"
                        disabled={!isActive}
                    >
                        Log In
                    </Button>
                </Form>

                <p className="mt-3 text-center">
                    Don't have an account yet? <Link to="/register">Register here</Link>.
                </p>
            </div>
        </div>
    );
}
