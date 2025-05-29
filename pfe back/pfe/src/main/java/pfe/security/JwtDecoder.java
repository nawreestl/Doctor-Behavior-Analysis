package pfe.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtDecoder {

    private static final String SECRET_JWT = "kjeznrrazer54545484";

    public Claims decodeJwt(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_JWT)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            throw new IllegalArgumentException("Invalid JWT signature");
        }
    }

    public String extractUsername(String token) {
        Claims claims = decodeJwt(token);
        return claims.getSubject();
    }

    public boolean isTokenExpired(String token) {
        Claims claims = decodeJwt(token);
        Date expiration = claims.getExpiration();
        return expiration != null && expiration.before(new Date());
    }
}
