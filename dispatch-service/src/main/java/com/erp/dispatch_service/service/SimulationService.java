package com.erp.dispatch_service.service;

import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimulationService {

    private record Waypoint(double lat, double lng) {
    }

    private record SimState(double currentLat, double currentLng, Queue<Waypoint> remainingWaypoints) {
    }

    private final ConcurrentHashMap<UUID, SimState> active = new ConcurrentHashMap<>();

    private static final double LERP = 0.15;
    private static final double ARRIVAL_THRESHOLD = 0.005; // ~500 m

    public void register(UUID vehicleId, double startLat, double startLng, double destLat, double destLng) {
        Queue<Waypoint> waypoints = new LinkedList<>();
        waypoints.add(new Waypoint(destLat, destLng));
        active.put(vehicleId, new SimState(startLat, startLng, waypoints));
    }

    /**
     * Register a multi-leg journey. Vehicle moves through each waypoint in order.
     */
    public void registerJourney(UUID vehicleId, double startLat, double startLng, double[][] waypoints) {
        Queue<Waypoint> queue = new LinkedList<>();
        for (double[] wp : waypoints) {
            queue.add(new Waypoint(wp[0], wp[1]));
        }
        active.put(vehicleId, new SimState(startLat, startLng, queue));
    }

    /**
     * Advance the vehicle one lerp step toward its current destination.
     * If it arrives, automatically moves to the next waypoint.
     * 
     * @return new [lat, lng] after the tick, or null if no simulation is active for
     *         this vehicle.
     */
    public double[] tick(UUID vehicleId) {
        SimState s = active.get(vehicleId);
        if (s == null || s.remainingWaypoints.isEmpty())
            return null;

        Waypoint dest = s.remainingWaypoints.peek();
        double newLat = s.currentLat() + (dest.lat() - s.currentLat()) * LERP;
        double newLng = s.currentLng() + (dest.lng() - s.currentLng()) * LERP;

        // Check if arrived at current destination
        if (Math.abs(dest.lat() - newLat) < ARRIVAL_THRESHOLD && Math.abs(dest.lng() - newLng) < ARRIVAL_THRESHOLD) {
            s.remainingWaypoints.remove(); // Move to next waypoint
            if (!s.remainingWaypoints.isEmpty()) {
                // Continue to next waypoint
                Waypoint next = s.remainingWaypoints.peek();
                newLat = next.lat();
                newLng = next.lng();
            } else {
                // No more waypoints, place vehicle at final destination
                newLat = dest.lat();
                newLng = dest.lng();
            }
        }

        active.put(vehicleId, new SimState(newLat, newLng, s.remainingWaypoints));
        return new double[] { newLat, newLng };
    }

    public boolean hasArrived(UUID vehicleId) {
        SimState s = active.get(vehicleId);
        if (s == null || s.remainingWaypoints.isEmpty())
            return false;
        Waypoint dest = s.remainingWaypoints.peek();
        return Math.abs(dest.lat() - s.currentLat()) < ARRIVAL_THRESHOLD
                && Math.abs(dest.lng() - s.currentLng()) < ARRIVAL_THRESHOLD;
    }

    public boolean isActive(UUID vehicleId) {
        SimState s = active.get(vehicleId);
        return s != null && !s.remainingWaypoints.isEmpty();
    }

    public void clear(UUID vehicleId) {
        active.remove(vehicleId);
    }
}
