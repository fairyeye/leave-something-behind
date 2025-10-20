package com.example.legacy.controller;

import com.example.legacy.dto.AuthDtos;
import com.example.legacy.service.LegacyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/legacy")
public class LegacyController {

    private final LegacyService legacyService;

    public LegacyController(LegacyService legacyService) {
        this.legacyService = legacyService;
    }

    @GetMapping
    public ResponseEntity<List<AuthDtos.LegacyItemDTO>> list() {
        return ResponseEntity.ok(legacyService.listMine());
    }

    @PostMapping
    public ResponseEntity<AuthDtos.LegacyItemDTO> create(@Valid @RequestBody AuthDtos.CreateLegacyItemRequest req) {
        return ResponseEntity.ok(legacyService.create(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthDtos.LegacyItemDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(legacyService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthDtos.LegacyItemDTO> update(@PathVariable Long id, @Valid @RequestBody AuthDtos.UpdateLegacyItemRequest req) {
        return ResponseEntity.ok(legacyService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        legacyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
