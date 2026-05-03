package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // ✅ NEW METHOD: Update time_finished by assignment_id
    @Modifying
    @Query(value = "UPDATE assignment SET time_accepted = CURRENT_TIMESTAMP, time_finished = CURRENT_TIMESTAMP WHERE assignment_id = :assignmentId", nativeQuery = true)
    int updateTimeAcceptedAndFinished(@Param("assignmentId") Integer assignmentId);
    // Updated query: Calculate diff between time_finished and time_assigned
    @Query(value = """
    SELECT i.type AS type,
           AVG(TIMESTAMPDIFF(SECOND, a.time_assigned, a.time_finished) / 60.0) AS avgMinutes,
           MIN(TIMESTAMPDIFF(SECOND, a.time_assigned, a.time_finished) / 60.0) AS minMinutes,
           MAX(TIMESTAMPDIFF(SECOND, a.time_assigned, a.time_finished) / 60.0) AS maxMinutes,
           COUNT(*) AS total
    FROM assignment a
    JOIN incident i ON a.incident_id = i.id
    WHERE (:type IS NULL OR i.type = :type)
      AND a.time_assigned BETWEEN :from AND :to
      AND a.time_finished IS NOT NULL
    GROUP BY i.type
    """, nativeQuery = true)
    List<Object[]> getResponseTimeStats(
            @Param("type") String type,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
    List<Assignment> findByVehicleTypeAndTimeAssignedBetween(
            VehicleType vehicleType,
            LocalDateTime from,
            LocalDateTime to
    );

    List<Assignment> findByTimeAssignedBetween(
            LocalDateTime from,
            LocalDateTime to
    );

    // Updated query: Calculate diff between time_finished and time_assigned
    @Query(value = """
    SELECT v.id AS vehicleId,
           v.type AS vehicleType,
           d.id AS responderId,
           d.name AS responderName,
           MIN(TIMESTAMPDIFF(SECOND, a.time_assigned, a.time_finished) / 60.0) AS minResponse,
           AVG(TIMESTAMPDIFF(SECOND, a.time_assigned, a.time_finished) / 60.0) AS avgResponse,
           COUNT(*) AS totalAssignments
    FROM assignment a
    JOIN vehicle v ON a.vehicle_id = v.id
    JOIN dispatcher d ON a.dispatcher_id = d.id
    JOIN incident i ON a.incident_id = i.id
    WHERE (:type IS NULL OR v.type = :type)
      AND a.time_assigned BETWEEN :from AND :to
      AND a.time_finished IS NOT NULL
    GROUP BY v.id, d.id
    ORDER BY minResponse ASC
    """, nativeQuery = true)
    List<Object[]> getTopPerformersByVehicle(
            @Param("type") String type,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("SELECT a.vehicle FROM Assignment a WHERE a.incident.id = :incidentId")
    Optional<Vehicle> findVehicleByIncidentId(@Param("incidentId") Integer incidentId);

    @Query("SELECT a FROM Assignment a WHERE a.incident.id = :incidentId")
    Optional<Assignment> findByIncidentId(@Param("incidentId") Long incidentId);

    List<Assignment> findAllByIncidentId(Long incidentId);
}