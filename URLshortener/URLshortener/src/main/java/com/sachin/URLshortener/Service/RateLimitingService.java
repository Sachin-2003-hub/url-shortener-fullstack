package com.sachin.URLshortener.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {
    // Store buckets in memory (Map<IP Address, Bucket>)
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    // Logic to get or create a bucket for an IP
    public Bucket resolveBucket(String ipAddress) {
        return cache.computeIfAbsent(ipAddress, this::createNewBucket);
    }

    private Bucket createNewBucket(String s) {
        // Define the limit: 10 requests per 1 minute
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));

        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }
}
