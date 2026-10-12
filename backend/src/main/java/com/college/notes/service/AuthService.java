package com.college.notes.service;

import com.college.notes.dto.AuthDtos.*;
import com.college.notes.entity.Role;
import com.college.notes.entity.User;
import com.college.notes.repository.UserRepository;
import com.college.notes.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private static final String RESET_REQUEST_MESSAGE =
            "If an account matches those details and has a valid mobile number, a verification code will be sent.";

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final TwilioVerifyService twilio;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtService jwt, TwilioVerifyService twilio) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
        this.twilio = twilio;
    }

    @Transactional
    public AuthResponse register(RegisterRequest r) {
        if (r.role() == Role.ADMIN) throw new IllegalArgumentException("Admin registration is disabled.");
        if (r.role() == Role.FACULTY && (r.department() == null || r.department().isBlank())) {
            throw new IllegalArgumentException("Select a department before creating a faculty account.");
        }
        if (repo.existsByEmailIgnoreCase(r.email())) throw new IllegalArgumentException("Email already registered");
        if (repo.existsByUserCodeIgnoreCase(r.userCode())) throw new IllegalArgumentException("ID already registered");
        User u = new User();
        u.setName(r.name());
        u.setEmail(r.email().trim().toLowerCase());
        u.setUserCode(r.userCode().trim());
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole(r.role());
        String phone = r.phone() == null ? null : r.phone().replaceAll("[\\s()-]", "");
        if (phone != null && !twilio.isValidPhoneNumber(phone)) {
            throw new IllegalArgumentException("Enter a valid international mobile number with country code, e.g. +919876543210.");
        }
        u.setPhone(phone);
        u.setBranch(r.branch());
        u.setYearOfStudy(r.yearOfStudy());
        u.setSemester(r.semester());
        u.setSection(r.section());
        u.setDepartment(r.department() == null ? null : r.department().trim());
        u.setDesignation(r.designation());
        repo.save(u);
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()), response(u));
    }

    public AuthResponse login(LoginRequest r) {
        User u = findByIdentifier(r.identifier());
        if (u == null || !encoder.matches(r.password(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid login details");
        }
        return new AuthResponse(jwt.generate(u.getEmail(), u.getRole().name()), response(u));
    }

    @Transactional
    public AuthResponse updateProfile(User user, ProfileUpdateRequest request) {
        String email = request.email().trim().toLowerCase();
        String userCode = request.userCode().trim();
        if (repo.existsByEmailIgnoreCaseAndIdNot(email, user.getId())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (repo.existsByUserCodeIgnoreCaseAndIdNot(userCode, user.getId())) {
            throw new IllegalArgumentException("ID already registered");
        }
        if (user.getRole() == Role.FACULTY && (request.department() == null || request.department().isBlank())) {
            throw new IllegalArgumentException("Select a department before saving your profile.");
        }

        String phone = request.phone() == null ? null : request.phone().replaceAll("[\\s()-]", "");
        if (phone != null && !phone.isBlank() && !twilio.isValidPhoneNumber(phone)) {
            throw new IllegalArgumentException("Enter a valid international mobile number with country code, e.g. +919876543210.");
        }
        if (phone != null && phone.isBlank()) phone = null;

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setUserCode(userCode);
        user.setPhone(phone);
        if (user.getRole() == Role.STUDENT) {
            user.setBranch(trimToNull(request.branch()));
            user.setYearOfStudy(request.yearOfStudy());
            user.setSemester(request.semester());
            user.setSection(trimToNull(request.section()));
            user.setDepartment(null);
            user.setDesignation(null);
        } else {
            user.setBranch(null);
            user.setYearOfStudy(null);
            user.setSemester(null);
            user.setSection(null);
            user.setDepartment(trimToNull(request.department()));
            user.setDesignation(trimToNull(request.designation()));
        }
        User saved = repo.save(user);
        return new AuthResponse(jwt.generate(saved.getEmail(), saved.getRole().name()), response(saved));
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public MessageResponse requestPasswordReset(PasswordResetRequest request) {
        twilio.assertConfigured();
        User user = findByResetIdentifier(request.identifier());
        if (user != null && twilio.isValidPhoneNumber(user.getPhone())) {
            twilio.sendVerification(user.getPhone());
        }
        return new MessageResponse(RESET_REQUEST_MESSAGE);
    }

    @Transactional
    public MessageResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        twilio.assertConfigured();
        User user = findByResetIdentifier(request.identifier());
        if (user == null || !twilio.isValidPhoneNumber(user.getPhone())) {
            throw new IllegalArgumentException("The verification code is invalid or expired.");
        }
        if (!twilio.checkVerification(user.getPhone(), request.code())) {
            throw new IllegalArgumentException("The verification code is invalid or expired.");
        }
        user.setPasswordHash(encoder.encode(request.newPassword()));
        repo.save(user);
        return new MessageResponse("Password reset successfully. You can now log in with your new password.");
    }

    private User findByIdentifier(String identifier) {
        return repo.findByEmailIgnoreCase(identifier.trim())
                .or(() -> repo.findByUserCodeIgnoreCase(identifier.trim()))
                .orElse(null);
    }

    private User findByResetIdentifier(String identifier) {
        User user = findByIdentifier(identifier);
        if (user != null) return user;

        String phone = identifier.replaceAll("[\\s()-]", "");
        if (!twilio.isValidPhoneNumber(phone)) return null;
        var matches = repo.findByPhone(phone);
        return matches.size() == 1 ? matches.get(0) : null;
    }

    public UserResponse response(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getUserCode(), u.getRole(), u.getPhone(),
                u.getBranch(), u.getYearOfStudy(), u.getSemester(), u.getSection(), u.getDepartment(), u.getDesignation());
    }
}
