package com.security.resume.dto;

import java.util.List;

public class AtsResponse {

    private Double score;
    private Double profileHealthScore;

    private String name;
    private String email;
    private String phone;
    private String linkedIn;
    private List<String> allSkills;

    private List<String> exactMatches;
    private List<String> relatedMatches;
    private List<String> missingKeywords;

    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementSuggestions;

    public AtsResponse(
            Double score,
            Double profileHealthScore,
            String name,
            String email,
            String phone,
            String linkedIn,
            List<String> exactMatches,
            List<String> relatedMatches,
            List<String> missingKeywords,
            List<String> strengths,
            List<String> weaknesses,
            List<String> improvementSuggestions
    ) {
        this.score = score;
        this.profileHealthScore = profileHealthScore;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.linkedIn = linkedIn;
        this.exactMatches = exactMatches;
        this.relatedMatches = relatedMatches;
        this.missingKeywords = missingKeywords;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.improvementSuggestions = improvementSuggestions;
    }

    public Double getScore() { return score; }
    public Double getProfileHealthScore() { return profileHealthScore; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getLinkedIn() { return linkedIn; }
    public List<String> getAllSkills() {
        return allSkills;
    }

    public void setAllSkills(List<String> allSkills) {
        this.allSkills = allSkills;
    }
    public List<String> getExactMatches() { return exactMatches; }
    public List<String> getRelatedMatches() { return relatedMatches; }
    public List<String> getMissingKeywords() { return missingKeywords; }
    public List<String> getStrengths() { return strengths; }
    public List<String> getWeaknesses() { return weaknesses; }
    public List<String> getImprovementSuggestions() { return improvementSuggestions; }
}