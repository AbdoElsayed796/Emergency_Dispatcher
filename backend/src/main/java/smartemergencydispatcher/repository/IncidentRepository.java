package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {
}
