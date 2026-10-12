package com.college.notes.repository;
import com.college.notes.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface AccessRequestRepository extends JpaRepository<AccessRequest,Long>{ List<AccessRequest> findByFacultyIdOrderByRequestDateDesc(Long facultyId); List<AccessRequest> findByStudentIdOrderByRequestDateDesc(Long studentId); Optional<AccessRequest> findByStudentIdAndFacultyIdAndSubjectId(Long s,Long f,Long sub); boolean existsByStudentIdAndFacultyIdAndSubjectIdAndStatus(Long s,Long f,Long sub,RequestStatus st); }
