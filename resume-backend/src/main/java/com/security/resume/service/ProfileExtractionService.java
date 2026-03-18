package com.security.resume.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProfileExtractionService {

    public String extractEmail(String text) {
        return find(text, "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    }

    public String extractPhone(String text) {
        return find(text, "\\+?\\d{10,13}");
    }

    public String extractLinkedIn(String text) {
        return find(text, "linkedin\\.com/in/[a-zA-Z0-9-]+");
    }

    public String extractName(String text) {
        String[] lines = text.split("\\n");

        for (String line : lines) {
            String cleaned = line.trim();
            if (cleaned.matches("^[A-Z][a-zA-Z]+\\s+[A-Z][a-zA-Z]+.*"))
                return cleaned;
        }
        return "Candidate";
    }
    public Set<String> extractSkills(String text) {

        Set<String> skillsFound = new HashSet<>();

        if (text == null) return skillsFound;

        text = text.toLowerCase();

        List<String> skillDatabase = Arrays.asList(
            "java","spring","spring boot","hibernate","mysql","postgresql",
            "mongodb","docker","kubernetes","aws","azure","gcp",
            "react","angular","vue","javascript","typescript",
            "html","css","tailwind","bootstrap",
            "node","express","rest","api","jwt",
            "python","c++","c","machine learning","deep learning",
            "pandas","numpy","tensorflow","pytorch",
            "git","github","bitbucket",
            "linux","unix",
            "microservices","redis","kafka",
            "data structures","algorithms","oop"
        );

        for (String skill : skillDatabase) {
            if (text.contains(skill)) {
                skillsFound.add(skill);
            }
        }

        return skillsFound;
    }
    private String find(String text, String regex) {
        Matcher m = Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text);
        return m.find() ? m.group() : "";
    }
}