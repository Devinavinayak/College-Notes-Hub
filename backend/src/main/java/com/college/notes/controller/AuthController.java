package com.college.notes.controller;
import com.college.notes.dto.AuthDtos.*; import com.college.notes.service.AuthService; import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
 private final AuthService auth;
 public AuthController(AuthService auth){this.auth=auth;}
 @PostMapping("/register") public AuthResponse register(@Valid @RequestBody RegisterRequest request){return auth.register(request);}
 @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest request){return auth.login(request);}
 @PostMapping("/password-reset/request") public MessageResponse requestPasswordReset(@Valid @RequestBody PasswordResetRequest request){return auth.requestPasswordReset(request);}
 @PostMapping("/password-reset/confirm") public MessageResponse confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request){return auth.confirmPasswordReset(request);}
}
