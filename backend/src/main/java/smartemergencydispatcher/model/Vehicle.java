package smartemergencydispatcher.model;


import jakarta.persistence.*;
import lombok.Data;
import org.apache.catalina.User;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "vehicle")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false, columnDefinition = "POINT")
    private Point location;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @ManyToOne
    @JoinColumn(name = "responder_user_id", nullable = false)
    private User responder;

    public enum VehicleType {
        FIRE, POLICE, MEDICAL
    }

    public enum VehicleStatus {
        AVAILABLE, ON_ROUTE, BUSY, MAINTENANCE
    }
}
