package com.college.notes.config;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class)
 ResponseEntity<Map<String,String>> handleValidation(MethodArgumentNotValidException e) {
  String message=e.getBindingResult().getFieldErrors().stream().map(error->error.getDefaultMessage()).filter(Objects::nonNull).findFirst().orElse("Please check the submitted details.");
  return ResponseEntity.badRequest().body(Map.of("message",message));
 }
 @ExceptionHandler(Exception.class) ResponseEntity<Map<String,String>> handle(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()==null?"Request failed":e.getMessage()));}
}
