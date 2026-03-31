package com.erp.incident_service.service;

/**
 * Geolocation utility methods for distance calculations
 */
public class GeoUtils {

    /**
     * Calculate distance between two coordinates using Haversine formula
     * 
     * @param lat1 Latitude of point 1
     * @param lng1 Longitude of point 1
     * @param lat2 Latitude of point 2
     * @param lng2 Longitude of point 2
     * @return Distance in kilometers
     */
    public static double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371; // Earth's radius in kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Round distance to 2 decimal places
     */
    public static double roundDistance(double km) {
        return Math.round(km * 100.0) / 100.0;
    }
}
