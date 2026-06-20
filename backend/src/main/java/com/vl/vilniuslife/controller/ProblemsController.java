package com.vl.vilniuslife.controller;

import com.vl.vilniuslife.model.FullProblem;
import com.vl.vilniuslife.model.ShortProblem;
import com.vl.vilniuslife.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProblemsController {

    @Autowired
    ProblemService service;

    @GetMapping("/problems")
    List<ShortProblem> getProblems(){
        return service.getProblems();
    }

    @GetMapping("/problem")
    FullProblem getProblem(@RequestParam int problemId){
        return service.getProblem(problemId);
    }
}
