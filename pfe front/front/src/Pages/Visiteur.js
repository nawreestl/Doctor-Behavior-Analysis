import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../PagesStyle/Visiteur.css';
import { useNavigate } from 'react-router-dom';
import bg2 from "../Images/bg2.png"
import logo2 from '../Images/med2.png';

Modal.setAppElement('#root');

const Home = () => {
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
  
  }, []);

 
  const handleLogin = () => {
    try {
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error('Error removing items from localStorage:', error);
    }
  };

  
  return (
    <div className="home2-container">
      <nav className="navbar">
        <div class="logo2-container" style={{marginRight:'1250px',marginTop:'-10px'}}>
        <img src={logo2} alt="Med Logo" style = {{width:'55px', borderRadius:'20%'}} class="logo"/>
        </div>
        <div className="header">
          <div className="navbar-buttons">
              <React.Fragment>
              <button className={`login3-animation ${isLoggedIn ? 'hidden' : ''}`} onClick={handleLogin}>
                Se connecter
              </button>
       
              </React.Fragment>
          </div>
        </div>
        
      </nav>
      <div className="content">
        <div> 
          <h1 style={{color:'#01244b', fontSize:'50px'}}>Explorez les tableaux de bord des médecins!</h1>
          <b style={{color:'#01244b', fontSize:'20px', marginLeft:'0px'}}> Découvrez notre tableau de bord interactif pour suivre en temps réel les comportements des médecins, facilitant ainsi des décisions éclairées pour une gestion efficace des ressources médicales</b>
        </div>
        <img src={bg2} className="image" alt="Background"></img>
      </div>

    </div>
  );
};

export default Home;
