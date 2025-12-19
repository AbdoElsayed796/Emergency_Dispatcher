package smartemergencydispatcher.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.assignmentdto.AssignmentCreateDTO;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;
import smartemergencydispatcher.mapper.AssignmentMapper;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.service.AssignmentService;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final AssignmentMapper assignmentMapper;

    @PostMapping("/create")
    public ResponseEntity<AssignmentDTO> createAssignment(@RequestBody AssignmentCreateDTO assignmentCreateDTO){
        try {
            System.out.println(assignmentCreateDTO.getDispatcherId());
            System.out.println(assignmentCreateDTO.getIncidentId());
            System.out.println(assignmentCreateDTO.getVehicleId());
            System.out.println("+++++++++++++++++++++++");
            Assignment assignment = assignmentService.assignVehicleToIncident(assignmentCreateDTO);
            AssignmentDTO dto = assignmentMapper.toDTO(assignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

    }
}
