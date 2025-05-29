import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../PagesStyle/Home.css';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/user.png';
import logo2 from '../Images/med2.png';
import bg from '../Images/bgr2.png';
import dec from '../Images/dec.png';
import homeLogo from '../Images/home.png';
import tabLogo from '../Images/tab.png';
import profileLogo from '../Images/user.png';
import ficheLogo from '../Images/fiche.png';
import pdf from '../Images/pdf.png';
import edit1 from '../Images/edit.png';
import edit2 from '../Images/edit.png';
import edit3 from '../Images/edit.png';
import edit4 from '../Images/edit.png';
import aa from '../Images/aa.png';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

 const url123 = "https://app.powerbi.com/view?r=eyJrIjoiMjFhMDM4MjAtNmExYS00MGM1LTg0NzgtMTY0YWE2YTI2YTAxIiwidCI6ImE2MmVlN2M0LWVkMmQtNDk5MS1iNGI4LTMxMjBlODMzM2UxMSJ9";
Modal.setAppElement('#root');

const Home = () => {
  const [medecinId, setMedecinId] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Accueil');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [userNom, setUserNom] = useState('');
  const [userPrenom, setUserPrenom] = useState('');
  const [usernum, setUsernum] = useState('');
  const [usergenre, setUsergenre] = useState('');
  const [useremail, setUseremail] = useState('');
  const [userpass, setUserpass] = useState('');
  const [editField, setEditField] = useState(null);
  const [showImageAAC, setShowImageAAC] = useState(true);
  const [fichesData, setFichesData] = useState([]);
  const [newFicheData, setNewFicheData] = useState({
    nom: '',
    prenom: '',
    datenaissance: '',
    genre: '',
    nationalité: '',
    typedemaladie: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const fetchData = useCallback(async () => {
    try {
      const medecinId = localStorage.getItem('medecinId');
      const medecinNom = localStorage.getItem('medecinnom');
      const medecinPrenom = localStorage.getItem('medecinprenom');
      const medecinnum = localStorage.getItem('medecinnum');
      const medecingenre = localStorage.getItem('medecingenre');
      const medecinemail = localStorage.getItem('useremail');
      const medecinpass = localStorage.getItem('userpassword');
      setMedecinId(parseInt(medecinId, 10));
      setUserNom(medecinNom);
      setUserPrenom(medecinPrenom);
      setUsernum(medecinnum);
      setUsergenre(medecingenre);
      setUseremail(medecinemail);
      setUserpass(medecinpass);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    setMedecinId(parseInt(userIdFromStorage, 10));
  }, []);

  useEffect(() => {
    fetchData();
  }, [medecinId, isLoggedOut, fetchData]);

  useEffect(() => {
    if (selectedTab === 'Dashboard') {
      setShowImageAAC(true);
      
      const timer = setTimeout(() => {
        setShowImageAAC(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === 'fiches') {
      axios.get(`http://localhost:8080/fichep/${medecinId}`)
        .then(response => {
          setFichesData(response.data);
        })
        .catch(error => {
          console.error('Error fetching fiches data:', error);
        });
    }
  }, [selectedTab, medecinId]);

  const userType = localStorage.getItem('userType');
  if (userType == null || userType !== 'Medecin') {
    navigate('/error-page');
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('userType');
      localStorage.removeItem('useremail');
      localStorage.removeItem('medecinId');
      localStorage.removeItem('medecinprenom');
      localStorage.removeItem('medecinnom');
      localStorage.removeItem('medecinnum');
      localStorage.removeItem('medecingenre');
      setIsLoggedOut(true);

      setTimeout(() => {
        navigate('/');
      }, 500);

      const button = document.querySelector('.logout-button');
      button.classList.add('animate');
    } catch (error) {
      console.error('Error removing items from localStorage:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUserData = {
        nom: userNom,
        prenom: userPrenom,
        numero: usernum,
        genre: usergenre,
        email: useremail,
        password: userpass,
      };
      await axios.put(`http://localhost:8080/user/updateM/${medecinId}`, updatedUserData);
      alert('Profile updated successfully!');
      setUserNom(userNom);
      setUserPrenom(userPrenom);
      setUsernum(usernum);
      setUsergenre(usergenre);
      setUseremail(useremail);
      setUserpass(userpass);
      setSelectedTab('Accueil');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  

  const handleAddNewFiche = async () => {
    try {
      if (!newFicheData.nom || !newFicheData.prenom || !newFicheData.datenaissance || !newFicheData.genre || !newFicheData.nationalité || !newFicheData.typedemaladie) {
        setErrorMessage('Please fill in all fields.');
        return;
      }
      setErrorMessage('');
  
      await axios.post(`http://localhost:8080/api/medecins/ficheP/${medecinId}`, { ...newFicheData });
  
      const response = await axios.get(`http://localhost:8080/fichep/${medecinId}`);
      const newFiche = response.data.find(fiche => fiche.nom === newFicheData.nom && fiche.prenom === newFicheData.prenom && fiche.datenaissance === newFicheData.datenaissance);
  

      if (newFiche) {
        const newFicheId = newFiche.id;
        const pdf = new jsPDF();

        pdf.setFont("helvetica");
        
        pdf.setFontSize(16);
        pdf.text(`Rapport médical - Patient : ${newFicheData.nom} ${newFicheData.prenom}`, 10, 20);

        pdf.setFontSize(12);
        pdf.text(`Nom: ${newFicheData.nom}`, 10, 30);
        pdf.text(`Prénom: ${newFicheData.prenom}`, 10, 40);
        pdf.text(`Genre: ${newFicheData.genre}`, 10, 50);
        pdf.text(`Date de naissance: ${newFicheData.datenaissance}`, 10, 60);
        pdf.text(`Nationalité: ${newFicheData.nationalité}`, 10, 70);
        pdf.text(`Type de maladie: ${newFicheData.typedemaladie}`, 10, 80); 
        pdf.setFontSize(14);
        pdf.text(`Description: `, 10, 100);
        pdf.setFontSize(12);
        const description = `Le patient ${newFicheData.prenom} ${newFicheData.nom}, de nationalité ${newFicheData.nationalité}, est un(e) ${newFicheData.genre} né le ${newFicheData.datenaissance}. Il présente un cas de maladie de type ${newFicheData.typedemaladie}. Les symptômes et caractéristiques spécifiques de cette maladie nécessitent une évaluation approfondie pour déterminer les meilleures options de traitement et de gestion. Une approche multidisciplinaire incluant des spécialistes médicaux et des thérapies ciblées pourrait être nécessaire pour assurer une prise en charge efficace de cette condition.`;

        const lines = pdf.splitTextToSize(description, pdf.internal.pageSize.width - 20);
        let y = 120;
        lines.forEach(line => {
            pdf.text(line, 10, y);
            y += 10; // Adjust line height as needed
        });
        
        pdf.setFontSize(10);
        pdf.text("Signature", 120, pdf.internal.pageSize.height - 60);
        pdf.setFontSize(10);
        pdf.text(".", 140, pdf.internal.pageSize.height - 55);
        pdf.setFontSize(10);
        pdf.text("Generated by Med.tn", 10, pdf.internal.pageSize.height - 10);
        
        // Save the PDF
        pdf.save(`file${newFicheId}.pdf`);
        
        
        
        saveAs(pdf.output('blob'), `file${newFicheId}.pdf`);
        
  
        setNewFicheData({
          nom: '',
          prenom: '',
          datenaissance: '',
          genre: '',
          nationalité: '',
          typedemaladie: ''
        });
        setShowModal(false);
      } else {
        console.error('New fiche not found.');
        alert('Failed to add new fiche.');
      }
  
      setNewFicheData({
        nom: '',
        prenom: '',
        datenaissance: '',
        genre: '',
        nationalité: '',
        typedemaladie: ''
      });
      setShowModal(false);

      const response2 = await axios.get(`http://localhost:8080/fichep/${medecinId}`);
      setFichesData(response2.data);
  
    } catch (error) {
      console.error('Error adding new fiche:', error);
      alert('Failed to add new fiche.');
    }
  };

  
  const getPdf = async (fileName) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/pdfs/${fileName}`, {
            responseType: 'blob'
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    } catch (error) {
        console.error('Error fetching PDF:', error);
    }
};

  return (
    <div>
      <div className="home-container">
        <div class="logo2-container">
          <img src={logo2} alt="Med Logo" style = {{width:'70px', borderRadius:'50%'}} class="logo"/>

          <b><i>Smart Med sa</i></b>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginTop:"-50px", minHeight: '99vh' }}>
          <div style={{ flex: 1 }}>
            <br/><br/><br/>
            <hr style={{ border: '2px solid white', margin: '20px 0' }}></hr>
            <div class="logo-container">
              <img src={logo} alt="phot"/>
              <h5><i>{userNom} {userPrenom}</i></h5>
            </div>
            <hr style={{ border: '2px solid white', margin: '20px 0' }}></hr>

            <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('Accueil')}>
              <img src={homeLogo} alt="Accueil Logo"  style={{ marginLeft: '20px', marginRight:'-10px', width: '30px', height: '30px' }} />
              <h5 className ="font">Accueil</h5>
            </div><br/>

            <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('Dashboard')}>
              <img src={tabLogo} alt="Tableau de bord Logo"  style={{ marginLeft: '20px', marginRight:'-10px', width: '30px', height: '30px' }} />
              <h5 className ="font">Tableau de bord</h5>
            </div><br/>

            <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('access')}>
              <img src={profileLogo} alt="Profile Logo" style={{ marginLeft: '20px', marginRight:'-10px', width: '30px', height: '30px' }} />
              <h5 className ="font">Profile</h5>
            </div><br/>

            <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('fiches')}>
              <img src={ficheLogo} alt="fiches Logo" style={{ marginLeft: '17px', marginRight:'-20px', width: '40px', height: '40px' }} />
              <h5 className ="font">Fiches des patients</h5>
            </div>

            <a href className="logout-button" onClick={handleLogout} style={{textDecoration: 'none' }}>
              <div className="logout-content">
                <img className="img-button" src={dec} alt="Logout" />
                <span >Déconnexion</span>
              </div>  
            </a>
          </div>
          <div style={{ flex: 5 }}>
            <div className="gray-box">
              {selectedTab === 'Accueil' && (
                <ul><br/><br/>
                  <div className="w-box">
                    <p style={{color:'black'}}>Bienvenu<b style={{color:'black'}}>{userPrenom} {userNom}</b> </p>
                    <p>Vous pouvez maintenant consulter les tableaux de bord interactif de vous activites médicale </p>
                  </div>
                </ul>
              )}
              {selectedTab === 'Dashboard' && (
                <ul>
                  <div >
                   <iframe src={url123} className='urlll' style={{ width: '100%', height: '590px' }} title="Dashboard"></iframe>
                    <img className='aa' src={aa} alt='aa'/>
                    <img className='aab' src={aa} alt='aa'/>
                    {showImageAAC && <img className='aac' alt="aa" src={aa} />}
                </div>
                </ul>
              )}
              {selectedTab === 'access' && (
                
                  <ul>
                    <div className='input-container'>
                     <b className="bold-text"><i>Bienvenue dans votre espace personnel ! Vous avez la possibilité de mettre à jour vos informations de profil ici.</i></b><br/><br/>
        
                      <p><strong>Nom:</strong> {editField === 'userNom' ? <input value={userNom} onChange={(e) => setUserNom(e.target.value)}  className='input' /> 
                      : <input value={userNom} onChange={(e) => setUserNom(e.target.value)}  className='input' disabled/> }<img src={edit1} alt="edit" style={{width:"40px"}} onClick={() => setEditField('userNom')}></img></p>

                      <p><strong>Prénom:</strong> {editField === 'userPrenom' ? <input value={userPrenom} onChange={(e) => setUserPrenom(e.target.value)} className='input' /> 
                      : <input value={userPrenom} onChange={(e) => setUserPrenom(e.target.value)} className='input' disabled />}  <img src={edit2} alt="edit" style={{width:"40px"}} onClick={() => setEditField('userPrenom')}></img></p>

                      <p><strong>Numéro du tel:</strong> {editField === 'usernum' ? <input value={usernum} onChange={(e) => setUsernum(e.target.value)} className='input' /> 
                      : <input value={usernum} onChange={(e) => setUsernum(e.target.value)} className='input' disabled/> }<img src={edit3} alt="edit" style={{width:"40px"}} onClick={() => setEditField('usernum')}></img></p>

                      <p><strong>Genre:</strong>
                       <label> <input  type="radio"   value="homme"  checked={usergenre === 'homme'}   onChange={(e) => setUsergenre(e.target.value)}  /> Homme </label>
                             <label> <input type="radio"   value="femme"  checked={usergenre === 'femme'}   onChange={(e) => setUsergenre(e.target.value)}  /> Femme </label>
                      </p>


                      <p><strong>Adresse email:</strong> {editField === 'useremail' ?<input type="email" value={useremail} onChange={(e) => setUseremail(e.target.value)} className='input'  /> 
                      : <input value={useremail} onChange={(e) => setUseremail(e.target.value)} className='input' disabled/> }<img src={edit4} alt="edit" style={{width:"40px"}} onClick={() => setEditField('useremail')}></img></p>

                      <p><strong>Mot de passe:</strong>  <input type="password" value={userpass} onChange={(e) => setUserpass(e.target.value)} className='input' disabled />  </p>
                      <button onClick={handleUpdateProfile}>Mettre à jour</button>
                    </div>
                  </ul>
                  )}
                    {selectedTab === 'fiches' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <b className="bold-text"><i>Bienvenue à la liste des fiches des patients</i></b>
                        <button style={{ width: '170px', marginLeft: '600px' }} onClick={() => setShowModal(true)}>Ajouter une fiche</button>
                      </div>
                      <div className="scrollable-list">
                        
                        <ul className="fiches-list">
                          {Array.isArray(fichesData) && fichesData.map(fiche => (
                            <li key={fiche.id} className="fiche-item bord" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: "20px" }}>
                              <div>
                                <p><strong>Patient ID:</strong> {fiche.id}</p>
                                <img src={pdf} alt="pdf" style={{ width: '80px', marginTop: '30px', cursor: 'pointer' }} onClick={() => getPdf(`file${fiche.id}.pdf`)}></img>
                              </div>
                              <div>
                                <p><strong>Nom du patient:</strong> {fiche.nom}</p>
                                <p><strong>Prénom du patient:</strong> {fiche.prenom}</p>
                                <p><strong>Genre:</strong> {fiche.genre}</p>
                              </div>
                              <div>
                                <p><strong>Date de naissance:</strong> {fiche.datenaissance}</p>
                                <p><strong>Nationalité:</strong> {fiche.nationalité}</p>
                                <p><strong>Type de maladie:</strong> {fiche.typedemaladie}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div></div>
                    )}
            </div>
          </div>
        </div>
        <img src={bg} className="background-image" alt="Background"></img>
      </div>

      
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Ajouter une nouvelle fiche"
        style={{
          content: {
            width: '500px',
            textAlign: 'center',
            margin: 'auto', 
            background:'#f2fbff',
            height:'600px'
          }
        }}
      >
        <h2>Ajouter une nouvelle fiche</h2>
        <div> 
          <input placeholder="Nom" value={newFicheData.nom} onChange={(e) => setNewFicheData({ ...newFicheData, nom: e.target.value })} />
        </div>
        <div>
          <input placeholder="Prénom" value={newFicheData.prenom} onChange={(e) => setNewFicheData({ ...newFicheData, prenom: e.target.value })} />
        </div>
        <div>
          <input placeholder="Date de naissance" type='date'value={newFicheData.datenaissance} onChange={(e) => setNewFicheData({ ...newFicheData, datenaissance: e.target.value })} />
        </div>
        <div>
          <input placeholder="Nationalité" value={newFicheData.nationalité} onChange={(e) => setNewFicheData({ ...newFicheData, nationalité: e.target.value })} />
        </div>
        <div>
          <input placeholder="Type de maladie" value={newFicheData.typedemaladie} onChange={(e) => setNewFicheData({ ...newFicheData, typedemaladie: e.target.value })} />
        </div>
        <div>
          <p>
              <label className='lab'> <input  type="radio"   value="homme" style={{marginLeft:"45px"}} checked={newFicheData.genre === 'homme'} onChange={(e) => setNewFicheData({ ...newFicheData, genre: e.target.value })} /> Homme </label>
              <label className='lab'> <input type="radio"   value="femme"  checked={newFicheData.genre === 'femme'}  onChange={(e) => setNewFicheData({ ...newFicheData, genre: e.target.value })}   /> Femme </label>
          </p>
        </div>
        {errorMessage && <i><p className="error-message" style={{color:'#e70000', textAlign:'center', marginLeft:'100px'}}>{errorMessage}</p></i>}
        <button onClick={handleAddNewFiche} style={{ width:'150px'}}>Ajouter</button>
        <button onClick={() => setShowModal(false)} style={{marginLeft:'20px', width:'150px'}}>Close</button>
      </Modal>
    </div>
  );
};

export default Home;
