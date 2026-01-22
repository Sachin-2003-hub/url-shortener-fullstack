package com.sachin.URLshortener.Model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "urls")
@Data

public class UrlEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // This is crucial: H2 will handle the 1, 2, 3... counting for us

    @Column(nullable = false)
    private String longUrl;

    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(nullable = false)
    private long clickCount = 0;

    // --- Getters and Setters ---
    // (If you used Lombok, you could just add @Data at the top instead of these)

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getLongUrl() {
//        return longUrl;
//    }
//
//    public void setLongUrl(String longUrl) {
//        this.longUrl = longUrl;
//    }
//
//    public LocalDateTime getCreatedDate() {
//        return createdDate;
//    }
//
//    public void setCreatedDate(LocalDateTime createdDate) {
//        this.createdDate = createdDate;
//    }
}
