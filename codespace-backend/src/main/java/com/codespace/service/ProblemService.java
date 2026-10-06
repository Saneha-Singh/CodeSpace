package com.codespace.service;

import com.codespace.dto.ProblemResponse;
import com.codespace.entity.Problem;
import com.codespace.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {


    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository){
        this.problemRepository = problemRepository;
    }

    public ProblemResponse toResponse(Problem problem) {

        ProblemResponse response = new ProblemResponse();

        response.setId(problem.getId());
        response.setTitle(problem.getTitle());
        response.setDescription(problem.getDescription());
        response.setDifficulty(problem.getDifficulty());
        response.setTopic(problem.getTopic());
        response.setLeetcodeUrl(problem.getLeetcodeUrl());

        return response;
    }

    public List<Problem> getAllProblems(){
        return problemRepository.findAll();
    }

    public Problem createProblem(Problem problem){
        return problemRepository.save(problem);
    }
}
