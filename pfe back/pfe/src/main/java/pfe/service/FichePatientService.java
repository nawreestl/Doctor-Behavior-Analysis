package pfe.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pfe.entities.FichePatient;
import pfe.repository.FichePatientRepository;

@Service
public class FichePatientService {

    @Autowired
    private FichePatientRepository fichePatientRepository;


    public List<FichePatient> findFichePatientByMedecinId(Long medecinId) {
        return fichePatientRepository.findByMedecin_Id(medecinId);
    }
}
