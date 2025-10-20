package com.example.legacy.dto;

import com.example.legacy.model.LegacyCategory;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class AuthDtos {
    public static class RegisterRequest {
        @NotBlank
        @Size(min = 3, max = 30)
        public String username;

        @NotBlank
        @Email
        public String email;

        @NotBlank
        @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).{8,}$", message = "Password must be at least 8 characters and include letters and numbers")
        public String password;
    }

    public static class RegisterResponse {
        public boolean success;
        public String message;

        public RegisterResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }

    public static class LoginRequest {
        @NotBlank
        public String identifier; // username or email

        @NotBlank
        public String password;
    }

    public static class UserDTO {
        public Long id;
        public String username;
        public String email;
        public LocalDateTime createdAt;

        public UserDTO(Long id, String username, String email, LocalDateTime createdAt) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.createdAt = createdAt;
        }
    }

    public static class LoginResponse {
        public String token;
        public UserDTO user;

        public LoginResponse(String token, UserDTO user) {
            this.token = token;
            this.user = user;
        }
    }

    public static class UpdateUserRequest {
        @NotBlank
        @Size(min = 3, max = 30)
        public String username;
        @NotBlank
        @Email
        public String email;
    }

    public static class LegacyItemDTO {
        public Long id;
        public LegacyCategory category;
        public String title;
        public String content;
        public LocalDateTime createdAt;
        public LocalDateTime updatedAt;

        public LegacyItemDTO(Long id, LegacyCategory category, String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
            this.id = id;
            this.category = category;
            this.title = title;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
        }
    }

    public static class CreateLegacyItemRequest {
        @NotNull
        public LegacyCategory category;
        @NotBlank
        @Size(max = 200)
        public String title;
        @NotBlank
        public String content;
    }

    public static class UpdateLegacyItemRequest {
        @NotNull
        public LegacyCategory category;
        @NotBlank
        @Size(max = 200)
        public String title;
        @NotBlank
        public String content;
    }
}
