package pfe.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pfe.entities.Utilisateur;

public interface UtilisateurRepository  extends JpaRepository <Utilisateur , Long>{
	//login
	public List<Utilisateur> findByEmailAndPassword(String email,String password);	
	public List<Utilisateur> findByEmail(String email);
	public Utilisateur findById(long id);
	Utilisateur findByMedecinId(Long medecinId);
	Utilisateur findByAdminId(Long adminId);
}
