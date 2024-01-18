import React, { useState } from 'react';
import './LoginSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';  // Import Axios for making HTTP requests

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', { username, password });
            // handle successful login, e.g., store the token in local storage or state
            console.log(response.data.token);
        } catch (error) {
            // handle login error, e.g., display an error message to the user
            console.error('Login failed:', error.message);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('/register', { username, password, email });
            // handle successful signup, e.g., redirect the user to the login page
            console.log(response.data);
            setAction("Login");  // switch to login after successful signup
        } catch (error) {
            // handle signup error, e.g., display an error message to the user
            console.error('Signup failed:', error.message);
        }
    };

    return (
        <div className='container'>
            <div className='form'>
                <div className='header'>
                    <div className='text'>{action}</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>
                    {action === 'Login' ? (
                        <div className='input'>
                            <FontAwesomeIcon className="input-icon" icon={faEnvelope} />
                            <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                        </div>
                    ) : (
                        <div className='input'>
                            <FontAwesomeIcon className="input-icon" icon={faEnvelope} />
                            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    )}

                    <div className='input'>
                        <FontAwesomeIcon className="input-icon" icon={faUser} />
                        <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className='input'>
                        <FontAwesomeIcon className="input-icon" icon={faLock} />
                        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                {action === 'Sign Up' ? <div></div> : <div className="forgot-password">Lost Password? <span>Click here</span></div>}

                <div className="submit-container">
                    <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={handleSignup}>Sign Up</div>
                    <div className={action === 'Sign Up' ? 'submit gray' : 'submit'} onClick={handleLogin}>Login</div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
