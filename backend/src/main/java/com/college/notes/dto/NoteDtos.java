package com.college.notes.dto;
public class NoteDtos { public record NoteResponse(Long id,String title,String description,Integer unit,String fileName,String fileType,Long fileSize,String uploadedAt,Long subjectId,String subjectName,Long facultyId,String facultyName){} }
