package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
}

