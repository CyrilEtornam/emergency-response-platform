package com.erp.analytics_service.controller;

import com.erp.analytics_service.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(
            @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(service.getDashboard(agency));
    }

    @GetMapping("/incidents/by-type")
    public ResponseEntity<List<Map<String, Object>>> byType(
            @RequestParam(required = false) String agency,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(service.getByType(agency, days));
    }

    @GetMapping("/response-times/trend")
    public ResponseEntity<List<Map<String, Object>>> responseTimeTrend(
            @RequestParam(required = false) String agency,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(service.getResponseTimeTrend(agency, days));
    }

    @GetMapping("/incidents/status-breakdown")
    public ResponseEntity<List<Map<String, Object>>> statusBreakdown(
            @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(service.getStatusBreakdown(agency));
    }

    @GetMapping("/cross-agency")
    public ResponseEntity<Map<String, Object>> crossAgency() {
        return ResponseEntity.ok(service.getCrossAgency());
    }

    @GetMapping("/response-times")
    public ResponseEntity<Map<String, Object>> responseTimes(
            @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(service.getResponseTimes(agency));
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Map<String, Object>>> incidents(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String agency,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(service.getIncidents(type, region, dateFrom, dateTo, agency, status, severity, limit));
    }

    @GetMapping("/incidents/by-region")
    public ResponseEntity<List<Map<String, Object>>> byRegion(
            @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(service.getByRegion(agency));
    }
}
