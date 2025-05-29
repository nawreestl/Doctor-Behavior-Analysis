package pfe.controller;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pfe.entities.FichePatient;
import pfe.entities.Medecin;
import pfe.service.MedecinService;


@RestController
@RequestMapping("/api/medecins")
@CrossOrigin(origins = "http://localhost:3000")
public class MedecinController {

    @Autowired
    private MedecinService medecinService;
    
    

    public MedecinController(MedecinService medecinService) {
		super();
		this.medecinService = medecinService;
	}
    
    
	@GetMapping
	public  List<Medecin> getAllMedecins() {
		return medecinService.getAllMedecins();
	}


    @GetMapping("/{id}")
    public ResponseEntity<Medecin> getMedecinById(@PathVariable Long id) {
        Medecin medecin = medecinService.getMedecinById(id);
        if (medecin != null) {
            return new ResponseEntity<>(medecin, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("update/{id}")
    public ResponseEntity<Medecin> updateMedecin(@PathVariable("id") Long id, @RequestBody Medecin updatedMedecin) {
        Medecin existingMedecin = medecinService.getMedecinById(id);
        if (existingMedecin != null) {
            updatedMedecin.setId(id);
            updatedMedecin.setContrat("Engagé");
	        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        String formattedDate = formatter.format(new Date());
	        updatedMedecin.setDtcontrat(formattedDate);
            Medecin savedMedecin = medecinService.updateMedecin(updatedMedecin);
            return ResponseEntity.ok(savedMedecin);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/contrat/{contrat}")
    public List<Medecin> findAllMedecinByContrat(@PathVariable String contrat) {
        return medecinService.findAllMedecinByContrat(contrat);
    }



    @PostMapping("/ficheP/{medecinId}")
    public ResponseEntity<String> addFichePatientToMedecin(@PathVariable Long medecinId, @RequestBody FichePatient fichePatient) {
        try {
            medecinService.addFichePatient(medecinId, fichePatient);
            return new ResponseEntity<>("FichePatient added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMedecin(@PathVariable("id") Long id) {
        try {
            medecinService.deleteMedecinById(id);
            return new ResponseEntity<>("Medecin with ID: " + id + " has been deleted.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/demiss/{id}")
    public ResponseEntity<Medecin> setContratIndépendant(@PathVariable Long id) {
        try {
            Medecin updatedMedecin = medecinService.setContratIndépendant(id);
            return new ResponseEntity<>(updatedMedecin, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
}