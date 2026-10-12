package com.college.notes.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="access_requests", uniqueConstraints=@UniqueConstraint(columnNames={"student_id","faculty_id","subject_id"})) @Getter @Setter @NoArgsConstructor
public class AccessRequest { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @ManyToOne(optional=false) @JoinColumn(name="student_id") User student; @ManyToOne(optional=false) @JoinColumn(name="faculty_id") User faculty; @ManyToOne(optional=false) Subject subject; @Enumerated(EnumType.STRING) RequestStatus status; LocalDateTime requestDate; LocalDateTime responseDate; @PrePersist void pre(){requestDate=LocalDateTime.now(); if(status==null) status=RequestStatus.PENDING;} }
