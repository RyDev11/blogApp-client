import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

export default function Register() {
    const { user } = useContext(UserContext);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            username.trim() !== "" &&
            email.trim() !== "" &&
            email.includes("@") &&
            password.length >= 8 &&
            confirmPassword.length >= 8 &&
            password === confirmPassword
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [username, email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === "Registered Successfully") {
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                notyf.success("Registration successful!");
                navigate("/login");
            } else {
                notyf.error(data.error || "Something went wrong");
            }
        })
        .catch(err => {
            console.error("Registration error:", err);
            notyf.error("An error occurred. Please try again.");
        });
    }

    return user.id !== null ? (
        <Navigate to="/login" />
    ) : (
        <div className="auth-page d-flex justify-content-center align-items-center my-5">
            <div className="auth-container register shadow-lg p-4 rounded">
                <Form onSubmit={registerUser}>
                    <h2 className="mb-4 text-center">Register</h2>

                    <Form.Group className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username" 
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Enter password (min. 8 characters)" 
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Confirm password" 
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button 
                        variant={isActive ? "primary" : "danger"} 
                        type="submit" 
                        className="w-100"
                        disabled={!isActive}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}
