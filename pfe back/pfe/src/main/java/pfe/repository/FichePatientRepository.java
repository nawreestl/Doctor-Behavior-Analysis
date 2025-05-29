package pfe.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pfe.entities.FichePatient;

public interface FichePatientRepository extends JpaRepository<FichePatient, Long> {
    List<FichePatient> findByMedecin_Id(Long medecinId);
}
