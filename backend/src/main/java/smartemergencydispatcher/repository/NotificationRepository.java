package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import smartemergencydispatcher.model.Notification;
import smartemergencydispatcher.model.enums.Role;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query("SELECT n FROM Notification n " +
            "WHERE n.role = :role AND n.read = false " +
            "ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByRoleOrdered(@Param("role") Role role);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :id")
    void markAsRead(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.role = :role")
    void markAllAsRead(@Param("role") Role role);

    @Query("SELECT n.role FROM Notification n WHERE n.id = :id")
    Role findRoleById(@Param("id") Integer id);

    @Query("SELECT n.role FROM Notification n WHERE n.incident.id = :incidentId")
    Role findRoleByIncidentId(@Param("incidentId") Integer incidentId);

    @Modifying
    @Query("UPDATE Notification n " +
            "SET n.type = 'INCIDENT_RESOLVED' " +
            "WHERE n.incident.id = :incidentId AND n.type = 'NEW_INCIDENT'")
    void markIncidentResolved(@Param("incidentId") Integer incidentId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = false WHERE n.id = :id")
    void markAsUnRead(@Param("id") Integer id);

    @Modifying
    @Query("UPDATE Notification n " +
            "SET n.type = 'INCIDENT_RESOLVED', n.read = false " +
            "WHERE n.incident.id = :incidentId AND n.type = 'NEW_INCIDENT'")
    void markIncidentResolvedAndUnread(@Param("incidentId") Integer incidentId);

}

