import React, { useState } from 'react'
import './LoginSignup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const LoginSignup = () => {
    const [action, setAction] = useState("Login"); 
    const [email, setEmail] = useState("false");
    const [usernameMessage, setUsernameMessage] = useState("false");
    const [password, setPassword] = useState("false");
    const [incorrectLoginOrPassword, setincorrectLoginOrPassword] = useState("false");
    const [loginlOrEmailExists, setLoginOrEmailExists] = useState("false");
    const [emailCorrect, setEmailCorrect] = useState("false");

    const [formData, setFormData] = useState({
      email: "",
      username: "",
      password: ""
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    };

    const requestData = {
      email: formData.email,
      username: formData.username,
      password: formData.password
    };

    const requestLoginData = {
      username: formData.username,
      password: formData.password
    };

    const isFormFilled = () => {
      const requiredFields = action === 'Login' ? ['username', 'password'] : ['email', 'username', 'password'];
      return requiredFields.every(field => formData[field].trim() !== '');
    };

    const isEmailFilled = () => {
      return formData.email.trim() !== '';
    };

    const isUsernamelFilled = () => {
      return formData.username.trim() !== '';
    };

    const isPasswordFilled = () => {
      return formData.password.trim() !== '';
    };

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      return emailRegex.test(email);
    }

    const setFalse = () => {
      setEmail(false);
      setUsernameMessage(false);
      setPassword(false);
      setEmailCorrect(false);
      setLoginOrEmailExists(false);
      setincorrectLoginOrPassword(false);
    }

    const handleSubmit = async (e) => {
      const url = action === 'Login' ? '/login' : '/register';
    
      if (!isFormFilled()) {
        if(!isEmailFilled()) setEmail(true);
        if(!isUsernamelFilled()) setUsernameMessage(true);
        if(!isPasswordFilled()) setPassword(true);
        if(formData.email !== '') {
          if(!isValidEmail(formData.email)) setEmailCorrect(true);
        }
        return;
      }
      setFalse();

      try {
        let response = await axios.post(url, requestData);
        if(action === 'Login') {
          response = await axios.post(url, requestLoginData);        
        } else if (action === 'Register') {
          response = await axios.post(url, requestData);
        }
    
        if (response.status === 200 || response.status === 201) {
          console.log(`Użytkownik ${action === 'Login' ? 'zalogowany!' : 'zarejestrowany!'}`);
          setincorrectLoginOrPassword(false);
          setLoginOrEmailExists(false);
        } else {
          console.error(`Komunikat związany z ${action === 'Login' ? 'logowaniem' : 'rejestracją'}`);
          console.error('Status:', response.status);
          console.error('Odpowiedź serwera:', response.data);
        }
      } catch (error) {
        if(action === 'Login') {
          setincorrectLoginOrPassword(true);
        }
        if(action === 'Sign Up') {
          setLoginOrEmailExists(true);
        }

        console.error('Błąd połączenia:', error);
      }
      setFormData({
        email: "",
        username: "",
        password: ""
      });
    };

  return (
    <div className='container'>
        <div className='form'>
            <div className='header'>
              <div className='text'>
                  {action === 'Login' ? 'Logowanie' : 'Rejestracja'}
              </div>
              <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action ==='Login'?<div></div>:<div className='input'>
                <FontAwesomeIcon className="input-icon" icon={faEnvelope} />
                <input
                   type="email"
                   placeholder='Email'
                   name="email"
                   value={formData.email}
                   onChange={handleInputChange}
                 />
                </div>}
                {email ===true && action === 'Sign Up'?<div className='error-message'>Podaj email aby się zarejestrować.</div>: <div></div>}
                {emailCorrect ===true && action === 'Sign Up'?<div className='error-message'>Podany email jest niepoprawny!</div>: <div></div>}

                <div className='input'>
                <FontAwesomeIcon  className="input-icon" icon={faUser} />
                <input
                   type="text"
                   placeholder='Nazwa użytkownika'
                   name="username"
                   value={formData.username}
                   onChange={handleInputChange}
                 />
                </div>
                {usernameMessage ===true?<div className='error-message'>Podaj nazwę użytkownika aby się zarejestrować.</div>: <div></div>}
                
                <div className='input'>
                <FontAwesomeIcon className="input-icon" icon={faLock} />
                <input
                   type="password"
                   placeholder='Hasło'
                   name="password"
                   value={formData.password}
                   onChange={handleInputChange}
                 />
                </div>
                {password ===true?<div className='error-message'>Podaj hasło aby się zarejestrować.</div>: <div></div>}
                {incorrectLoginOrPassword ===true?<div className='error-message'>Podana nazwa użytkownika lub hasło są nieprawidłowe.</div>: <div></div>}
                {loginlOrEmailExists ===true?<div className='error-message'>Istnieje już konto o podanym email lub nazwie użytkownika.</div>: <div></div>}
            </div>


            {/*action ==='Sign Up'?<div></div>: <div className="forgot-password">Lost Password? <span>Click here</span></div>*/}

           

            <div className="submit-container">
                <div className={action==='Login'?'submit gray':'submit'} onClick={()=>{setAction("Sign Up"); setFalse(); }}>Rejestracja</div>
                <div className={action==='Sign Up'?'submit gray':'submit'} onClick={()=>{setAction("Login"); setFalse(); }}>Logowanie</div>
                <div className='submitButton' onClick={()=>{ setFalse(); handleSubmit(); }}>Zatwierdź</div>                 
            </div>
        </div>
    </div>
  )
}

export default LoginSignup
