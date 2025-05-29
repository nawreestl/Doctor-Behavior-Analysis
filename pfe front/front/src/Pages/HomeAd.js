import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import logo from '../Images/user.png';
import logo2 from '../Images/med2.png';
import bg from '../Images/bgr2.png';
import dec from '../Images/dec.png';
import homeLogo from '../Images/home.png';
import profileLogo from '../Images/user.png';
import ficheLogo from '../Images/fiche.png';
import edit1 from '../Images/edit.png';
import edit2 from '../Images/edit.png';
import edit3 from '../Images/edit.png';
import edit4 from '../Images/edit.png';
import edit5 from '../Images/edit.png';


    Modal.setAppElement('#root');

    const Home = () => {
      const [adminId, setadminId] = useState('');
      const [isLoggedOut, setIsLoggedOut] = useState(false);
      const [selectedTab, setSelectedTab] = useState('Accueil');
      const navigate = useNavigate();
      const [userNom, setUserNom] = useState('');
      const [userPrenom, setUserPrenom] = useState('');
      const [usernum, setUsernum] = useState('');
      const [useremail, setUseremail] = useState('');
      const [userpass, setUserpass] = useState('');
      const [editField, setEditField] = useState(null);
      const [medecinsEngage, setMedecinsEngage] = useState([]);
      const [medecinsIndependant, setMedecinsIndependant] = useState([]);
      const [addMedModalOpen, setAddMedModalOpen] = useState(false);
      const [medecinId, setMedecinId] = useState(null);
      const [updateMedecinData, setUpdateMedecinData] = useState({
        nom: '',
        prenom: '',
        numero: '',
        genre: '',
      });
      const [showUpdateModal, setShowUpdateModal] = useState(false);
      const [newMedData, setNewMedData] = useState({
        nom: '',
        prenom: '',
        numero: '',
        genre: '',
        email: '',
        password: ''
      });
      
      const [error, setError] = useState('');
      
      const fetchData = useCallback(async () => {
        try {
          const adminId = localStorage.getItem('adminid');
          const adminNom = localStorage.getItem('adminNom');
          const adminPrenom = localStorage.getItem('adminPrenom');
          const adminnum = localStorage.getItem('adminnum');
          const adminemail = localStorage.getItem('useremail');
          const adminpass = localStorage.getItem('userpassword');
          setadminId(parseInt(adminId, 10));
          setUserNom(adminNom);
          setUserPrenom(adminPrenom);
          setUsernum(adminnum);
          setUseremail(adminemail);
          setUserpass(adminpass);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }, []);

      useEffect(() => {
        const userIdFromStorage = localStorage.getItem('userId');
        setadminId(parseInt(userIdFromStorage, 10));
      }, []);

      useEffect(() => {
        fetchMedecinsByContrat('Engagé', setMedecinsEngage);
        fetchMedecinsByContrat('Indépendant', setMedecinsIndependant);
      }, []);

      useEffect(() => {
        fetchData();
      }, [adminId, isLoggedOut, fetchData]);

      const userType = localStorage.getItem('userType');
      if ( userType == null || userType !== 'Admin' ) {
        navigate('/error-page');
      }
      
      const handleLogout = () => {
        try {
          localStorage.removeItem('userType');
          localStorage.removeItem('useremail');
          localStorage.removeItem('adminid');
          localStorage.removeItem('adminPrenom');
          localStorage.removeItem('adminNom');
          localStorage.removeItem('adminnum');
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


      
      
      const handleUpdateMedecin = async () => {
        try {
          await axios.put(`http://localhost:8080/api/medecins/update/${medecinId}`, updateMedecinData);

          await Promise.all([
            fetchMedecinsByContrat('Engagé', setMedecinsEngage),
            fetchMedecinsByContrat('Indépendant', setMedecinsIndependant)
          ]);
          setShowUpdateModal(false); 
        } catch (error) {
          console.error('Error updating medecin:', error);
          alert('Failed to update medecin.');
        }
      };
      
      const handleOpenUpdateModal = (medecinId, nom, prenom, numero, genre, contrat , email, password) => {
        setMedecinId(medecinId);
        setUpdateMedecinData({ nom, prenom, numero, genre, contrat , email, password });
        setShowUpdateModal(true);
      };

      const handleDeleteMedecin = async (medecinId) => {
        try {
          const confirmDelete = window.confirm('Are you sure you want to delete this medecin?');
          if (!confirmDelete) {
            return;
          }
          await axios.delete(`http://localhost:8080/api/medecins/delete/${medecinId}`);
          
          await Promise.all([
            fetchMedecinsByContrat('Engagé', setMedecinsEngage),
            fetchMedecinsByContrat('Indépendant', setMedecinsIndependant)
          ]);
        } catch (error) {
          console.error('Error deleting medecin:', error);
          alert('Failed to delete medecin.');
        }
      };

      
      const handleDemissionMedecin = async (medecinId) => {
        try {
          const confirmDemiss = window.confirm('Are you sure you want to demiss this medecin?');
          if (!confirmDemiss) {
            return;
          }
          await axios.put(`http://localhost:8080/api/medecins/demiss/${medecinId}`);
          
          await Promise.all([
            fetchMedecinsByContrat('Engagé', setMedecinsEngage),
            fetchMedecinsByContrat('Indépendant', setMedecinsIndependant)
          ]);
        } catch (error) {
          console.error('Error deleting medecin:', error);
          alert('Failed to Demiss medecin.');
        }
      };

      const fetchMedecinsByContrat = async (contrat, setter) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/medecins/contrat/${contrat}`);
          const medecinsData = response.data;
      
          // Fetch user data for each medic
          const medecinsWithUserData = await Promise.all(
            medecinsData.map(async (medecin) => {
              const userData = await fetchUserData(medecin.id);
              return { ...medecin, user: userData }; // Add user data to each medic object
            })
          );
      
          setter(medecinsWithUserData);
        } catch (error) {
          console.error('Error fetching medecins data:', error);
        }
      };
      



      const handleUpdateProfile = async () => {
        try {
          const updatedUserData = {
            nom: userNom,
            prenom: userPrenom,
            numero: usernum,
            email: useremail,
            password: userpass,
          };
          await axios.put(`http://localhost:8080/user/updateA/${adminId}`, updatedUserData);
          alert('Profile updated successfully!');
          setUserNom(userNom);
          setUserPrenom(userPrenom);
          setUsernum(usernum);
          setUseremail(useremail);
          setUserpass(userpass);
          setSelectedTab('Accueil');
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile.');
        }
      };


      const openAddMedModal = () => {
        setAddMedModalOpen(true);
      };

      const closeAddMedModal = () => {
        setAddMedModalOpen(false);
      };
    
      const handleAddMedecin = async () => {
        if (!newMedData.nom || !newMedData.prenom || !newMedData.numero || !newMedData.genre) {
          setError(true);
          return;
        }
        setError(false);
        try {
          await axios.post('http://localhost:8080/user/RegisterM', newMedData);
    
          closeAddMedModal();
          await Promise.all([
            fetchMedecinsByContrat('Engagé', setMedecinsEngage),
            fetchMedecinsByContrat('Indépendant', setMedecinsIndependant)
          ]);
        } catch (error) {
          console.error('Error adding medecin:', error);
          alert('Failed to add medecin.');
        }
      };

      const fetchUserData = async (medecinId) => {
        try {
            const response = await axios.get(`http://localhost:8080/user/getbymed/${medecinId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
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

                <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('access')}>
                  <img src={profileLogo} alt="Profile Logo" style={{ marginLeft: '20px', marginRight:'-10px', width: '30px', height: '30px' }} />
                  <h5 className ="font">Profile</h5>
                </div><br/>

                <div className="hov" style={{ display: 'flex', alignItems: 'center' }} onClick={() => setSelectedTab('accés')}>
                  <img src={ficheLogo} alt="fiches Logo" style={{ marginLeft: '17px', marginRight:'-20px', width: '40px', height: '40px' }} />
                  <h5 className ="font">Les accés</h5>
                </div>

                <a href className="logout-button" onClick={handleLogout} style={{texthecoration: 'none' }}>
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
                        <p style={{color:'black'}}>Bienvenu,<b style={{color:'black'}}>{userPrenom} {userNom}</b> </p>
                        <p>Vous pouvez maintenant consulter les tableaux de bord commerciaux</p>
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

                        <p><strong>Adresse email:</strong> {editField === 'useremail' ?<input type="email" value={useremail} onChange={(e) => setUseremail(e.target.value)} className='input'  /> 
                        : <input value={useremail} onChange={(e) => setUseremail(e.target.value)} className='input' disabled/> }<img src={edit4} alt="edit" style={{width:"40px"}} onClick={() => setEditField('useremail')}></img></p>

                          <p><strong>Mot de passe:</strong>  {editField === 'userpass' ?<input type="password" value={userpass} onChange={(e) => setUserpass(e.target.value)} className='input' />
                          : <input value={userpass} onChange={(e) => setUserpass(e.target.value)} type="password" className='input' disabled/> }<img src={edit5} alt="edit" style={{width:"40px"}} onClick={() => setEditField('userpass')}></img></p>

                          <button onClick={handleUpdateProfile}>Mettre à jour</button>
                        </div>
                      </ul>
                      )}
                        {selectedTab === 'accés' && (
                          <div>
                              
                              <button  onClick={openAddMedModal} style={{ width: '190px', marginLeft: '1050px', marginRight: '10px' }} >Ajouter un médecin</button>
                              <br/>
                              <div className="scrollable-list">
                              <b className="bold-text"><i>Bienvenue à la liste des médecins Engagé</i></b>  <br/><br/>
                            
                            <div className="table-container">
                            <table>
                                <tbody>
                                <tr>
                                  <th className='abcabc'>
                                  Nom  
                                  </th>    
                                  <th className='abcabc'>
                                  Email  
                                  </th> 
                                  <th className='abcabc'> 
                                  Mot de passe  
                                  </th>  
                                </tr>
                                {medecinsEngage.map((medecin) => (
                                  <tr key={medecin.id} style={{ border: '1px solid gray', padding: '10px' }}>
                                    <th>
                                      <div style={{ marginLeft: '10px' }}>
                                        <i>{medecin.nom}</i>
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ marginLeft: '20px' }}>
                                        <i>{medecin.user && medecin.user.email}</i>
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ marginLeft: '20px' }}>
                                        <i>{medecin.user && medecin.user.password}</i>
                                      </div>
                                    </th>
                                    <th>
                                      <div>
                                        <button className='btbt2' onClick={() => handleOpenUpdateModal(medecin.id, medecin.nom, medecin.prenom, medecin.numero, medecin.genre, medecin.contrat, medecin.user.email, medecin.user.password)}>Update</button>
                                      </div>
                                    </th>
                                    <th>
                                      <div>
                                        <button className='btbt3' onClick={() => handleDemissionMedecin(medecin.id)}>Démission</button>
                                      </div>
                                    </th>
                                  </tr>
                                ))}

                                </tbody>
                              </table>

                              <br/><hr/><b className="bold-text"><i>Bienvenue à la liste des médecins Independant</i></b><br/><br/>
                              <table>
                                <tbody>
                                  <tr>
                                  <th className='abcabc'>
                                  Nom  
                                  </th>    
                                  <th className='abcabc'>
                                  Email  
                                  </th>   
                                  <th className='abcabc'> 
                                  Mot de passe  
                                  </th>   
                                  </tr>
                                  {medecinsIndependant.map((medecin) => (
                                    
                                    <tr key={medecin.id} style={{ border: '1px solid gray', padding: '10px' }}>
                                      <th>
                                      <div style={{ marginLeft: '10px' }}>
                                        <i>{medecin.nom}</i>
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ marginLeft: '20px' }}>
                                        <i >{medecin.user && medecin.user.email}</i>
                                      </div>
                                    </th>
                                    <th>
                                      <div style={{ marginLeft: '20px' }}>
                                        <i>{medecin.user && medecin.user.password}</i>
                                      </div>
                                      </th>
                                      <th>
                                        <div>
                                          <button className='btbt' onClick={() => handleDeleteMedecin(medecin.id)}>Delete</button>
                                        </div>
                                      </th>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                            </div><br/><br/><br/>
                          </div></div>
                        )}
                </div>
              </div>
            </div>
            <img src={bg} className="background-image" alt="Background"></img>
          </div>

          <Modal
              isOpen={showUpdateModal}
              onRequestClose={() => setShowUpdateModal(false)}
              contentLabel="Modifier un médecin"
              style={{
                content: {
                  width: '455px',
                  textAlign: 'center',
                  margin: 'auto',
                  background: '#f2fbff',
                  height: '620px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <h2>Modifier un médecin</h2>
              <div>
                <input placeholder="Nom" value={updateMedecinData.nom} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, nom: e.target.value })} />
              </div>
              <div>
                <input placeholder="Prénom" value={updateMedecinData.prenom} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, prenom: e.target.value })} />
              </div>
              <div>
                <input placeholder="Numéro" value={updateMedecinData.numero} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, numero: e.target.value })} />
              </div>
              <div>
                <input placeholder="Contrat" value={updateMedecinData.contrat} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, contrat: e.target.value })} disabled />
              </div>
              <div>
                <input placeholder="Email" type='email' value={updateMedecinData.email} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, email: e.target.value })} disabled />
              </div>
              <div>
                <input placeholder="Password" type='password' value={updateMedecinData.password} onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, password: e.target.value })} disabled/>
              </div>
              <div><p>
                <label>
                  <input
                  style={{marginLeft:'1px'}}
                    type="radio"
                    value="homme"
                    checked={updateMedecinData.genre === 'homme'}
                    onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, genre: e.target.value })}
                  />
                  Homme
                </label>
                <label>
                  <input
                    type="radio"
                    value="femme"
                    checked={updateMedecinData.genre === 'femme'}
                    onChange={(e) => setUpdateMedecinData({ ...updateMedecinData, genre: e.target.value })}
                  />
                  Femme
                </label>
                </p>
              
              </div>
              <button style={{width:'150px', marginRight: '20px'}} onClick={handleUpdateMedecin}>Mettre à jour</button>
              <button style={{width:'150px'}} onClick={() => setShowUpdateModal(false)}>Fermer</button>
            </Modal>

            <Modal
          isOpen={addMedModalOpen}
          onRequestClose={closeAddMedModal}
          contentLabel="Ajouter un médecin"
          style={{
            content: {
              width: '455px',
              textAlign: 'center',
              margin: 'auto',
              background: '#f2fbff',
              height: '570px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <h2>Ajouter un médecin</h2>
          <div>
            <div>
                <input placeholder="Nom" className={`signup__input form-control ${error ? 'is-invalid' : ''}`} value={newMedData.nom} onChange={(e) => setNewMedData({ ...newMedData, nom: e.target.value })} />
              </div>
              <div>
                <input placeholder="Prénom" className={`signup__input form-control ${error ? 'is-invalid' : ''}`} value={newMedData.prenom} onChange={(e) => setNewMedData({ ...newMedData, prenom: e.target.value })} />
              </div>
              <div>
                <input placeholder="Numéro" className={`signup__input form-control ${error ? 'is-invalid' : ''}`} value={newMedData.numero} onChange={(e) => setNewMedData({ ...newMedData, numero: e.target.value })} />
              </div>
              <div><p>
                <label className='lab'>
                  <input
                  style={{marginLeft:'1px'}}
                    type="radio"
                    value="homme"
                    checked={newMedData.genre === 'homme'}
                    onChange={(e) => setNewMedData({ ...newMedData, genre: e.target.value })}
                  />
                  Homme
                </label>
                <label className='lab'>
                  <input
                    type="radio"
                    value="femme"
                    checked={newMedData.genre === 'femme'}
                    onChange={(e) => setNewMedData({ ...newMedData, genre: e.target.value })}
                  />
                  Femme
                </label>
                </p>
                <div>
                <input placeholder="Email" type='email' className={`signup__input form-control ${error ? 'is-invalid' : ''}`} value={newMedData.email} onChange={(e) => setNewMedData({ ...newMedData, email: e.target.value })} />
              </div>
              <div>
                <input placeholder="Password" type='password' className={`signup__input form-control ${error ? 'is-invalid' : ''}`} value={newMedData.password} onChange={(e) => setNewMedData({ ...newMedData, password: e.target.value })} />
              </div>
          </div></div>
          <button style={{width:'150px', marginRight: '20px'}} onClick={handleAddMedecin}>Ajouter</button>
          <button style={{width:'150px'}}onClick={closeAddMedModal}>Annuler</button><br/><br/>
          {error && (
                    <p className="error-message" style={{color:'red',fontSize:'18px' , textAlign:'center', marginLeft:'70px'}}>Please fill in all fields!</p>
                    )}
        </Modal>
        </div>
      );
    };

    export default Home;
