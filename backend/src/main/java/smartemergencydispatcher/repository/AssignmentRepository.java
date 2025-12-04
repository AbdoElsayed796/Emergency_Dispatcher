package smartemergencydispatcher.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.Assignment;


@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {

}
