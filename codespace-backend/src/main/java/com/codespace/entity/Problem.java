package com.codespace.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="problems")
public class Problem {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String difficulty;
    private String topic;
    private String leetcodeUrl;

    public Problem(){

    }

}
