package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import smartemergencydispatcher.model.enums.IncidentStatus;

import java.util.Collection;
import java.util.List;
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Integer> {
    @Query("SELECT i FROM Incident i WHERE i.id = :id")
    Optional<Incident> getIncidentById(@Param("id") Integer id);

    @Query("SELECT i From Incident i WHERE i.status = :status")
    List<Incident> getIncidentByStatus(@Param("status") IncidentStatus status);

    @Query("SELECT i From Incident i WHERE i.type = :type")
    List<Incident> getIncidentByType(@Param("type") IncidentType type);

    @Query("SELECT i From Incident i WHERE i.severityLevel = :severity")
    List<Incident> getIncidentBySeverity(@Param("severity") SeverityLevel severity);


    @Query("SELECT i FROM Incident i")
    List<Incident> findAll();

    @Query("DELETE FROM Incident i WHERE i.id = :id")
    @Modifying
    @Transactional
    void deleteById(@Param("id") Integer theId);

    @Query("UPDATE Incident i SET i.status = :status , i.severityLevel = :severity WHERE i.id = :id")
    @Modifying
    @Transactional
    Incident updateIncident(@Param("id") Integer id, @Param("status") IncidentStatus status , @Param("severity") SeverityLevel severityLevel);
    default List<Incident> findByStatusActive() {
        return findByStatusIn(List.of(IncidentStatus.ASSIGNED, IncidentStatus.ASSIGNED, IncidentStatus.REPORTED));
    }

    List<Incident> findByStatusIn(List<IncidentStatus> assigned);

    long countByStatusIn(List<IncidentStatus> statuses);



    
    @Query("SELECT i FROM Incident i ORDER BY i.reportedTime DESC")
    List<Incident> findAllIncidents();


}
