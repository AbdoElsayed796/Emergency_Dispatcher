package smartemergencydispatcher.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import smartemergencydispatcher.repository.NotificationRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationCleanupService {

    private final NotificationRepository notificationRepository;

    // Runs every day at midnight (00:00:00)
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deleteReadNotifications() {
        log.info("Starting daily cleanup of read notifications");
        int deletedCount = notificationRepository.deleteByReadTrue();
        log.info("Deleted {} read notifications", deletedCount);
    }

    // Alternative: Delete read notifications older than current day
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deleteReadNotificationsFromPreviousDays() {
        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        int deletedCount = notificationRepository.deleteByReadTrueAndCreatedAtBefore(startOfToday);
        log.info("Deleted {} read notifications from previous days", deletedCount);
    }
}