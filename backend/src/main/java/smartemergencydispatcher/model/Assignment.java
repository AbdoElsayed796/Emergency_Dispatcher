package smartemergencydispatcher.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Integer assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispatcher_user_id", nullable = false)
    private User dispatcher;

    @Column(name = "time_assigned", nullable = false)
    private LocalDateTime timeAssigned;

    @Column(name = "time_accepted")
    private LocalDateTime timeAccepted;

    @Column(name = "time_finished")
    private LocalDateTime timeFinished;
}
