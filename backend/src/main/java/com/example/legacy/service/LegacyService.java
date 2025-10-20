package com.example.legacy.service;

import com.example.legacy.dto.AuthDtos;
import com.example.legacy.exception.ApiException;
import com.example.legacy.model.LegacyItem;
import com.example.legacy.model.User;
import com.example.legacy.repository.LegacyItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LegacyService {

    private final LegacyItemRepository legacyItemRepository;
    private final UserService userService;

    public LegacyService(LegacyItemRepository legacyItemRepository, UserService userService) {
        this.legacyItemRepository = legacyItemRepository;
        this.userService = userService;
    }

    public List<AuthDtos.LegacyItemDTO> listMine() {
        User user = userService.getCurrentUserEntity();
        return legacyItemRepository.findByUserOrderByUpdatedAtDesc(user)
                .stream()
                .map(i -> new AuthDtos.LegacyItemDTO(i.getId(), i.getCategory(), i.getTitle(), i.getContent(), i.getCreatedAt(), i.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public AuthDtos.LegacyItemDTO create(AuthDtos.CreateLegacyItemRequest req) {
        User user = userService.getCurrentUserEntity();
        LegacyItem item = new LegacyItem();
        item.setUser(user);
        item.setCategory(req.category);
        item.setTitle(req.title);
        item.setContent(req.content);
        legacyItemRepository.save(item);
        return new AuthDtos.LegacyItemDTO(item.getId(), item.getCategory(), item.getTitle(), item.getContent(), item.getCreatedAt(), item.getUpdatedAt());
    }

    public AuthDtos.LegacyItemDTO getById(Long id) {
        User user = userService.getCurrentUserEntity();
        LegacyItem item = legacyItemRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Item not found"));
        return new AuthDtos.LegacyItemDTO(item.getId(), item.getCategory(), item.getTitle(), item.getContent(), item.getCreatedAt(), item.getUpdatedAt());
    }

    public AuthDtos.LegacyItemDTO update(Long id, AuthDtos.UpdateLegacyItemRequest req) {
        User user = userService.getCurrentUserEntity();
        LegacyItem item = legacyItemRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Item not found"));
        item.setCategory(req.category);
        item.setTitle(req.title);
        item.setContent(req.content);
        legacyItemRepository.save(item);
        return new AuthDtos.LegacyItemDTO(item.getId(), item.getCategory(), item.getTitle(), item.getContent(), item.getCreatedAt(), item.getUpdatedAt());
    }

    public void delete(Long id) {
        User user = userService.getCurrentUserEntity();
        LegacyItem item = legacyItemRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND.value(), "Item not found"));
        legacyItemRepository.delete(item);
    }
}
