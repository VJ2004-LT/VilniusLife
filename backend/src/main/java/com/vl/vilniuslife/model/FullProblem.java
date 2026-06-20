package com.vl.vilniuslife.model;

import java.util.List;

public class FullProblem{

    private int problemId;
    private String problemTypeString;
    private double coordsLat;
    private double coordsLng;
    private String description;
    private String answer;
    private String regDate;
    private String completeDate;
    private String violationDatetime;
    List<ProblemFile> problemFiles;

    public FullProblem(int problemId, String problemTypeString, double coordsLat, double coordsLng, String description, String answer, String regDate, String completeDate, String violationDatetime, List<ProblemFile> problemFiles) {
        this.problemId = problemId;
        this.problemTypeString = problemTypeString;
        this.coordsLat = coordsLat;
        this.coordsLng = coordsLng;
        this.description = description;
        this.answer = answer;
        this.regDate = regDate;
        this.completeDate = completeDate;
        this.violationDatetime = violationDatetime;
        this.problemFiles = problemFiles;
    }

    public FullProblem() {}

    public int getProblemId() {
        return problemId;
    }

    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }

    public String getProblemTypeString() {
        return problemTypeString;
    }

    public void setProblemTypeString(String problemTypeString) {
        this.problemTypeString = problemTypeString;
    }

    public double getCoordsLat() {
        return coordsLat;
    }

    public void setCoordsLat(double coordsLat) {
        this.coordsLat = coordsLat;
    }

    public double getCoordsLng() {
        return coordsLng;
    }

    public void setCoordsLng(double coordsLng) {
        this.coordsLng = coordsLng;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getRegDate() {
        return regDate;
    }

    public void setRegDate(String regDate) {
        this.regDate = regDate;
    }

    public List<ProblemFile> getProblemFiles() {
        return problemFiles;
    }

    public void setProblemFiles(List<ProblemFile> problemFiles) {
        this.problemFiles = problemFiles;
    }

    public String getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(String completeDate) {
        this.completeDate = completeDate;
    }

    public String getViolationDatetime() {
        return violationDatetime;
    }

    public void setViolationDatetime(String violationDatetime) {
        this.violationDatetime = violationDatetime;
    }
}
