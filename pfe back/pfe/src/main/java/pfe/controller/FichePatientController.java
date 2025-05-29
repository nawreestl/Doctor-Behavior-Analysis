package pfe.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pfe.entities.FichePatient;
import pfe.service.FichePatientService;


@RestController
@RequestMapping("/fichep")
@CrossOrigin(origins = "http://localhost:3000")
public class FichePatientController {

    @Autowired
    private FichePatientService fichepatientService;
    
    
    @GetMapping("/{medecinId}")
    public ResponseEntity<List<FichePatient>> getFichePatientsByMedecinId(@PathVariable Long medecinId) {
        List<FichePatient> fichePatients = fichepatientService.findFichePatientByMedecinId(medecinId);
        if (fichePatients.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(fichePatients, HttpStatus.OK);
    }
    
}