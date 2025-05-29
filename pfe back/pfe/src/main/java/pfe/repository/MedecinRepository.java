package pfe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pfe.entities.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
	List<Medecin> findAllByContrat(String contrat);
  
}
