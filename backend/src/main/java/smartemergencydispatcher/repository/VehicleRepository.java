package smartemergencydispatcher.repository;


import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.model.enums.VehicleType;

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

    @Query(value = """
        SELECT * FROM vehicle v
        WHERE v.type = :type
          AND v.status = :status
        ORDER BY ST_Distance_Sphere(
                    POINT(:lng, :lat),
                    v.location
                 ) ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<Vehicle> findNearestVehicle(
            @Param("type") String type,
            @Param("status") String status,
            @Param("lat") Double latitude,
            @Param("lng") Double longitude
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicle v WHERE v.status = :status AND v.type = :type")
    List<Vehicle> findAvailableVehiclesForType(@Param("status") VehicleStatus status, @Param("type") VehicleType type);


}

