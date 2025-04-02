package com.techsur.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF (for APIs)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // ✅ Allow /signup & /login
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable()) // ✅ Disable default login form
            .httpBasic(httpBasic -> httpBasic.disable()); // ✅ Disable HTTP Basic Auth

        return http.build();
    }
}
