package smartemergencydispatcher.model;


import jakarta.persistence.*;
import lombok.Data;

import java.awt.*;

@Entity
@Table(name = "station")
@Data
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StationType type;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, unique = true, length = 16)
    private String phone;

    @Column(nullable = false, columnDefinition = "POINT")
    private Point location;

    public enum StationType {
        FIRE, POLICE, MEDICAL
    }
}
