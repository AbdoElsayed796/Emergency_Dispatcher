package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT i FROM User i WHERE i.id = :id")
    Optional<User> findUserByID(@Param("id") Integer id);
}
