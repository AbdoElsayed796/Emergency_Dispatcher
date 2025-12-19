package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.VehicleStatus;

import java.util.List;

import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    long countByStatus(VehicleStatus status);
    long countByStatusIn(List<VehicleStatus> statuses);


    @Query("SELECT v FROM Vehicle v JOIN FETCH v.station JOIN FETCH v.responder")
    List<Vehicle> findAllVehicles();


    @Query("SELECT v FROM Vehicle v JOIN FETCH v.station JOIN FETCH v.responder " +
            "WHERE v.status = 'AVAILABLE'")
    List<Vehicle> findAllAvailableVehicles();

    @Query("SELECT i FROM Vehicle i WHERE i.id = :id")
    Optional<Vehicle> findVehicleByID(@Param("id") Integer id);
}

