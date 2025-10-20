package com.example.legacy.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI api() {
        return new OpenAPI()
                .info(new Info().title("Emergency Legacy API").description("API documentation for Emergency Legacy system").version("v1"))
                .externalDocs(new ExternalDocumentation().description("Project Repository").url("https://example.com"));
    }
}
