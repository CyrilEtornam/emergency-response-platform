package com.erp.dispatch_service.service;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SimulationService {

    private record SimState(double currentLat, double currentLng, double destLat, double destLng) {}

    private final ConcurrentHashMap<UUID, SimState> active = new ConcurrentHashMap<>();

    private static final double LERP = 0.15;
    private static final double ARRIVAL_THRESHOLD = 0.005; // ~500 m

    public void register(UUID vehicleId, double startLat, double startLng, double destLat, double destLng) {
        active.put(vehicleId, new SimState(startLat, startLng, destLat, destLng));
    }

    /**
     * Advance the vehicle one lerp step toward its destination.
     * @return new [lat, lng] after the tick, or null if no simulation is active for this vehicle.
     */
    public double[] tick(UUID vehicleId) {
        SimState s = active.get(vehicleId);
        if (s == null) return null;
        double newLat = s.currentLat() + (s.destLat() - s.currentLat()) * LERP;
        double newLng = s.currentLng() + (s.destLng() - s.currentLng()) * LERP;
        active.put(vehicleId, new SimState(newLat, newLng, s.destLat(), s.destLng()));
        return new double[]{newLat, newLng};
    }

    public boolean hasArrived(UUID vehicleId) {
        SimState s = active.get(vehicleId);
        if (s == null) return false;
        return Math.abs(s.destLat() - s.currentLat()) < ARRIVAL_THRESHOLD
                && Math.abs(s.destLng() - s.currentLng()) < ARRIVAL_THRESHOLD;
    }

    public boolean isActive(UUID vehicleId) {
        return active.containsKey(vehicleId);
    }

    public void clear(UUID vehicleId) {
        active.remove(vehicleId);
    }
}
