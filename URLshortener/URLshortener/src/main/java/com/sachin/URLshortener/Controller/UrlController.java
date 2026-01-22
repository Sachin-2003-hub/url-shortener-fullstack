package com.sachin.URLshortener.Controller;


import com.sachin.URLshortener.Service.UrlService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class UrlController {

    @Autowired
    private UrlService urlService;
    // API 1: Shorten a URL
    // Input: "https://www.google.com" (as raw text in body)
    // Output: "b" (the short code)
    @PostMapping("/shorten")
    public String shortenUrl(@RequestBody String originalUrl) {
        return urlService.shortenUrl(originalUrl);
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
