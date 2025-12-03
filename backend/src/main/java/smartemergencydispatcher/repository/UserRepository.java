package smartemergencydispatcher.repository;

import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}
