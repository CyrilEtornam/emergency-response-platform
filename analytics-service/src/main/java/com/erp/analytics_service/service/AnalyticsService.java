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
    /**
     * GET /analytics/dashboard
     * Returns performance overview matching frontend expectations:
     * {
     * totalIncidentsToday: number,
     * avgResponseTimeMinutes: number,
     * vehiclesDeployed: number,
     * incidentsResolvedToday: number,
     * totalActiveIncidents: number,
     * ... (legacy fields for backward compatibility)
     * }
     */
    public Map<String, Object> getDashboard(String agency) {
        String typeFilter = agencyToType(agency);
        String where = typeFilter != null ? "WHERE type = '" + typeFilter + "'" : "";

        // Frontend required fields
        long totalToday = count("SELECT COUNT(*) FROM incidents " +
                where(where, "DATE(created_at) = CURRENT_DATE"));
        long resolvedToday = count("SELECT COUNT(*) FROM incidents " +
                where(where, "DATE(created_at) = CURRENT_DATE AND status = 'RESOLVED'"));
        long totalActive = count("SELECT COUNT(*) FROM incidents " +
                where(where, "status != 'RESOLVED'"));

        // Calculate avg response time for resolved incidents (in minutes)
        String avgTimeQuery = """
                SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60)::numeric, 1), 0)
                FROM incidents
                %s
                AND status = 'RESOLVED'
                AND updated_at > created_at
                """.formatted(where.isEmpty() ? "WHERE TRUE" : where);
        Double avgResponseMinutes = jdbc.queryForObject(avgTimeQuery, Double.class);

        // Count vehicles currently EN_ROUTE or ON_SCENE (deployed)
        // Note: This queries incident_db, but vehicles are in dispatch_db
        // For now, count incidents that are EN_ROUTE as a proxy
        long vehiclesDeployed = count("SELECT COUNT(DISTINCT vehicle_id) FROM incidents " +
                where(where, "status IN ('ASSIGNED', 'EN_ROUTE') AND vehicle_id IS NOT NULL"));

        // Legacy fields for backward compatibility
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
        // Frontend required fields (must be first)
        result.put("totalIncidentsToday", totalToday);
        result.put("avgResponseTimeMinutes", avgResponseMinutes != null ? avgResponseMinutes : 0.0);
        result.put("vehiclesDeployed", vehiclesDeployed);
        result.put("incidentsResolvedToday", resolvedToday);
        result.put("totalActiveIncidents", totalActive);
        // Legacy fields
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

    // ─── Response times
    // ───────────────────────────────────────────────────────────
    /**
     * GET /analytics/response-times
     * Returns: { avgSeconds: number, byRegion: [...], byType: [...] }
     * Fallback to direct incident calculation if response_metrics table is empty
     */
    public Map<String, Object> getResponseTimes(String agency) {
        String typeFilter = agencyToType(agency);
        String typeClause = typeFilter != null ? "AND type = '" + typeFilter + "'" : "";

        // Calculate from incidents table directly (fallback)
        String avgSecondsQuery = """
                SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 0)
                FROM incidents
                WHERE status = 'RESOLVED'
                  AND updated_at > created_at
                  %s
                """.formatted(typeClause);
        Double avgSeconds = jdbc.queryForObject(avgSecondsQuery, Double.class);

        // By region - extract approximate region from lat/lng buckets
        String byRegionQuery = """
                SELECT
                    CASE
                        WHEN latitude BETWEEN 5.5 AND 5.8 AND longitude BETWEEN -0.3 AND 0.0 THEN 'Greater Accra'
                        WHEN latitude BETWEEN 6.5 AND 7.0 AND longitude BETWEEN -1.7 AND -1.5 THEN 'Ashanti'
                        WHEN latitude BETWEEN 9.2 AND 9.6 AND longitude BETWEEN -0.9 AND -0.7 THEN 'Northern'
                        WHEN latitude BETWEEN 5.0 AND 5.3 AND longitude BETWEEN -1.3 AND -1.1 THEN 'Central'
                        WHEN latitude BETWEEN 4.7 AND 5.0 AND longitude BETWEEN -1.9 AND -1.6 THEN 'Western'
                        WHEN latitude BETWEEN 6.0 AND 6.2 AND longitude BETWEEN -0.4 AND -0.1 THEN 'Eastern'
                        WHEN latitude BETWEEN 6.5 AND 6.7 AND longitude BETWEEN 0.3 AND 0.6 THEN 'Volta'
                        ELSE 'Other'
                    END AS region,
                    COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 0) AS avg_seconds
                FROM incidents
                WHERE status = 'RESOLVED'
                  AND updated_at > created_at
                  %s
                GROUP BY region
                ORDER BY avg_seconds ASC
                """.formatted(typeClause);
        List<Map<String, Object>> byRegion = jdbc.queryForList(byRegionQuery);

        // By type
        String byTypeQuery = """
                SELECT type, COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 0) AS avg_seconds
                FROM incidents
                WHERE status = 'RESOLVED'
                  AND updated_at > created_at
                  %s
                GROUP BY type
                ORDER BY type
                """.formatted(typeClause);
        List<Map<String, Object>> byType = jdbc.queryForList(byTypeQuery);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("avgSeconds", avgSeconds != null ? avgSeconds.longValue() : 0L);
        result.put("byRegion", byRegion);
        result.put("byType", byType);
        return result;
    }

    // ─── Incidents list (enhanced) ────────────────────────────────────────────
    /**
     * GET /analytics/incidents
     * Supports optional filters: type, region, dateFrom, dateTo, agency, status,
     * severity, limit
     */
    public List<Map<String, Object>> getIncidents(String type, String region, String dateFrom,
            String dateTo, String agency, String status,
            String severity, int limit) {
        List<String> clauses = new ArrayList<>();

        // Type filter (can come from 'type' or 'agency' param)
        String typeFilter = type != null ? type.toUpperCase() : agencyToType(agency);
        if (typeFilter != null)
            clauses.add("type = '" + typeFilter + "'");

        if (status != null && !status.isBlank())
            clauses.add("status = '" + status.toUpperCase() + "'");
        if (severity != null && !severity.isBlank())
            clauses.add("severity = '" + severity.toUpperCase() + "'");

        // Date range filters
        if (dateFrom != null && !dateFrom.isBlank()) {
            clauses.add("DATE(created_at) >= DATE('" + dateFrom + "')");
        }
        if (dateTo != null && !dateTo.isBlank()) {
            clauses.add("DATE(created_at) <= DATE('" + dateTo + "')");
        }

        // Region filter - approximate based on coordinates
        if (region != null && !region.isBlank()) {
            String regionClause = switch (region) {
                case "Greater Accra" -> "(latitude BETWEEN 5.5 AND 5.8 AND longitude BETWEEN -0.3 AND 0.0)";
                case "Ashanti" -> "(latitude BETWEEN 6.5 AND 7.0 AND longitude BETWEEN -1.7 AND -1.5)";
                case "Northern" -> "(latitude BETWEEN 9.2 AND 9.6 AND longitude BETWEEN -0.9 AND -0.7)";
                case "Central" -> "(latitude BETWEEN 5.0 AND 5.3 AND longitude BETWEEN -1.3 AND -1.1)";
                case "Western" -> "(latitude BETWEEN 4.7 AND 5.0 AND longitude BETWEEN -1.9 AND -1.6)";
                case "Eastern" -> "(latitude BETWEEN 6.0 AND 6.2 AND longitude BETWEEN -0.4 AND -0.1)";
                case "Volta" -> "(latitude BETWEEN 6.5 AND 6.7 AND longitude BETWEEN 0.3 AND 0.6)";
                default -> "TRUE";
            };
            clauses.add(regionClause);
        }

        String where = clauses.isEmpty() ? "" : "WHERE " + String.join(" AND ", clauses);
        String sql = "SELECT * FROM incidents " + where
                + " ORDER BY created_at DESC LIMIT " + Math.min(limit, 200);

        return jdbc.queryForList(sql).stream().map(r -> {
            Map<String, Object> m = new LinkedHashMap<>(r);
            // Convert timestamps to ISO strings
            if (r.get("created_at") != null)
                m.put("createdAt", r.get("created_at").toString());
            if (r.get("updated_at") != null)
                m.put("updatedAt", r.get("updated_at").toString());
            if (r.get("reported_by") != null)
                m.put("reportedBy", r.get("reported_by"));
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

    /**
     * Append an additional condition to an existing WHERE clause (or start one).
     */
    private String where(String existing, String extra) {
        if (existing == null || existing.isBlank())
            return "WHERE " + extra;
        return existing + " AND " + extra;
    }

    private String agencyToType(String agency) {
        if (agency == null || agency.isBlank())
            return null;
        return switch (agency.toUpperCase()) {
            case "MEDICAL", "HOSPITAL" -> "MEDICAL";
            case "POLICE" -> "POLICE";
            case "FIRE" -> "FIRE";
            default -> null;
        };
    }

    private String typeToAgency(String type) {
        if (type == null)
            return "UNKNOWN";
        return switch (type) {
            case "MEDICAL" -> "HOSPITAL";
            case "POLICE" -> "POLICE";
            case "FIRE" -> "FIRE";
            default -> type;
        };
    }
}
