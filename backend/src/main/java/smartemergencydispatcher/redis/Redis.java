package smartemergencydispatcher.redis;
import org.springframework.stereotype.Component;
import redis.clients.jedis.*;
import smartemergencydispatcher.model.enums.VehicleStatus;

import java.util.HashMap;
import java.util.Map;

@Component
public class Redis {
    private final RedisClient jedis;
    
    public Redis() {
        this.jedis = RedisClient.builder().hostAndPort(HostAndPort.from("localhost:6379")).build();
    }
    public long setItems (Integer id , VehicleStatus status , String longitude , String latitude ){
        String key = "vec"+id.toString();
        long res=-1;
        Map<String, String> hash = new HashMap<>();
        if (status!= null){
            hash.put("status",status.toString());
        }
        if (longitude!= null){
            hash.put("long" , longitude);
        }
        if (latitude!=null){
            hash.put("lat" , latitude);
        }
//        System.out.println("that is the key of the saved data: "+ key);
//        System.out.println("that is the saved data: "+ hash);
        res = jedis.hset(key, hash);
        return res ;
    }
    public Map<String,String> getItems (Integer id ){
        String key = "vec"+id.toString();
        Map<String, String> items = jedis.hgetAll(key);
//        System.out.println("that is the key of the required data: "+ key);
//        System.out.println("that is the required data: "+ items);
        return items;
    }
}
