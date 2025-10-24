package com.example.legacy.service;

import com.example.legacy.dto.AuthDtos;
import com.example.legacy.exception.ApiException;
import com.example.legacy.model.User;
import com.example.legacy.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Unauthenticated");
        }
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED.value(), "User not found"));
    }

    public AuthDtos.UserDTO getCurrentUser() {
        User u = getCurrentUserEntity();
        return new AuthDtos.UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getCreatedAt());
    }

    public AuthDtos.UserDTO update(AuthDtos.UpdateUserRequest req) {
        User u = getCurrentUserEntity();
        if (!u.getUsername().equals(req.username) && userRepository.existsByUsername(req.username)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Username already exists");
        }
        if (!u.getEmail().equals(req.email) && userRepository.existsByEmail(req.email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email already exists");
        }
        u.setUsername(req.username);
        u.setEmail(req.email);
        userRepository.save(u);
        return new AuthDtos.UserDTO(u.getId(), u.getUsername(), u.getEmail(), u.getCreatedAt());
    }

    public void updateEmergencySettings(String emergencyEmail, Integer inactivityDays) {
        User u = getCurrentUserEntity();
        if (emergencyEmail != null && !emergencyEmail.isEmpty()) {
            u.setEmergencyEmail(emergencyEmail);
        }
        if (inactivityDays != null && inactivityDays > 0) {
            u.setInactivityDays(inactivityDays);
        }
        userRepository.save(u);
    }

    public EmergencySettingsDTO getEmergencySettings() {
        User u = getCurrentUserEntity();
        return new EmergencySettingsDTO(u.getEmergencyEmail(), u.getInactivityDays(), u.getLastLoginAt());
    }

    public static class EmergencySettingsDTO {
        public String emergencyEmail;
        public Integer inactivityDays;
        public java.time.LocalDateTime lastLoginAt;

        public EmergencySettingsDTO(String emergencyEmail, Integer inactivityDays, java.time.LocalDateTime lastLoginAt) {
            this.emergencyEmail = emergencyEmail;
            this.inactivityDays = inactivityDays;
            this.lastLoginAt = lastLoginAt;
        }
    }
}
