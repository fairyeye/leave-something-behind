package com.example.legacy.service;

import com.example.legacy.dto.AuthDtos;
import com.example.legacy.exception.ApiException;
import com.example.legacy.model.User;
import com.example.legacy.repository.UserRepository;
import com.example.legacy.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public void register(AuthDtos.RegisterRequest req) {
        if (userRepository.existsByUsername(req.username)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Username already exists");
        }
        if (userRepository.existsByEmail(req.email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST.value(), "Email already exists");
        }
        User user = new User();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password));
        user.setRoles("ROLE_USER");
        userRepository.save(user);
    }

    public AuthDtos.LoginResponse login(AuthDtos.LoginRequest req) {
        Optional<User> userOpt;
        if (req.identifier.contains("@")) {
            userOpt = userRepository.findByEmail(req.identifier);
        } else {
            userOpt = userRepository.findByUsername(req.identifier);
        }
        User user = userOpt.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials"));
        if (!passwordEncoder.matches(req.password, user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials");
        }
        String token = tokenProvider.generateToken(user.getUsername(), user.getId(), user.getRoles());
        AuthDtos.UserDTO userDTO = new AuthDtos.UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getCreatedAt());
        return new AuthDtos.LoginResponse(token, userDTO);
    }
}
