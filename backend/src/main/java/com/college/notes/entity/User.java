package com.college.notes.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false, unique=true) private String userCode;
    @JsonIgnore
    @Column(nullable=false) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
    private String phone;
    private String branch;
    private Integer yearOfStudy;
    private Integer semester;
    private String section;
    private String department;
    private String designation;
    private LocalDateTime createdAt;
    @PrePersist void prePersist(){ createdAt=LocalDateTime.now(); }
}
