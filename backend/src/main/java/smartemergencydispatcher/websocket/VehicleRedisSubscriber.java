package smartemergencydispatcher.websocket;

import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.vehicledto.VehicleLiveDTO;
import tools.jackson.databind.ObjectMapper;

@Component
public class VehicleRedisSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public VehicleRedisSubscriber(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody());
            VehicleLiveDTO vehicle = objectMapper.readValue(json, VehicleLiveDTO.class);

            // PUSH TO FRONTEND
            messagingTemplate.convertAndSend("/topic/vehicles", vehicle);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
