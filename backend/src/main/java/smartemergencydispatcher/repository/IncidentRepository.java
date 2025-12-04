package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Incident;

import java.util.List;
import java.util.Optional;


@Repository
public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    @Query("SELECT i FROM Incident i WHERE i.id = :id")
    Optional<Incident> findIncidentById(@Param("id") Integer id);

    @Query("SELECT i FROM Incident i ORDER BY i.reportedTime DESC")
    List<Incident> findAllIncidents();
}
