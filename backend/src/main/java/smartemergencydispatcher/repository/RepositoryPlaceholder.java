package smartemergencydispatcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smartemergencydispatcher.model.ModelPlaceholder;

@Repository
public interface RepositoryPlaceholder extends JpaRepository<ModelPlaceholder, Long> {
}
