package com.vl.vilniuslife.model;


public class School {

    private String institutionName;
    private String studyingLanguage;
    private String street;
    private String houseNumber;

    public School(String institutionName, String studyingLanguage, String street, String houseNumber) {
        this.institutionName = institutionName;
        this.studyingLanguage = studyingLanguage;
        this.street = street;
        this.houseNumber = houseNumber;
    }

    public School(String institutionName, String studyingLanguage) {
        this(institutionName, studyingLanguage, "", "");
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStudyingLanguage() {
        return studyingLanguage;
    }

    public void setStudyingLanguage(String studyingLanguage) {
        this.studyingLanguage = studyingLanguage;
    }
}
