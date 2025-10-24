package com.example.legacy.repository;

import com.example.legacy.model.LegacyItem;
import com.example.legacy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegacyItemRepository extends JpaRepository<LegacyItem, Long> {
    List<LegacyItem> findByUserOrderByUpdatedAtDesc(User user);
    List<LegacyItem> findByUserOrderByCreatedAtDesc(User user);
    Optional<LegacyItem> findByIdAndUser(Long id, User user);
}
