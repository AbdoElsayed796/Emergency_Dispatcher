package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    @Query("""
           SELECT a.incident.type AS type,
                  AVG(TIMESTAMPDIFF(MINUTE, a.timeAssigned, a.timeAccepted)) AS avgMinutes,
                  MIN(TIMESTAMPDIFF(MINUTE, a.timeAssigned, a.timeAccepted)) AS minMinutes,
                  MAX(TIMESTAMPDIFF(MINUTE, a.timeAssigned, a.timeAccepted)) AS maxMinutes,
                  COUNT(a) AS total
           FROM Assignment a
           WHERE (:type IS NULL OR a.incident.type = :type)
             AND a.timeAssigned BETWEEN :from AND :to
           GROUP BY a.incident.type
           """)
    List<Object[]> getResponseTimeStats(
            @Param("type") IncidentType type,
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

    @Query("""
       SELECT v.id AS vehicleId,
              v.type AS vehicleType,
              d.id AS responderId,
              d.name AS responderName,
              MIN(TIMESTAMPDIFF(MINUTE, a.timeAssigned, a.timeAccepted)) AS minResponse,
              AVG(TIMESTAMPDIFF(MINUTE, a.timeAssigned, a.timeAccepted)) AS avgResponse,
              COUNT(a) AS totalAssignments
       FROM Assignment a
       JOIN a.vehicle v
       JOIN a.dispatcher d
       WHERE (:type IS NULL OR v.type = :type)
         AND a.timeAssigned BETWEEN :from AND :to
         AND a.timeAccepted IS NOT NULL
       GROUP BY v.id, d.id
       ORDER BY minResponse ASC
       """)
    List<Object[]> getTopPerformersByVehicle(
            @Param("type") VehicleType type,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
    @Query("SELECT a.vehicle FROM Assignment a WHERE a.incident.id = :incidentId")
    Optional<Vehicle> findVehicleByIncidentId(@Param("incidentId") Integer incidentId);

}