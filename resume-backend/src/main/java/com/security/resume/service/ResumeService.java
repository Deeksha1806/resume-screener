package com.security.resume.service;

import com.security.resume.model.Resume;
import com.security.resume.model.AtsResult;
import com.security.resume.dto.AtsResponse;
import com.security.resume.repository.ResumeRepository;
import com.security.resume.repository.AtsResultRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AtsScoringService atsScoringService;
    private final ResumeAnalysisService resumeAnalysisService;
    private final AtsResultRepository atsResultRepository;
    private final ProfileExtractionService profileExtractionService;

    public ResumeService(
            ResumeRepository resumeRepository,
            AtsScoringService atsScoringService,
            ResumeAnalysisService resumeAnalysisService,
            AtsResultRepository atsResultRepository,
            ProfileExtractionService profileExtractionService) {

        this.resumeRepository = resumeRepository;
        this.atsScoringService = atsScoringService;
        this.resumeAnalysisService = resumeAnalysisService;
        this.atsResultRepository = atsResultRepository;
        this.profileExtractionService = profileExtractionService;
    }

    public Resume saveResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public AtsResponse calculateAtsScore(Long resumeId, String jobDescription) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String resumeText = resume.getParsedText();

        if (resumeText == null || resumeText.isBlank())
            throw new RuntimeException("Resume text is empty.");

        if (jobDescription == null || jobDescription.isBlank())
            throw new RuntimeException("Job description cannot be empty.");

        // ⭐ Extract profile info
        String name = profileExtractionService.extractName(resumeText);
        String email = profileExtractionService.extractEmail(resumeText);
        String phone = profileExtractionService.extractPhone(resumeText);
        String linkedIn = profileExtractionService.extractLinkedIn(resumeText);

        // ⭐ Extract ALL SKILLS
        Set<String> allSkills = profileExtractionService.extractSkills(resumeText);
        System.out.println("ALL SKILLS EXTRACTED = " + allSkills);

        resume.setCandidateName(name);
        resume.setEmail(email);
        resume.setPhone(phone);
        resume.setLinkedIn(linkedIn);

        double score = atsScoringService.calculateScore(resumeText, jobDescription);

        resume.setAtsScore(score);
        resumeRepository.save(resume);

        Map<String, Object> analysis =
                resumeAnalysisService.analyze(resumeText, jobDescription);

        // ⭐ Save ATS Result
        AtsResult result = new AtsResult();

        result.setResumeId(resume.getId());
        result.setScore(score);
        result.setJobDescription(jobDescription);
        result.setCreatedAt(LocalDateTime.now());
        result.setMatchedKeywords(String.join(",", (Set<String>) analysis.get("exactMatches")));
        result.setMissingKeywords(String.join(",", (Set<String>) analysis.get("missing")));
        result.setProfileHealthScore((Double) analysis.get("profileHealth"));

        atsResultRepository.save(result);
        

        // ⭐ Create Response Object
        AtsResponse response = new AtsResponse(
                score,
                (Double) analysis.get("profileHealth"),
                name,
                email,
                phone,
                linkedIn,
                List.copyOf((Set<String>) analysis.get("exactMatches")),
                List.copyOf((Set<String>) analysis.get("relatedMatches")),
                List.copyOf((Set<String>) analysis.get("missing")),
                (List<String>) analysis.get("strengths"),
                (List<String>) analysis.get("weaknesses"),
                (List<String>) analysis.get("improvements")
        );

        // ⭐ SET ALL SKILLS (THIS WAS MISSING)
        response.setAllSkills(new ArrayList<>(allSkills));

        return response;
    }
}