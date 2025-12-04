package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import smartemergencydispatcher.dto.userdto.UserDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import smartemergencydispatcher.model.enums.Role;

import java.util.List;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.id = :id")
    User getUserById(@Param("id") Integer id);
    @Query("SELECT u From User u WHERE u.email = :email")
    User getUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u")
    List<User> findAll();

    @Query("DELETE FROM User u WHERE u.id = :id")
    @Modifying
    @Transactional
    void deleteById(@Param("id") Integer theId);

    @Query("INSERT INTO User (name, email, password, phone, role) VALUES (:name, :email, :password, :phone, :role)")
    User save(@Param("name") String name ,@Param("email") String email , @Param("password") String password ,@Param("phone") String phone ,@Param("role") Role role );

    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    @Modifying
    @Transactional
    UserDTO updatePassword(@Param("id") Integer id, @Param("password") String password);


    @Query("SELECT i FROM User i WHERE i.id = :id")
    Optional<User> findUserByID(@Param("id") Integer id);
}
