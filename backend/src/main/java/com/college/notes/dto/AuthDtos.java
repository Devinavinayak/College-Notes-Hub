package com.college.notes.dto;
import jakarta.validation.constraints.*; import com.college.notes.entity.Role;
public class AuthDtos {
 public record LoginRequest(@NotBlank String identifier,@NotBlank String password){}
 public record RegisterRequest(@NotBlank String name,@NotBlank String email,@NotBlank String userCode,@NotBlank @Size(min=6) String password,@NotNull Role role,@Pattern(regexp="^\\+[1-9][0-9 ()-]{6,20}[0-9]$",message="Enter a mobile number with country code, e.g. +919876543210") String phone,String branch,Integer yearOfStudy,Integer semester,String section,String department,String designation){}
 public record ProfileUpdateRequest(@NotBlank String name,@NotBlank @Email String email,@NotBlank String userCode,@Pattern(regexp="^(?:\\+[1-9][0-9 ()-]{6,20}[0-9])?$",message="Enter a mobile number with country code, e.g. +919876543210") String phone,String branch,Integer yearOfStudy,Integer semester,String section,String department,String designation){}
 public record PasswordResetRequest(@NotBlank String identifier){}
 public record PasswordResetConfirmRequest(@NotBlank String identifier,@NotBlank String code,@NotBlank @Size(min=6) String newPassword){}
 public record MessageResponse(String message){}
 public record AuthResponse(String token, UserResponse user){}
 public record UserResponse(Long id,String name,String email,String userCode,Role role,String phone,String branch,Integer yearOfStudy,Integer semester,String section,String department,String designation){}
}
