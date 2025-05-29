package pfe.entities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;


@Entity
public class Medecin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String numero;
    private String genre;
    private String contrat;
    private String dtcontrat;
    
    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL)
    private List<FichePatient> fichesPatients = new ArrayList<>();
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

	public String getContrat() {
		return contrat;
	}

	public void setContrat(String contrat) {
		this.contrat = contrat;
	}

	public String getDtcontrat() {
		return dtcontrat;
	}

	public void setDtcontrat(String dtcontrat) {
		this.dtcontrat = dtcontrat;
	}

	public List<FichePatient> getFichesPatients() {
        return fichesPatients;
    }

    public void setFichesPatients(List<FichePatient> fichesPatients) {
        this.fichesPatients = fichesPatients;
    }
}
