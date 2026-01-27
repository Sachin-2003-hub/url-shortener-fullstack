package com.sachin.URLshortener.Controller;


import com.sachin.URLshortener.Service.RateLimitingService;
import com.sachin.URLshortener.Service.UrlService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class UrlController {

    private final RateLimitingService rateLimitingService;

    private final UrlService urlService;
    // API 1: Shorten a URL
    // Input: "https://www.google.com" (as raw text in body)
    // Output: "b" (the short code)
    public UrlController(UrlService urlService, RateLimitingService rateLimitingService) {
        this.urlService = urlService;
        this.rateLimitingService = rateLimitingService;
    }

    @PostMapping("/shorten")
    public ResponseEntity<?> shortenUrl(@RequestBody String originalUrl, HttpServletRequest request) {

        // 1. Get the IP Address of the user
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }

        // 2. Get the Bucket for this IP
        Bucket tokenBucket = rateLimitingService.resolveBucket(ipAddress);

        // 3. Try to consume 1 token
        ConsumptionProbe probe = tokenBucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // ✅ SUCCESS: They have tokens. Shorten the URL.
            String shortCode = urlService.shortenUrl(originalUrl);
            return ResponseEntity.ok(shortCode);
        } else {
            // 🛑 BLOCKED: No tokens left. Return 429 Error.
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Try again in " + waitForRefill + " seconds.");
        }
    }

    // API 2: Redirect to the original URL
    // Input: "b" (in the URL path)
    // Action: Redirects the user's browser to Google
    @GetMapping("/{shortCode}")
    public void redirect(@PathVariable String shortCode, HttpServletResponse response) throws IOException {
        String originalUrl = urlService.getOriginalUrl(shortCode);

        // This sends a "302 Found" status code, telling the browser to go to the new URL
        response.sendRedirect(originalUrl);
    }
    @GetMapping("/stats/{shortCode}")
    public long getStats(@PathVariable String shortCode) {
        return urlService.getClickCount(shortCode);
    }
}
