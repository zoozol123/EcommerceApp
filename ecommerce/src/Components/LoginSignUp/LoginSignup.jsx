import React, { useState } from 'react'
import './LoginSignup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

const LoginSignup = () => {
    const [action, setAction] = useState("Login"); // Domyślnie ustawione na "Login"

  const handleSubmit = async (e) => {
    //e.preventDefault();

    // Tutaj możesz dodać logikę wysyłania danych do backendu w zależności od wartości 'action'
    const formData = {
      // Dane formularza
    };

    const url = action === 'Login' ? '/login' : '/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Tutaj obsłuż odpowiedź po zalogowaniu lub zarejestrowaniu
        console.log(`Użytkownik ${action === 'Login' ? 'zalogowany' : 'zarejestrowany'}`);
      } else {
        // Tutaj obsłuż błędy, np. wyświetl komunikat o nieudanej próbie logowania/rejestracji
        console.error(`Błąd podczas ${action === 'Login' ? 'logowania' : 'rejestracji'}`);
      }
    } catch (error) {
      console.error('Błąd połączenia:', error);
    }
  };

  return (
    <div className='container'>
        <div className='form'>
              <div className='header'>
              <div className='text'>
                  {action === 'Login' ? 'Logowanie' : action === 'signup' ? 'Rejestracja' : 'Rejestracja'}
              </div>
              <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action ==='Login'?<div></div>:<div className='input'>
                <FontAwesomeIcon className="input-icon" icon={faEnvelope} />
                 <input type="email" placeholder='Email'/>
                </div>}

                <div className='input'>
                <FontAwesomeIcon  className="input-icon" icon={faUser} />
                 <input type="text" placeholder='Nazwa użytkownika'/>
                </div>
                
                <div className='input'>
                <FontAwesomeIcon className="input-icon" icon={faLock} />
                 <input type="password" placeholder='Hasło'/>
                </div>
            </div>

            {action ==='Sign Up'?<div></div>: <div className="forgot-password">Lost Password? <span>Click here</span></div>}

           

            <div className="submit-container">
                <div className={action==='Login'?'submit gray':'submit'} onClick={()=>{setAction("Sign Up"); handleSubmit();}}>Sign Up</div>
                <div className={action==='Sign Up'?'submit gray':'submit'} onClick={()=>{setAction("Login"); handleSubmit();}}>Login</div>

            </div>
        </div>
    </div>
  )
}

export default LoginSignup
