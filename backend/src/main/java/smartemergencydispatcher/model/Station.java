package smartemergencydispatcher.model;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import smartemergencydispatcher.model.enums.StationType;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "station")
@Data
@AllArgsConstructor
@NoArgsConstructor
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
    @JdbcTypeCode(SqlTypes.GEOMETRY)
    private Point location;
}
