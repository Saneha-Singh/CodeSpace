package com.codespace.dto;

import lombok.Data;

@Data
public class ProblemResponse {

    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String topic;
    private String leetcodeUrl;
}
