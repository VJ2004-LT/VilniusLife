package com.vl.vilniuslife.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.StreamSupport;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.vl.vilniuslife.model.FullProblem;
import com.vl.vilniuslife.model.ProblemFile;
import com.vl.vilniuslife.model.ShortProblem;

import tools.jackson.databind.JsonNode;

@Service
public class ProblemService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Cacheable(value = "problems", key = "'single'", unless = "#result == null")
    public List<ShortProblem> getProblems() {
        List<ShortProblem> problems = new ArrayList<>();
        getAllProblemsRecursive(
                LocalDate.now().minusMonths(1).format(FORMATTER),
                LocalDate.now().format(FORMATTER),
                "",
                problems
        );
        return problems;
    }

    private void getAllProblemsRecursive(String dateFrom, String dateTo, String nextCursor, List<ShortProblem> result){
        RestClient restClient = RestClient.create();

        String query = "";
        if (!nextCursor.isEmpty()) {
            query = nextCursor;
        } else {
            query = "https://api-tvarkau.vilnius.lt/api/v2/problems?date_from=" + dateFrom + "&date_to=" + dateTo + "&city_id=1&status_id%5B%5D=1&status_id%5B%5D=2&page=1&limit=1000";
        }
        JsonNode response = restClient.get()
                .uri(query)
                .retrieve()
                .requiredBody(JsonNode.class);

        if (response == null || response.isArray() || response.isEmpty()){
            throw new RuntimeException("Empty or invalid getAllProblemsResponse");
        }

        JsonNode responseData = response.get("data");
        if (responseData == null || !responseData.isArray() || responseData.isEmpty()){
            throw new RuntimeException("Empty or invalid getAllProblemsResponse");
        }

        StreamSupport.stream(responseData.spliterator(), false).map(item -> {
                    JsonNode pd = item.path("problemData");
                    ShortProblem sp = new ShortProblem();
                    sp.setProblemId(pd.path("problemId").asInt());
                    sp.setProblemTypeString(pd.path("problemTypeString").asString());
                    sp.setCoordsLat(pd.path("coordsGoogleLat").asDouble());
                    sp.setCoordsLng(pd.path("coordsGoogleLng").asDouble());
                    return sp;
                })
                .forEach(result::add);

        JsonNode maybeNextCursor = response.get("next");
        if (maybeNextCursor != null && !maybeNextCursor.isEmpty()) {
            getAllProblemsRecursive(dateFrom, dateTo, maybeNextCursor.asString(), result);
        }
    }

    public FullProblem getProblem(int problemId) {
        RestClient restClient = RestClient.create();

        JsonNode response = restClient.get()
                .uri("https://api-tvarkau.vilnius.lt/api/v2/problems/{param}", problemId)
                .retrieve()
                .requiredBody(JsonNode.class);

        try{
            JsonNode responseData = response.get("data");
            JsonNode responseProblemData = responseData.get("problemData");

            return new FullProblem(
                    responseProblemData.path("problemId").asInt(),
                    responseProblemData.path("problemTypeString").asString(),
                    responseProblemData.path("coordsGoogleLat").asDouble(),
                    responseProblemData.path("coordsGoogleLng").asDouble(),
                    responseProblemData.path("description").asString(),
                    responseProblemData.path("answer").asString(),
                    responseProblemData.path("regDate").asString(),
                    responseProblemData.path("completeDate").asString(),
                    responseProblemData.path("violationDatetime").asString(),
                    StreamSupport.stream(responseData.path("problemFiles").spliterator(), false).map(
                            problemFile -> {
                                if (problemFile.path("image").asBoolean()) {
                                    return new ProblemFile(
                                            problemFile.path("filename").asString(),
                                            problemFile.path("original").asString()
                                    );
                                }
                                return null;
                            }
                    ).toList()
            );
        } catch (Exception e){
            System.out.println("Problem Not Found");
        }
        return null;
    }
}
