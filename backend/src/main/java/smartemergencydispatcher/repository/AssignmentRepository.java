package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {

}
