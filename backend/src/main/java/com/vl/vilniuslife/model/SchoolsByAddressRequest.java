package com.vl.vilniuslife.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class SchoolsByAddressRequest {

    @NotBlank
    private String street;

    @NotBlank
    private String houseNumber;

    @NotEmpty
    private List<String> schoolLanguages;

    @DecimalMin("1")
    @DecimalMax("12")
    private int schoolClass;

    public String getStreet() {
        return street;
    }

    public int getSchoolClass() {
        return schoolClass;
    }

    public List<String> getSchoolLanguages() {
        return schoolLanguages;
    }

    public String getHouseNumber() {
        return houseNumber;
    }
}
