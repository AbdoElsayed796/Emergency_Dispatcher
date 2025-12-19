package smartemergencydispatcher.repository;

import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface StationRepository extends JpaRepository<Station, Integer>{
}
