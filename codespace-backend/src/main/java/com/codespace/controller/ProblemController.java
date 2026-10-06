package com.codespace.controller;

import com.codespace.entity.Problem;
import com.codespace.service.ProblemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService){
        this.problemService = problemService;
    }

    @GetMapping
    public List<Problem> getAllProblems(){
        return problemService.getAllProblmes();
    }
}
