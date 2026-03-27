package com.erp.dispatch_service.controller;

import com.erp.dispatch_service.dto.StationResponse;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.StationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationRepository repo;

    @GetMapping
    public ResponseEntity<List<StationResponse>> list(
            @RequestParam(required = false) String agency) {
        List<StationResponse> result = agency != null && !agency.isBlank()
                ? repo.findByAgencyOrderByNameAsc(Vehicle.Agency.valueOf(agency.toUpperCase()))
                      .stream().map(StationResponse::from).toList()
                : repo.findAllByOrderByAgencyAscNameAsc()
                      .stream().map(StationResponse::from).toList();
        return ResponseEntity.ok(result);
    }
}
