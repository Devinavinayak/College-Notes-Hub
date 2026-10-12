package com.college.notes.controller;

import com.college.notes.dto.AuthDtos.AuthResponse;
import com.college.notes.dto.AuthDtos.ProfileUpdateRequest;
import com.college.notes.dto.AuthDtos.UserResponse;
import com.college.notes.entity.Role;
import com.college.notes.repository.UserRepository;
import com.college.notes.service.AuthService;
import com.college.notes.service.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
   private final UserRepository repo;
   private final CurrentUser current;
   private final AuthService auth;

   public UserController(UserRepository repo, CurrentUser current, AuthService auth) {
       this.repo = repo;
       this.current = current;
       this.auth = auth;
   }

   @GetMapping("/me")
   public UserResponse me() {
       return auth.response(current.get());
   }

   @PutMapping("/me")
   public AuthResponse updateMe(@Valid @RequestBody ProfileUpdateRequest request) {
       return auth.updateProfile(current.get(), request);
   }

   @GetMapping("/faculty")
   public List<UserResponse> faculty() {
       return repo.findByRole(Role.FACULTY).stream().map(auth::response).toList();
   }
}
