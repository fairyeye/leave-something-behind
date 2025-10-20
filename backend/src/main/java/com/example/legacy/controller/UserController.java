package com.example.legacy.controller;

import com.example.legacy.dto.AuthDtos;
import com.example.legacy.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDtos.UserDTO> me() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/update")
    public ResponseEntity<AuthDtos.UserDTO> update(@Valid @RequestBody AuthDtos.UpdateUserRequest req) {
        return ResponseEntity.ok(userService.update(req));
    }
}
