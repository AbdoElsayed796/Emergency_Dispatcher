package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;
import smartemergencydispatcher.service.assignment.AssignmentService;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    List<AssignmentDTO> getAssignmentsByVehicleId(@RequestParam Integer vehicleId) {
        return assignmentService.getAssignmentsByVehicleId(vehicleId);
    }

    @PatchMapping("/accept")
    AssignmentDTO accept(@RequestParam Integer assignmentId) {
        return assignmentService.accept(assignmentId);
    }

    @PatchMapping("/resolve")
    AssignmentDTO resolve(@RequestParam Integer assignmentId) {
        return assignmentService.resolve(assignmentId);
    }
}
