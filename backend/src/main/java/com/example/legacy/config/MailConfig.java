package com.example.legacy.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "app.email.enabled", havingValue = "true")
public class MailConfig {
}
