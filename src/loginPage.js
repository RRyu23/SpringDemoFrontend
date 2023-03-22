import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleLogin(event) {
        setShowRegisterModal(false);
    }

    function handleRegister() {
        setShowRegisterModal(true);
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const body = {
            "name": username,
            "email": email,
            "hashpw": password
        }
        console.log(body)
        await fetch('http://localhost:8080/api/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
            body: JSON.stringify(body),
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Please try again");
            }
            return response.json()
        }).then((data)=>{
            localStorage.setItem("customerId", data.body.id)
            localStorage.setItem("token", data.body.token)
            console.log(localStorage.getItem("customerId"))
            console.log(localStorage.getItem("token"))
            navigate('/transactions')
        })

    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        const body = {
            "email": username,
            "hashpw": password,
        }
        console.log(body);
        await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
            body: JSON.stringify(body),
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Please try again!");
            }
            return response.json();
        }).then((data)=>{
            localStorage.setItem('token', data.body.token);
            localStorage.setItem('customerId', data.body.customerId);
            navigate('/transactions');
        })

        // Call your backend API to handle the login request
    }

    return (
        <div>
            {showRegisterModal ? (
                <div>
                    <h2>Register</h2>
                    <form onSubmit={handleRegisterSubmit}>
                        <label>
                            Email:
                            <input type="email" value={email} onChange={handleEmailChange} required />
                        </label>
                        <br />
                        <label>
                            Name:
                            <input type="text" value={username} onChange={handleUsernameChange} required />
                        </label>
                        <br />
                        <label>
                            Password:
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                        </label>
                        <br />
                        <button type="submit">Register</button>
                        <button type="button" onClick={handleLogin}>Log In</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Log in</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={handleUsernameChange} required />
                        </label>
                        <br />
                        <label>
                            Password:
                            <input type="password" value={password} onChange={handlePasswordChange} required />
                        </label>
                        <br />
                        <button type="submit">Log In</button>
                        <button type="button" onClick={handleRegister}>Register</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default LoginPage;
