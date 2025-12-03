package smartemergencydispatcher.repository;

import smartemergencydispatcher.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StationRepository extends JpaRepository<Station, Integer>{
}
