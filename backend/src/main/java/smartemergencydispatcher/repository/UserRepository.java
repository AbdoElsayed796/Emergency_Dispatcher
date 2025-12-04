package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.enums.Role;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u from User u where u.role = :role")
    List<User> findAllByRole(@Param("role") Role role);
}
