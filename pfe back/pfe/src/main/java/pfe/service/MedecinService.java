package pfe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pfe.entities.FichePatient;
import pfe.entities.Medecin;
import pfe.entities.Utilisateur;
import pfe.repository.MedecinRepository;
import pfe.repository.UtilisateurRepository;

import java.util.List;

import javax.transaction.Transactional;

@Service
public class MedecinService {

    @Autowired
    private MedecinRepository medecinRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    public Medecin saveMedecin(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    public Medecin getMedecinById(Long id) {
        return medecinRepository.findById(id).orElse(null);
    }
    
	
	public List<Medecin> getAllMedecins() {
		return medecinRepository.findAll();
	}

    public Medecin updateMedecin(Medecin medecin) {
    	
        return medecinRepository.save(medecin);
    }
    
    public void addFichePatient(Long medecinId, FichePatient fichePatient) {
        Medecin medecin = medecinRepository.findById(medecinId).orElse(null);
        if (medecin != null) {
            fichePatient.setMedecin(medecin);
            medecin.getFichesPatients().add(fichePatient);
            medecinRepository.save(medecin);
        } else {
            throw new RuntimeException("Medecin not found with id: " + medecinId);
        }
    }
    
    public List<Medecin> findAllMedecinByContrat(String contrat) {
        return medecinRepository.findAllByContrat(contrat);
    }
    
    @Transactional
    public void deleteMedecinById(Long id) {
        Medecin medecin = medecinRepository.findById(id).orElse(null);
        if (medecin != null) {
            Utilisateur utilisateur = utilisateurRepository.findByMedecinId(id);
            if (utilisateur != null) {
                utilisateurRepository.delete(utilisateur);
            }
            medecinRepository.delete(medecin);
        } else {
            throw new RuntimeException("Medecin not found with id: " + id);
        }
    }

    @Transactional
    public Medecin setContratIndépendant(Long id) {
        Medecin medecin = medecinRepository.findById(id).orElse(null);
        if (medecin != null) {
            medecin.setContrat("Indépendant");
            return medecinRepository.save(medecin);
        } else {
            throw new RuntimeException("Medecin not found with id: " + id);
        }
    }
}
