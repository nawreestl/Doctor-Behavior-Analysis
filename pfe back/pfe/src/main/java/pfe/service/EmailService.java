package pfe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("${email.contact}")
    private String fromEmail;

    public void sendConfirmationEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Bienvenue sur MedTn - Confirmation de compte");
        message.setText("Cher utilisateur,\n\n" +
                "Bienvenue sur MedTn !\n\n" +
                "Nous sommes ravis de vous informer que votre compte a été créé avec succès avec l'adresse e-mail : " + toEmail + ".\n\n" +
                "Merci d'avoir choisi MedTn. Votre confiance en nous est grandement appréciée.\n\n" +
                "Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter à " + fromEmail + ".\n\n" +
                "Meilleures salutations,\nL'équipe MedTn");

        emailSender.send(message);
    }
    
    
}
