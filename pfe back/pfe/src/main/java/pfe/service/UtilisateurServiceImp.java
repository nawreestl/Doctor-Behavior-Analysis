package pfe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import pfe.entities.Utilisateur;
import pfe.repository.UtilisateurRepository;

@Service
public class UtilisateurServiceImp implements UtilisateurService{
	
	@Autowired 
	private UtilisateurRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
	
    public List<Utilisateur> findByEmailAndPassword(String email, String password) {
        List<Utilisateur> users = userRepository.findByEmail(email);
        for (Utilisateur user : users) {
            if (bCryptPasswordEncoder.matches(password, user.getPassword())) {
                return users;
            }
        }
        return null;
    }
	
    @Override
    public Utilisateur saveUtilisateur(Utilisateur user) {
        return userRepository.save(user);
    }
    
    @Override
    public Utilisateur findByMedecinId(Long id) {
        return userRepository.findByMedecinId(id);
    }
    
    @Override
    public Utilisateur findByAdminId(Long id) {
        return userRepository.findByAdminId(id);
    }
	
	@Override
	public List<Utilisateur> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}
	

	@Override
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        String plainPassword = utilisateur.getPassword();
        String encryptedPassword = bCryptPasswordEncoder.encode(plainPassword);
        utilisateur.setPassword(encryptedPassword);
        Utilisateur savedUser = userRepository.save(utilisateur);
        return savedUser;
    }

    @Override
	public List<Utilisateur> getAllUtilisateurs() {
		
		return userRepository.findAll();
		
	}


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		return null;
	}
}
