package com.college.notes.service;
import com.college.notes.entity.User; import com.college.notes.repository.UserRepository; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Component;
@Component public class CurrentUser { private final UserRepository repo; public CurrentUser(UserRepository repo){this.repo=repo;} public User get(){String email=SecurityContextHolder.getContext().getAuthentication().getName();return repo.findByEmailIgnoreCase(email).orElseThrow();} }
