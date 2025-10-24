package com.example.legacy.scheduler;

import com.example.legacy.model.LegacyItem;
import com.example.legacy.model.User;
import com.example.legacy.repository.LegacyItemRepository;
import com.example.legacy.repository.UserRepository;
import com.example.legacy.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class InactivityCheckScheduler {

    private final UserRepository userRepository;
    private final LegacyItemRepository legacyItemRepository;
    private final EmailService emailService;

    public InactivityCheckScheduler(UserRepository userRepository,
                                    LegacyItemRepository legacyItemRepository,
                                    EmailService emailService) {
        this.userRepository = userRepository;
        this.legacyItemRepository = legacyItemRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "${app.scheduler.inactivity-check-cron:0 0 2 * * ?}")
    @Transactional
    public void checkInactiveUsers() {
        List<User> users = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (User user : users) {
            if (shouldSendLegacyEmail(user, now)) {
                sendLegacyToEmergencyContact(user);
            }
        }
    }

    private boolean shouldSendLegacyEmail(User user, LocalDateTime now) {
        if (user.getLastLoginAt() == null) {
            return false;
        }

        if (user.getEmergencyEmail() == null || user.getEmergencyEmail().isEmpty()) {
            return false;
        }

        if (user.getLegacySent() != null && user.getLegacySent()) {
            return false;
        }

        Integer inactivityDays = user.getInactivityDays();
        if (inactivityDays == null || inactivityDays <= 0) {
            return false;
        }

        LocalDateTime threshold = now.minusDays(inactivityDays);
        return user.getLastLoginAt().isBefore(threshold);
    }

    private void sendLegacyToEmergencyContact(User user) {
        List<LegacyItem> legacyItems = legacyItemRepository.findByUserOrderByCreatedAtDesc(user);
        emailService.sendLegacyEmail(user, legacyItems);
        user.setLegacySent(true);
        userRepository.save(user);
        System.out.println("Legacy email sent to " + user.getEmergencyEmail() + " for user " + user.getUsername());
    }
}
