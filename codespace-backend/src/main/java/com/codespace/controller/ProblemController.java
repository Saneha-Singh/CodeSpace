package com.codespace.controller;

import com.codespace.dto.ProblemRequest;
import com.codespace.entity.Problem;
import com.codespace.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.codespace.dto.ProblemResponse;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService){
        this.problemService = problemService;
    }

    @GetMapping
    public List<ProblemResponse> getAllProblems(){
        return problemService.getAllProblems()
                .stream()
                .map(problemService::toResponse)
                .toList();
    }

    @PostMapping
    public ProblemResponse createProblem(@RequestBody ProblemRequest request){

        Problem problem = new Problem();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTopic(request.getTopic());
        problem.setLeetcodeUrl(request.getLeetcodeUrl());

        Problem savedProblem = problemService.createProblem(problem);

        return problemService.toResponse(savedProblem);
    }
}
