package com.vl.vilniuslife.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Semaphore;

@RestController
public class GeoController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Semaphore semaphore = new Semaphore(1);

    private String getPhoton(String url) throws Exception {
        semaphore.acquire();
        try {
            Thread.sleep(1000); // no actual limit in the documentation but developer has commented several times to keep it at 1 request per second.
            return restTemplate.getForObject(url, String.class);
        } finally {
            semaphore.release();
        }
    }

    @GetMapping("/api/geocode")
    public ResponseEntity<String> geocode(@RequestParam String q) {
        String url = "https://photon.komoot.io/api/?q=" + URLEncoder.encode(q, StandardCharsets.UTF_8) + "&limit=1&bbox=24.96,54.56,25.48,54.83";
        try {
            return ResponseEntity.ok(getPhoton(url));
        } catch (Exception e) {
            return ResponseEntity.status(503).body("Service unavailable");
        }
    }

    @GetMapping("/api/reverse")
    public ResponseEntity<String> reverse(@RequestParam double lat, @RequestParam double lon) {
        String url = "https://photon.komoot.io/reverse?lat=" + lat + "&lon=" + lon + "&limit=1";
    	try {
            return ResponseEntity.ok(getPhoton(url));
    	} catch (Exception e) {
            return ResponseEntity.status(503).body("Service unavailable");
    	}
    }
}
