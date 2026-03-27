package com.erp.analytics_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final JdbcTemplate jdbc;

    // ─── Dashboard summary ────────────────────────────────────────────────────

    public Map<String, Object> getDashboard(String agency) {
        String typeFilter = agencyToType(agency);
        String where = typeFilter != null ? "WHERE type = '" + typeFilter + "'" : "";

        long total = count("SELECT COUNT(*) FROM incidents " + where);
        long active = count("SELECT COUNT(*) FROM incidents " + where(where, "status != 'RESOLVED'"));
        long resolved = count("SELECT COUNT(*) FROM incidents " + where(where, "status = 'RESOLVED'"));
        long critical = count("SELECT COUNT(*) FROM incidents " + where(where, "severity = 'CRITICAL'"));

        Map<String, Object> byType = new LinkedHashMap<>();
        for (String t : List.of("MEDICAL", "POLICE", "FIRE")) {
            byType.put(t, count("SELECT COUNT(*) FROM incidents WHERE type = '" + t + "'"));
        }

        Map<String, Object> bySeverity = new LinkedHashMap<>();
        for (String s : List.of("CRITICAL", "HIGH", "MEDIUM", "LOW")) {
            String q = "SELECT COUNT(*) FROM incidents " + where(where, "severity = '" + s + "'");
            bySeverity.put(s, count(q));
        }

        Map<String, Object> byStatus = new LinkedHashMap<>();
        for (String s : List.of("REPORTED", "ASSIGNED", "EN_ROUTE", "RESOLVED")) {
            String q = "SELECT COUNT(*) FROM incidents " + where(where, "status = '" + s + "'");
            byStatus.put(s, count(q));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalIncidents", total);
        result.put("activeIncidents", active);
        result.put("resolvedIncidents", resolved);
        result.put("criticalIncidents", critical);
        result.put("byType", byType);
        result.put("bySeverity", bySeverity);
        result.put("byStatus", byStatus);
        return result;
    }

    // ─── Incidents by type over time ──────────────────────────────────────────

    public List<Map<String, Object>> getByType(String agency, int days) {
        String typeFilter = agencyToType(agency);
        String typeClause = typeFilter != null ? "AND type = '" + typeFilter + "'" : "";

        String sql = """
                SELECT DATE(created_at) AS day, type, COUNT(*) AS count
                FROM incidents
                WHERE created_at >= NOW() - INTERVAL '%d days'
                %s
                GROUP BY day, type
                ORDER BY day ASC
                """.formatted(days, typeClause);

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("date", r.get("day").toString());
            m.put("type", r.get("type"));
            m.put("count", r.get("count"));
            return m;
        }).toList();
    }

    // ─── Response time trend ──────────────────────────────────────────────────

    public List<Map<String, Object>> getResponseTimeTrend(String agency, int days) {
        String typeFilter = agencyToType(agency);
        String typeClause = typeFilter != null ? "AND type = '" + typeFilter + "'" : "";

        String sql = """
                SELECT DATE(created_at) AS day,
                       ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60)::numeric, 1) AS avg_minutes
                FROM incidents
                WHERE status = 'RESOLVED'
                  AND created_at >= NOW() - INTERVAL '%d days'
                  %s
                GROUP BY day
                ORDER BY day ASC
                """.formatted(days, typeClause);

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("date", r.get("day").toString());
            m.put("avgMinutes", r.get("avg_minutes"));
            return m;
        }).toList();
    }

    // ─── Status breakdown ─────────────────────────────────────────────────────

    public List<Map<String, Object>> getStatusBreakdown(String agency) {
        String typeFilter = agencyToType(agency);
        String typeClause = typeFilter != null ? "WHERE type = '" + typeFilter + "'" : "";

        String sql = "SELECT status, COUNT(*) AS count FROM incidents " + typeClause
                + " GROUP BY status ORDER BY count DESC";

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("status", r.get("status"));
            m.put("count", r.get("count"));
            return m;
        }).toList();
    }

    // ─── Cross-agency stats ───────────────────────────────────────────────────

    public List<Map<String, Object>> getCrossAgency() {
        String sql = """
                SELECT type,
                       COUNT(*) AS total,
                       SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved,
                       SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) AS critical
                FROM incidents
                GROUP BY type
                ORDER BY type
                """;

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("agency", typeToAgency((String) r.get("type")));
            m.put("type", r.get("type"));
            m.put("total", r.get("total"));
            m.put("resolved", r.get("resolved"));
            m.put("critical", r.get("critical"));
            return m;
        }).toList();
    }

    // ─── Incidents list ───────────────────────────────────────────────────────

    public List<Map<String, Object>> getIncidents(String agency, String status,
                                                   String severity, int limit) {
        List<String> clauses = new ArrayList<>();
        String typeFilter = agencyToType(agency);
        if (typeFilter != null) clauses.add("type = '" + typeFilter + "'");
        if (status != null && !status.isBlank()) clauses.add("status = '" + status.toUpperCase() + "'");
        if (severity != null && !severity.isBlank()) clauses.add("severity = '" + severity.toUpperCase() + "'");

        String where = clauses.isEmpty() ? "" : "WHERE " + String.join(" AND ", clauses);
        String sql = "SELECT * FROM incidents " + where
                + " ORDER BY created_at DESC LIMIT " + Math.min(limit, 200);

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>(r);
            // Convert timestamps to ISO strings
            if (r.get("created_at") != null) m.put("createdAt", r.get("created_at").toString());
            if (r.get("updated_at") != null) m.put("updatedAt", r.get("updated_at").toString());
            if (r.get("reported_by") != null) m.put("reportedBy", r.get("reported_by"));
            return m;
        }).toList();
    }

    // ─── By region (lat/lon buckets) ──────────────────────────────────────────

    public List<Map<String, Object>> getByRegion(String agency) {
        String typeFilter = agencyToType(agency);
        String typeClause = typeFilter != null ? "WHERE type = '" + typeFilter + "'" : "";

        // Bucket into ~10km grid cells
        String sql = """
                SELECT ROUND(latitude::numeric, 1) AS lat_bucket,
                       ROUND(longitude::numeric, 1) AS lon_bucket,
                       COUNT(*) AS count
                FROM incidents
                %s
                GROUP BY lat_bucket, lon_bucket
                ORDER BY count DESC
                LIMIT 50
                """.formatted(typeClause);

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("latitude", r.get("lat_bucket"));
            m.put("longitude", r.get("lon_bucket"));
            m.put("count", r.get("count"));
            return m;
        }).toList();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private long count(String sql) {
        Long result = jdbc.queryForObject(sql, Long.class);
        return result != null ? result : 0L;
    }

    /** Append an additional condition to an existing WHERE clause (or start one). */
    private String where(String existing, String extra) {
        if (existing == null || existing.isBlank()) return "WHERE " + extra;
        return existing + " AND " + extra;
    }

    private String agencyToType(String agency) {
        if (agency == null || agency.isBlank()) return null;
        return switch (agency.toUpperCase()) {
            case "MEDICAL", "HOSPITAL" -> "MEDICAL";
            case "POLICE"              -> "POLICE";
            case "FIRE"                -> "FIRE";
            default                    -> null;
        };
    }

    private String typeToAgency(String type) {
        if (type == null) return "UNKNOWN";
        return switch (type) {
            case "MEDICAL" -> "HOSPITAL";
            case "POLICE"  -> "POLICE";
            case "FIRE"    -> "FIRE";
            default        -> type;
        };
    }
}
