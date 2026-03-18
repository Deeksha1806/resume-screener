package com.security.resume.controller;

import com.security.model.User;
import com.security.repository.UserRepository;
import com.security.resume.model.Resume;
import com.security.resume.service.ResumeService;
import com.security.resume.service.TextExtractorService;
import com.security.resume.dto.AtsResponse;
import com.security.resume.dto.ScoreRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.security.resume.service.ProfileExtractionService;

import java.io.File;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;
    private final TextExtractorService textExtractorService;
    private final ProfileExtractionService profileExtractionService;
    public ResumeController(ResumeService resumeService,
            UserRepository userRepository,
            TextExtractorService textExtractorService,
            ProfileExtractionService profileExtractionService) {
this.resumeService = resumeService;
this.userRepository = userRepository;
this.textExtractorService = textExtractorService;
this.profileExtractionService = profileExtractionService;
}
    // ✅ UPLOAD RESUME
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
        	 System.out.println("UPLOAD API HIT"); 
            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String uploadDir = System.getProperty("user.dir") + "/uploads";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String filePath = uploadDir + "/" + file.getOriginalFilename();
            File dest = new File(filePath);
            file.transferTo(dest);

            // ⭐ EXTRACT TEXT
            String parsedText = textExtractorService.extractText(dest);
            String name = profileExtractionService.extractName(parsedText);
            String email = profileExtractionService.extractEmail(parsedText);
            String phone = profileExtractionService.extractPhone(parsedText);
            String linkedIn = profileExtractionService.extractLinkedIn(parsedText);

            // ⭐ DEBUG (very important)
            System.out.println("PARSED TEXT LENGTH = " + parsedText.length());

            Resume resume = new Resume();
            resume.setFileName(file.getOriginalFilename());
            resume.setFilePath(filePath);
            resume.setParsedText(parsedText);
            resume.setUser(user);

            resume.setCandidateName(name);
            resume.setEmail(email);
            resume.setPhone(phone);
            resume.setLinkedIn(linkedIn);

            Resume savedResume = resumeService.saveResume(resume);

            return ResponseEntity.ok(savedResume.getId());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Upload failed");
        }
    }

    // ✅ ATS SCORE
    @PostMapping("/{id}/score")
    public ResponseEntity<?> calculateScore(
            @PathVariable Long id,
            @RequestBody ScoreRequest request
    ) {
        try {
            System.out.println("SCORE API HIT");
            System.out.println("Resume ID = " + id);
            System.out.println("Job Desc = " + request.getJobDescription());

            AtsResponse response =
                    resumeService.calculateAtsScore(id, request.getJobDescription());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();   // 🔥 ADD THIS
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
