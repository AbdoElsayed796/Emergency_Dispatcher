package smartemergencydispatcher.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserLoginDTO;
import smartemergencydispatcher.service.User.UserService;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDto) {
        String email = loginDto.getEmail();
        String password = loginDto.getPassword();
        UserDTO userDto = userService.getUserByEmail(email, password);
        Map<String, Object> response = new HashMap<>();
        if (userDto == null) {
            response.put("success",0) ;
            response.put("message", "Invalid email or password");
            return ResponseEntity.ok(response);
        }
        String token = generateToken(userDto);

        response.put("success", 1);
        response.put("token", token);
        response.put("user", userDto);
        response.put("message", "Login successful");
        
        return ResponseEntity.ok(response);
    }
    
    private String generateToken(UserDTO userDto) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(userDto.getEmail())
                .claim("id", userDto.getId())
                .claim("role", userDto.getRole().name())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    private Key getSigningKey() {
        // If jwtSecret is not set, use a default (not recommended for production)
        String secret = jwtSecret != null ? jwtSecret : "defaultSecretKeyShouldBeVeryLongAndSecureInProduction";
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    @PostMapping("/newUser")
    public UserDTO getUser(@RequestBody UserCreateDTO userCreateDTO) {
        UserDTO saved = userService.save(userCreateDTO);
        return saved ;
    }
}