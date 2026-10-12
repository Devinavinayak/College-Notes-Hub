package com.college.notes.repository;
import com.college.notes.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface SubjectRepository extends JpaRepository<Subject,Long>{ List<Subject> findByFacultyId(Long facultyId); List<Subject> findByNameContainingIgnoreCase(String name); }
