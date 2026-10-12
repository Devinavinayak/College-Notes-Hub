package com.college.notes.entity;
import jakarta.persistence.*; import lombok.*; import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity @Table(name="subjects") @Getter @Setter @NoArgsConstructor
public class Subject { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String name; String branch; Integer semester; @JsonIgnore @ManyToOne(optional=false) User faculty; }
