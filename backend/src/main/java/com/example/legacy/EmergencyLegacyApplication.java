package com.example.legacy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EmergencyLegacyApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmergencyLegacyApplication.class, args);
    }
}
