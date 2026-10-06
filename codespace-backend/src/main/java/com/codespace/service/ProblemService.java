package com.codespace.service;

import com.codespace.entity.Problem;
import com.codespace.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    @Autowired
    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository){
        this.problemRepository = problemRepository;
    }

    public List<Problem> getAllProblmes(){
        return problemRepository.findAll();
    }

    public Problem createProblem(Problem problem){
        return problemRepository.save(problem);
    }
}
