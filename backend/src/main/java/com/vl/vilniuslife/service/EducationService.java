package com.vl.vilniuslife.service;

import com.vl.vilniuslife.model.School;
import com.vl.vilniuslife.model.SchoolsByAddressRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

@Service
public class EducationService {

    private final List<String> SCHOOL_LANGUAGES_TAGS = List.of("LT", "PL", "RU", "BE");

    public List<School> getSchoolsByAddress(SchoolsByAddressRequest request) {
        int streetId = getStreetId(request.getStreet());

        List<School> schools = new ArrayList<>();
        for (String schoolLanguage : request.getSchoolLanguages()){
            if(!SCHOOL_LANGUAGES_TAGS.contains(schoolLanguage)) throw new IllegalArgumentException("Invalid school language " + schoolLanguage);

            List<Integer> schoolCodes = getSchoolsCodes(
                    schoolLanguage,
                    request.getSchoolClass(),
                    streetId,
                    request.getHouseNumber(),
                    1);

            for (Integer schoolCode : schoolCodes) {
                String schoolName = getSchoolName(schoolCode);
                schools.add(new School(schoolName, schoolLanguage));
            }
        }

        return schools;
    }

    private int getStreetId(String street){
        if(street.isEmpty()) throw new IllegalArgumentException("street is empty");

        RestClient restClient = RestClient.create();

        JsonNode response = restClient.get()
                .uri("https://api.vilnius.lt/api/vilnius-addresses/streets?street={param}", street)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || !response.isArray() || response.isEmpty()) {
            throw new RuntimeException("Empty or invalid getStreetId response");
        }

        JsonNode firstItem = response.get(0);
        if (firstItem == null || firstItem.get("streetId") == null) {
            throw new RuntimeException("streetId not found");
        }

        return firstItem.get("streetId").asInt();
    }

    private List<Integer> getSchoolsCodes(String language, int schoolClass, int streetId, String houseNumber, int terRegCode){
        RestClient restClient = RestClient.create();

        JsonNode response = restClient.get()
                .uri("https://api.vilnius.lt/api/education/territory-school-by-address?language={language}&class={schoolClass}&streetId={streetId}&houseNumber={houseNumber}&terRegCode={terRegCode}",
                        language, schoolClass, streetId, houseNumber, terRegCode)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || response.isArray() || response.isEmpty()) {
            throw new RuntimeException("Empty or invalid getSchoolCodesResponse");
        }

        JsonNode regularInstitutionCodes = response.get("regularInstitutionCodes");
        if (regularInstitutionCodes == null || !regularInstitutionCodes.isArray() || regularInstitutionCodes.isEmpty()) {
            throw new RuntimeException("Empty or invalid getSchoolCodesResponse");
        }

        List<Integer> schoolCodes = new ArrayList<>();
        for (JsonNode code : regularInstitutionCodes) {
            if (!code.isNull() && code.isInt()) {
                schoolCodes.add(code.asInt());
            }
        }
        if (schoolCodes.isEmpty()) {
            throw new RuntimeException("No valid school codes found");
        }

        return schoolCodes;
    }

    private String getSchoolName(int schoolCode){
        RestClient restClient = RestClient.create();

        JsonNode response = restClient.get()
                .uri("https://api.vilnius.lt/api/education/institutions/{param}", schoolCode)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || response.isArray() || response.isEmpty()) {
            throw new RuntimeException("Empty or invalid getSchoolNameResponse");
        }

        JsonNode schoolName = response.get("name");
        if (schoolName == null) {
            throw new RuntimeException("Empty or invalid getSchoolNameResponse");
        }

        return schoolName.toString();
    }
}
