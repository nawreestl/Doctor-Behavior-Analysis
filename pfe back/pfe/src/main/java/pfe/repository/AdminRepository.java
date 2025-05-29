package pfe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pfe.entities.Admin;


public interface AdminRepository extends JpaRepository<Admin, Long>{

}
