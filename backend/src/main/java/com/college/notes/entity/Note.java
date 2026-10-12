package com.college.notes.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="notes") @Getter @Setter @NoArgsConstructor
public class Note { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String title; String description; Integer unit; String fileName; String storedFileName; String fileType; Long fileSize; LocalDateTime uploadedAt; @ManyToOne(optional=false) Subject subject; @ManyToOne(optional=false) User faculty; @PrePersist void pre(){uploadedAt=LocalDateTime.now();} }
