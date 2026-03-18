package com.security.resume.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ResumeAnalysisService {

    public Map<String, Object> analyze(String resumeText, String jobDescription) {

        String resume = resumeText.toLowerCase();
        String jd = jobDescription.toLowerCase();

        Set<String> matched = new HashSet<>();
        Set<String> missing = new HashSet<>();

        List<String> jdSkills = List.of("spring","rest","api","jwt","mysql","docker","aws");

        for (String skill : jdSkills) {
            if (resume.contains(skill)) matched.add(skill);
            else if (jd.contains(skill)) missing.add(skill);
        }

        double profileHealth = calculateProfileHealth(resume);

        List<String> strengths = generateStrengths(resume, matched);
        List<String> weaknesses = generateWeaknesses(resume, missing);
        List<String> suggestions = generateSuggestions(missing);

        Map<String, Object> result = new HashMap<>();
        result.put("exactMatches", matched);
        result.put("relatedMatches", Set.of());
        result.put("missing", missing);
        result.put("profileHealth", profileHealth);
        result.put("strengths", strengths);
        result.put("weaknesses", weaknesses);
        result.put("improvements", suggestions);

        return result;
    }

    private double calculateProfileHealth(String resume) {
        if (resume == null || resume.isBlank()) return 0;

        String text = resume.toLowerCase();
        double score = 0;

        // Contact details
        if (text.matches(".*[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}.*")) score += 10;
        if (text.matches(".*\\+?\\d[\\d\\s\\-]{8,}.*")) score += 10;

        // Sections
        if (text.contains("experience") || text.contains("work history")) score += 15;
        if (text.contains("project")) score += 10;
        if (text.contains("skill")) score += 15;
        if (text.contains("education") || text.contains("degree")) score += 10;
        if (text.contains("certification") || text.contains("certificate")) score += 10;

        // Content depth
        int words = text.split("\\s+").length;
        if (words >= 200) score += 5;
        if (words >= 400) score += 5;

        // Basic formatting quality heuristic
        if (!text.contains("lorem ipsum") && words > 150) score += 10;

        return Math.min(score, 100);
    }

    private List<String> generateStrengths(String resume, Set<String> matched) {
        List<String> strengths = new ArrayList<>();

        if (matched.size() >= 3)
            strengths.add("Strong alignment with core technical requirements.");

        if (resume.contains("project"))
            strengths.add("Demonstrates hands-on project experience.");

        if (resume.contains("experience"))
            strengths.add("Professional experience strengthens profile credibility.");

        return strengths;
    }

    private List<String> generateWeaknesses(String resume, Set<String> missing) {
        List<String> weaknesses = new ArrayList<>();

        if (missing.contains("spring") || missing.contains("rest"))
            weaknesses.add("Backend framework exposure appears limited for this role.");

        if (!resume.matches(".*\\d+%.*"))
            weaknesses.add("Projects and experience could better highlight measurable outcomes.");

        return weaknesses;
    }

    private List<String> generateSuggestions(Set<String> missing) {
        List<String> suggestions = new ArrayList<>();

        if (missing.contains("spring") || missing.contains("rest") || missing.contains("jwt")) {
            suggestions.add(
                "To improve alignment for backend roles, consider strengthening experience in Java-based frameworks, RESTful APIs, and authentication design."
            );
        }

        if (missing.contains("docker") || missing.contains("aws")) {
            suggestions.add(
                "Exposure to cloud platforms and containerization technologies would strengthen this profile for modern backend roles."
            );
        }

        return suggestions;
    }
}