package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.enums.IncidentStatus;

import java.util.Collection;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {
    default List<Incident> findByStatusActive() {
        return findByStatusIn(List.of(IncidentStatus.ASSIGNED, IncidentStatus.ASSIGNED, IncidentStatus.REPORTED));
    }

    List<Incident> findByStatusIn(List<IncidentStatus> assigned);

    long countByStatusIn(List<IncidentStatus> statuses);



}
