package pfe.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pfe.security.SecurityConstraints;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import pfe.config.EmailAndPasswordRequest;
import pfe.entities.Admin;
import pfe.entities.Medecin;
import pfe.entities.Utilisateur;
import pfe.service.AdminService;
import pfe.service.EmailService;
import pfe.service.MedecinService;
import pfe.service.UtilisateurService;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:8080")
public class UtilisateurController {
	
	 	private final UtilisateurService utilisateurService;
	    private final AdminService adminService;
	    private final MedecinService medecinService;
	    private EmailService emailService;

	
	public UtilisateurController(UtilisateurService utilisateurService, AdminService adminService,MedecinService medecinService ,EmailService emailservice) {
	    this.utilisateurService = utilisateurService;
	    this.adminService = adminService;
	    this.medecinService =  medecinService;
	    this.emailService = emailservice;
	}

	@GetMapping
	public  List<Utilisateur> getAllUtilisateurs() {
		return utilisateurService.getAllUtilisateurs();
	}

	
	@PostMapping(path="/RegisterA")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<Admin> registerStagiaire(@RequestBody Map<String, Object> request){
	    try {
	    	Admin admin = new Admin();
	    	admin.setNom((String) request.get("nom"));
	    	admin.setPrenom((String) request.get("prenom"));
	    	admin.setNumero((String) request.get("numero"));

	    	Admin savedadmin = adminService.saveAdmin(admin);

	        if (savedadmin != null) {
	            Utilisateur utilisateur = new Utilisateur();
	            utilisateur.setAdmin(savedadmin);
	            utilisateur.setEmail((String) request.get("email"));
		        utilisateur.setPassword((String) request.get("password"));

	            utilisateurService.createUtilisateur(utilisateur);

	            System.out.print(utilisateur);
	        }

	        return new ResponseEntity<>(savedadmin, HttpStatus.CREATED);
	    } catch (Exception ex) {
	        ex.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@PutMapping("updateA/{id}")
	public ResponseEntity<Admin> updateAdmin(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestBody) {
	    Admin existingAdmin = adminService.getAdminById(id);
	    if (existingAdmin != null) {
	        Admin updatedAdmin = new Admin();
	        updatedAdmin.setId(id);
	        updatedAdmin.setNom((String) requestBody.get("nom"));
	        updatedAdmin.setPrenom((String) requestBody.get("prenom"));
	        updatedAdmin.setNumero((String) requestBody.get("numero"));


	        Admin savedAdmin = adminService.saveAdmin(updatedAdmin);

	        Utilisateur utilisateur = utilisateurService.findByAdminId(id);
	        if (utilisateur != null) {
	            utilisateur.setAdmin(savedAdmin);
	            utilisateur.setEmail((String) requestBody.get("email"));
	            utilisateur.setPassword((String) requestBody.get("password"));
	            utilisateurService.createUtilisateur(utilisateur);
	        }
	        return ResponseEntity.ok(savedAdmin);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}
	

	@PostMapping(path = "/RegisterM")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<Medecin> registerEntrprise(@RequestBody Map<String, Object> request) {
	    try {
	        Medecin medecin = new Medecin();
	        medecin.setNom((String) request.get("nom"));
	    	medecin.setPrenom((String) request.get("prenom"));
	    	medecin.setNumero((String) request.get("numero"));
	    	medecin.setGenre((String) request.get("genre"));
	    	medecin.setContrat("Engagé");
	    	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    	String formattedDate = formatter.format(new Date());
	    	medecin.setDtcontrat(formattedDate);
	        Medecin savedMedecin = medecinService.saveMedecin(medecin);

	        if (savedMedecin != null) {
	            Utilisateur utilisateur = new Utilisateur();
	            utilisateur.setMedecin(savedMedecin);
	            utilisateur.setEmail((String) request.get("email"));
		        utilisateur.setPassword((String) request.get("password"));

	            utilisateurService.createUtilisateur(utilisateur);

		           System.out.print(utilisateur);
		       }
		       return new ResponseEntity<>(savedMedecin, HttpStatus.CREATED);
		   } catch (Exception ex) {
		       ex.printStackTrace();
		       return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		   }
		}
	

	@PutMapping("updateM/{id}")
	public ResponseEntity<Medecin> updateMedecin(@PathVariable("id") Long id, @RequestBody Map<String, Object> requestBody) {
	    Medecin existingMedecin = medecinService.getMedecinById(id);
	    if (existingMedecin != null) {
	        Medecin updatedMedecin = new Medecin();
	        updatedMedecin.setId(id);
	        updatedMedecin.setNom((String) requestBody.get("nom"));
	        updatedMedecin.setPrenom((String) requestBody.get("prenom"));
	        updatedMedecin.setNumero((String) requestBody.get("numero"));
	        updatedMedecin.setGenre((String) requestBody.get("genre"));

	        updatedMedecin.setContrat("Engagé");
	        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        String formattedDate = formatter.format(new Date());
	        updatedMedecin.setDtcontrat(formattedDate);

	        Medecin savedMedecin = medecinService.updateMedecin(updatedMedecin);

	        Utilisateur utilisateur = utilisateurService.findByMedecinId(id);
	        if (utilisateur != null) {
	            utilisateur.setMedecin(savedMedecin);
	            utilisateur.setEmail((String) requestBody.get("email"));
	            utilisateur.setPassword((String) requestBody.get("password"));
	            utilisateurService.createUtilisateur(utilisateur);
	        }
	        return ResponseEntity.ok(savedMedecin);
	    } else {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	    }
	}


    @GetMapping("/getbymed/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurByMedecinId(@PathVariable("id") Long medecinId) {
        Utilisateur utilisateur = utilisateurService.findByMedecinId(medecinId);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

	@PostMapping(path = "/login")
	@CrossOrigin(origins = "http://localhost:8080")
	public ResponseEntity<List<Utilisateur>> findByEmailAndPassword(@RequestBody EmailAndPasswordRequest emailpassreq) {

	    List<Utilisateur> utilisateurs = utilisateurService.findByEmailAndPassword(emailpassreq.getEmail(), emailpassreq.getPassword());
	    
	    if (utilisateurs.isEmpty()) {
	        return new ResponseEntity<List<Utilisateur>>(HttpStatus.NO_CONTENT);
	    } else {
	        Utilisateur utilisateur = utilisateurs.get(0);

	        if (utilisateur.getAdmin() != null) {
	            System.out.println("Login as Admin: " + utilisateur.getAdmin().getNom());
	        } else if (utilisateur.getMedecin() != null) {
	            System.out.println("Login as Medecin: " + utilisateur.getMedecin().getNom());
	        }
	        
	        String token = generateJwtToken(utilisateur.getEmail());

	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("token", token);
	        responseBody.put("user", utilisateurs);

	        return new ResponseEntity<List<Utilisateur>>(utilisateurs, HttpStatus.OK);
	    }
	}	
	
	private String generateJwtToken(String email) {
	    String token = Jwts.builder()
	            .setSubject(email)
	            .setExpiration(new Date(System.currentTimeMillis() + 9999999))  
	            .signWith(SignatureAlgorithm.HS512, SecurityConstraints.SECRET_JWT)
	            .compact();

	    System.out.println("Generated JWT Token: " + token);
	    return token;
	}
	
    @PostMapping("/sendemail")
    public ResponseEntity<String> sendConfirmationEmail(@RequestBody String email) {
        try {
            emailService.sendConfirmationEmail(email);
            return ResponseEntity.ok("Confirmation email sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send confirmation email");
        }
    }
	
}
