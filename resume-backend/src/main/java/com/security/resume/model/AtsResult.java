package com.security.resume.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ats_results")
public class AtsResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resumeId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String jobDescription;

    private Double score;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String matchedKeywords;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String missingKeywords;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String keywordSuggestions;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String structureSuggestions;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String atsSuggestions;

    private Double profileHealthScore;

    private LocalDateTime createdAt;

    public AtsResult() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getMatchedKeywords() {
        return matchedKeywords;
    }

    public void setMatchedKeywords(String matchedKeywords) {
        this.matchedKeywords = matchedKeywords;
    }

    public String getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(String missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public String getKeywordSuggestions() {
        return keywordSuggestions;
    }

    public void setKeywordSuggestions(String keywordSuggestions) {
        this.keywordSuggestions = keywordSuggestions;
    }

    public String getStructureSuggestions() {
        return structureSuggestions;
    }

    public void setStructureSuggestions(String structureSuggestions) {
        this.structureSuggestions = structureSuggestions;
    }

    public String getAtsSuggestions() {
        return atsSuggestions;
    }

    public void setAtsSuggestions(String atsSuggestions) {
        this.atsSuggestions = atsSuggestions;
    }

    public Double getProfileHealthScore() {
        return profileHealthScore;
    }

    public void setProfileHealthScore(Double profileHealthScore) {
        this.profileHealthScore = profileHealthScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime now) {
        // TODO Auto-generated method stub
    }
}