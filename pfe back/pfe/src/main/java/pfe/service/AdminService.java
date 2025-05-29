package pfe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pfe.entities.Admin;
import pfe.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }
}
