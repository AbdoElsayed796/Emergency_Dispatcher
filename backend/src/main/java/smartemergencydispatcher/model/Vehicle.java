package smartemergencydispatcher.model;


import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.model.enums.VehicleType;

@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responder_user_id", nullable = false)
    private User responder;


}
