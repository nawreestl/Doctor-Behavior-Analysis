import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../PagesStyle/Login.css';
import Modal from 'react-modal';
import { FaEnvelope, FaLock } from 'react-icons/fa'; 
import logo2 from '../Images/med2.png';

Modal.setAppElement('#root');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const adminId = localStorage.getItem('adminId');
    const medecinId = localStorage.getItem('medecinId');

    if (userType === 'Admin' && adminId) {
      navigate('/admin-home');
    } else if (userType === 'Medecin' && medecinId) {
      navigate('/medecin-home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const user = response.data[0];
        localStorage.setItem('userType', user.medecin ? 'Medecin' : 'Admin');
        localStorage.setItem('userId', user ? user.id : '');

        localStorage.setItem('useremail', user ? user.email : '');
        localStorage.setItem('userpassword', user ? user.password : '');
      
        if (user.admin) {
          const { id, nom, prenom, numero } = user.admin;
          localStorage.setItem('adminid', id || '');
          localStorage.setItem('adminNom', nom || '');
          localStorage.setItem('adminPrenom', prenom || '');
          localStorage.setItem('adminnum', numero || '');
        }
        
        if (user.medecin) {
          const { id, nom, prenom, numero, genre } = user.medecin;
          localStorage.setItem('medecinId', id || '');
          localStorage.setItem('medecinnom', nom || '');
          localStorage.setItem('medecinprenom', prenom || '');
          localStorage.setItem('medecinnum', numero || '');
          localStorage.setItem('medecingenre', genre || '');
        }
      
        setLoginSuccess(true);
        setTimeout(() => {
          if (user.admin) {
            navigate('/admin-home');
          } else if (user.medecin) {
            navigate('/medecin-home');
          }
        }, 800);
      } else if (response.status === 204) {
        console.log("User doesn't exist!");
        setLoginError(true);
      } else {
        setLoginError(true);
        console.error('Login failed. Response data:', response.data);
      }
    } catch (error) {
      setLoginError(true);
      console.error('Error during login:', error.message);
    }
  };

  return (
    <div className="login-container">
      
    <br/><br/><br/>
    
    <div className="form-container-wrapper">
    <div className="form-container">
          <div className="logo-text-container">
            <img src={logo2} alt="Logo" className="logo" />
            <div className="form-text">
              <h2 style={{ fontSize: "30px" }}>Bienvenue! Veuillez vous connecter pour accéder à votre compte.</h2>
            </div>
          </div>
        </div>
      <div className="form4-container">
      <h2>
        <Link to="/login" className="log">
          Connexion
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/register" className="">
          Inscription
        </Link>
      </h2>
      <hr style={{ width: '340px', marginLeft:'-20px'}}></hr>
        <form onSubmit={handleLogin}>
          <div>
          <i><label htmlFor="login" style={{marginLeft:"30px"}}>Adresse email</label></i>
          <div className="input-with-icon">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            id="email"
            placeholder="Adresse email"
            className={`login__input form-control ${loginError ? 'is-invalid' : ''}`}
            value={email}
            style={{ width: '270px', marginLeft: '10px', display: 'inline-block' }}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError(false);
            }}
          />
        </div>


            <i><label htmlFor="password" style={{marginLeft:"30px"}}>Mot de passe</label></i>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="Mot de passe"
                className={`login__input form-control ${loginError ? 'is-invalid' : ''}`}
                style={{ width: '270px', marginLeft: '10px', display: 'inline-block' }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
              />
            </div>
          </div>

          <i><p style={{fontSize:'16px', color:'black'}}>
            <label>
              <input type='checkbox' /> Se souvenir de moi sur cet appareil
            </label>
          </p></i>

          <div className="links">
            <button type="submit" className={`login-button ${loginSuccess ? 'move-animation' : ''}`}>Se connecter</button>
            
          </div><br/>{loginError && (
                   <p className="error-message" style={{color:'red',fontSize:'16px' ,textAlign:'center', marginLeft:'40px' }}>Email ou mot de passe incorrects. Veuillez réessayer.</p>
                  )}
        
      <a href className="signup__forgot" style={{textAlign:'center', marginLeft:'20px' }}>Vous avez perdu votre mot de passe ?</a><br/>
      </form>
      </div>
</div>

    </div>
  );
}; 

export default Login;
