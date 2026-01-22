package com.sachin.URLshortener.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleHttpExceptions(ResponseStatusException ex) {

    // Create a clean JSON error response
    Map<String, String> errorResponse = new HashMap<>();
    errorResponse.put("error", ex.getReason());
    errorResponse.put("status", String.valueOf(ex.getStatusCode().value()));

    return new ResponseEntity<>(errorResponse, ex.getStatusCode());
}
}
