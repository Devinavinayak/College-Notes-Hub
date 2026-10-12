package com.college.notes.controller;

import com.college.notes.entity.*;
import com.college.notes.repository.SubjectRepository;
import com.college.notes.service.CurrentUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	private final SubjectRepository repo;
	private final CurrentUser current;

	public SubjectController(SubjectRepository repo, CurrentUser current) {
		this.repo = repo;
		this.current = current;
	}

	@GetMapping
	public List<Subject> all(@RequestParam(required = false) Long facultyId) {
		return facultyId == null ? repo.findAll() : repo.findByFacultyId(facultyId);
	}

	@GetMapping("/mine")
	public List<Subject> mine() {
		return repo.findByFacultyId(current.get().getId());
	}

	@PostMapping
	public Subject create(@RequestBody Map<String, Object> body) {
		User faculty = current.get();
		if (faculty.getRole() != Role.FACULTY) throw new IllegalArgumentException("Faculty only");
		Subject subject = new Subject();
		subject.setName((String) body.get("name"));
		subject.setBranch((String) body.get("branch"));
		subject.setSemester(body.get("semester") == null ? null : ((Number) body.get("semester")).intValue());
		subject.setFaculty(faculty);
		return repo.save(subject);
	}

	@PutMapping("/{id}")
	public Subject update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
		User faculty = current.get();
		if (faculty.getRole() != Role.FACULTY) throw new IllegalArgumentException("Faculty only");

		Subject subject = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Subject not found"));
		if (!subject.getFaculty().getId().equals(faculty.getId())) {
			throw new IllegalArgumentException("You can edit only your subjects");
		}

		String name = (String) body.get("name");
		String branch = (String) body.get("branch");
		Object semesterValue = body.get("semester");
		if (name == null || name.isBlank()) throw new IllegalArgumentException("Subject name is required");
		if (branch == null || branch.isBlank()) throw new IllegalArgumentException("Branch is required");
		if (!(semesterValue instanceof Number semester)) throw new IllegalArgumentException("Semester is required");

		subject.setName(name.trim());
		subject.setBranch(branch);
		subject.setSemester(semester.intValue());
		return repo.save(subject);
	}
}
