package pfe.security;


import org.springframework.security.authentication.AuthenticationManager;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AuthorizationFilter extends BasicAuthenticationFilter {

    private UserDetailsService userDetailsService;
    private JwtDecoder jwtDecoder;

    public AuthorizationFilter(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtDecoder jwtDecoder) {
        super(authenticationManager);
        this.userDetailsService = userDetailsService;
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String header = request.getHeader(SecurityConstraints.AUTHORIZATION);

        if (header == null || !header.startsWith(SecurityConstraints.BEARER)) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.replace(SecurityConstraints.BEARER, "");

        if (jwtDecoder.isTokenExpired(token)) {
            // Token has expired
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String user = jwtDecoder.extractUsername(token);

        if (user != null && userDetailsService != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(user);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        chain.doFilter(request, response);
    }
}
