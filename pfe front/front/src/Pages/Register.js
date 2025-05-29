import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import '../PagesStyle/Register.css';
import { FaUser, FaMobileAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import logo2 from '../Images/med2.png';


function Registre() {
  
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [num, setnum] = useState("");
    const [genre, setgenre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupError, setSignupError] = useState(false);
    const [emailError, setemailError] = useState(false);
    const [passwordError, setpasswordError] = useState(false);
    const navigate = useNavigate();

    const sendConfirmationEmail = async () => {
      try {
        const response = await axios.post("http://localhost:8080/user/sendemail", `"${email}"`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 200) {
          console.log("Confirmation email sent successfully");
        } else {
          console.error("Failed to send confirmation email");
        }
      } catch (error) {
        console.error("Error sending confirmation email:", error);
      }
    };
    
    async function save(event) {
      event.preventDefault();
      try {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        
        if (!firstName || !lastName || !num || !genre || !email || !password ) {
          console.log("Veuillez remplir tous les champs");
          setSignupError(true);
          setemailError(false);
          setpasswordError(false);
        } else if (!emailPattern.test(email)) {
          console.log("Format d'email invalide");
          setSignupError(false);
          setpasswordError(false);
          setemailError("Format d'email invalide");
        } else if (!passwordPattern.test(password)) {
          setSignupError(false);
          setemailError(false);
          setpasswordError("Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre");
        } else {
          const requestData = {
            nom: firstName,
            prenom: lastName,
            numero: num,
            genre: genre,
            email: email,
            password: password,
          };
    
          await axios.post("http://localhost:8080/user/RegisterM", requestData);
          sendConfirmationEmail(); 
          navigate('/login');
        }
      } catch (err) {
        console.error("Erreur lors de l'inscription:", err);
        setSignupError(true);
        alert("Erreur lors de l'inscription: " + err.message);
        console.log(err.response);
      }
    }
    
    return (
      <div className="sign-container">
      <br/><br/><br/><div className="form-container-wrapper">
        <div className="form2-container">
        <h2>
          <Link to="/login" className="">
            Connexion
          </Link>
          &nbsp;&nbsp;&nbsp;
          <Link to="/register" className="log">
            Inscription
          </Link>
        </h2>
        <hr style={{ width: '345px', marginLeft:'-20px'}}></hr>
        <form className="form-signup">
        <div style={{ textAlign: 'center' }}>
          <b className="bold-text"><i>Merci de saisir vos informations</i></b>
        </div>
          <div className="form-group">
              <div>
                <input type="radio" id="homme" name="genre" value="homme" checked={genre === "homme"} onChange={(event) => setgenre(event.target.value)} />
              </div>
              <div>
                <label htmlFor="homme">Homme</label>
              </div>
              <div>
                <input type="radio"  id="femme"  name="genre"  value="femme"  checked={genre === "femme"}   onChange={(event) => setgenre(event.target.value)} />
              </div>
              <div>
                <label htmlFor="femme">Femme</label>
              </div>
            </div>

            <div className="form-group" >
              <FaUser className="input-icon" />
              <input
                type="text"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="firstName"
                placeholder="Nom"
                value={firstName}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="lastName"
                placeholder="Prénom"
                value={lastName}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaMobileAlt className="input-icon" />
              <input
                type="number"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''}`}
                id="num"
                placeholder="Numéro du mobile"
                value={num}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setnum(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''} ${emailError ? 'is-invalid' : ''}`}
                id="email"
                placeholder="Adresse email"
                value={email}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                className={`signup__input form-control ${signupError ? 'is-invalid' : ''} ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Mot de passe"
                value={password}
                style={{ width: '300px', marginLeft: '10px' }}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setpasswordError(false)}
            />
            </div>    

                <button type="submit" className="sign-button" onClick={save}>Save </button><br/>
                {signupError && (
                <i><p className="error-message" style={{color:'red',fontSize:'18px' , textAlign:'center', marginLeft:'40px'}}>Veuillez remplir tous les champs !</p></i>
                )}
                {emailError && (
                  <i><p className="error-message" style={{color:'red',fontSize:'18px' , textAlign:'center', marginLeft:'30px'}}>Format d'email invalide !</p></i>
                )}
                {passwordError && (
                 <i> <p className="error error-message" style={{color:'red',fontSize:'18px' , textAlign:'center', marginLeft:'10px'}}>Format de mot de passe invalide !</p></i>
                )}

          </form>
          </div>
          <div className="form3-container">
          <div className="logo-text-container">
            <img src={logo2} alt="Logo" className="logo" />
            <div className="form-text">
            <h2 style={{ fontSize: "30px" }}>
              Créer un Nouveau Compte<br/>
              <span style={{ fontSize: "18px" }}>
                Remplissez le formulaire ci-dessous pour vous inscrire et accéder à votre compte. Les informations fournies seront utilisées pour personnaliser votre expérience. Merci de fournir des informations exactes et complètes.
              </span>
            </h2>
          </div>

          </div>
          </div>
          </div>
    </div>
        
    );
  }
  
  export default Registre;