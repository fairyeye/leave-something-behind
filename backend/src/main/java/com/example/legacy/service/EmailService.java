package com.example.legacy.service;

import com.example.legacy.model.LegacyItem;
import com.example.legacy.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    @Value("${app.email.enabled:false}")
    private Boolean emailEnabled;

    public void sendLegacyEmail(User user, List<LegacyItem> legacyItems) {
        if (!emailEnabled || mailSender == null || user.getEmergencyEmail() == null || user.getEmergencyEmail().isEmpty()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmergencyEmail());
            message.setSubject("紧急通知：" + user.getUsername() + " 的遗留信息");
            message.setText(buildEmailContent(user, legacyItems));
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + user.getEmergencyEmail() + ": " + e.getMessage());
        }
    }

    private String buildEmailContent(User user, List<LegacyItem> legacyItems) {
        StringBuilder content = new StringBuilder();
        content.append("您好，\n\n");
        content.append("用户 ").append(user.getUsername()).append(" 已超过 ")
                .append(user.getInactivityDays()).append(" 天未登录系统。\n");
        content.append("根据用户预先设置，现将其维护的重要信息发送给您：\n\n");
        content.append("========================================\n\n");

        if (legacyItems.isEmpty()) {
            content.append("该用户暂未维护任何遗留信息。\n");
        } else {
            for (int i = 0; i < legacyItems.size(); i++) {
                LegacyItem item = legacyItems.get(i);
                content.append((i + 1)).append(". ").append(item.getTitle()).append("\n");
                content.append("   类别：").append(item.getCategory().name()).append("\n");
                content.append("   内容：\n");
                content.append("   ").append(item.getContent().replace("\n", "\n   ")).append("\n\n");
            }
        }

        content.append("========================================\n\n");
        content.append("此邮件由系统自动发送，请勿回复。\n");
        content.append("如有疑问，请联系系统管理员。\n");

        return content.toString();
    }
}
