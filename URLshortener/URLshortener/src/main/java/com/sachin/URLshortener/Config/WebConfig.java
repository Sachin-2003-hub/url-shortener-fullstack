package com.sachin.URLshortener.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow CORS on all endpoints
                .allowedOrigins("http://localhost:5173","https://url-shortener-fullstack-three.vercel.app/") // Allow THIS specific frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow these actions
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
