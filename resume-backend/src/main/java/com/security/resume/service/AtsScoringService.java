package com.security.resume.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AtsScoringService {

    private static final Set<String> KNOWN_SKILLS = Set.of(
            "java","python","spring","spring boot","mysql","docker",
            "kubernetes","aws","react","angular","node","rest","api","jwt"
    );

    public double calculateScore(String resumeText, String jobDescription) {

        String resume = normalize(resumeText);
        String jd = normalize(jobDescription);

        Set<String> resumeSkills = extractSkills(resume);
        Set<String> jdSkills = extractSkills(jd);

        if (jdSkills.isEmpty()) return 0;

        long matched = jdSkills.stream()
                .filter(resumeSkills::contains)
                .count();

        double keywordScore = ((double) matched / jdSkills.size()) * 80;

        double experienceBonus = resume.contains("experience") ? 10 : 0;
        double projectBonus = resume.contains("project") ? 10 : 0;

        return Math.min(keywordScore + experienceBonus + projectBonus, 100);
    }

    private double scoreCategory(Set<String> resumeSkills,
                                 Set<String> jobSkills,
                                 int weight) {

        if (jobSkills.isEmpty()) return 0;

        long matched = jobSkills.stream()
                .filter(skill -> containsSkill(resumeSkills, skill))
                .count();

        return ((double) matched / jobSkills.size()) * weight;
    }

    private boolean containsSkill(Set<String> skills, String target) {
        return skills.stream().anyMatch(s ->
                s.equals(target) || s.contains(target) || target.contains(s));
    }

    private String normalize(String text) {
        return text.toLowerCase().replaceAll("[^a-z0-9+.# ]", " ");
    }

    private Set<String> extractSkills(String text) {

        Set<String> skills = new HashSet<>();

        for(String skill : KNOWN_SKILLS){
            if(text.contains(skill)){
                skills.add(skill);
            }
        }

        // Dynamic keywords from JD
        String[] words = text.split("\\s+");

        for(String word : words){
            if(word.length() > 4){
                skills.add(word);
            }
        }

        return skills;
    }

    private Set<String> extractMandatorySkills(String jd) {
        Set<String> mandatory = new HashSet<>();
        if (jd.contains("required")) mandatory.addAll(extractSkills(jd));
        if (mandatory.isEmpty()) mandatory.addAll(extractSkills(jd));
        return mandatory;
    }
}