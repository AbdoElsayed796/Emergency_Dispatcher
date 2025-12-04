package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.VehicleStatus;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    long countByStatus(VehicleStatus status);
    long countByStatusIn(List<VehicleStatus> statuses);

}

