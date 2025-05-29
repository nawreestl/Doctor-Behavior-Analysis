package pfe.service;

import java.util.List;
import org.springframework.security.core.userdetails.UserDetailsService;
import pfe.entities.Utilisateur;


public interface UtilisateurService extends UserDetailsService {
	
	public List<Utilisateur> findByEmailAndPassword(String email, String password);
	public List<Utilisateur> findByEmail(String email);
    public Utilisateur createUtilisateur(Utilisateur utilisateur);
	public List<Utilisateur> getAllUtilisateurs();
	public Utilisateur saveUtilisateur(Utilisateur user);
	public Utilisateur findByMedecinId(Long id);
	public Utilisateur findByAdminId(Long id);
}
