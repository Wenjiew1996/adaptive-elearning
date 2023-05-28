(define (domain learning)
   
    (:requirements :strips :typing :negative-preconditions)

    (:types ;todo: enumerate types and their hierarchy here
        student
    )

    ; un-comment following line if constants are needed
    ;(:constants )

    (:predicates ;todo: define predicates here
        (dummy)
        (LO1 ?s - student)
        (LO2 ?s - student)
        (LO3 ?s - student)
        (LO4 ?s - student)
        (LO5 ?s - student)
        (LO6 ?s - student)
        (LO7 ?s - student)
        (LO8 ?s - student)
        (LO9 ?s - student)
        (LO10 ?s - student)
        (LO11 ?s - student)
        (LO12 ?s - student)
        (LO13 ?s - student)
        (LO14 ?s - student)
        (LO15 ?s - student)
        (LO16 ?s - student)
        (LO17 ?s - student)
        (LO18 ?s - student)
        (LO19 ?s - student)
        (LO21 ?s - student)
        (LO20 ?s - student)
        (LO22 ?s - student)
        (LO23 ?s - student)
        (LO24 ?s - student)
        (LO25 ?s - student)
        (LO26 ?s - student)
        (LO27 ?s - student)
        (LO28 ?s - student)
        (LO29 ?s - student)
        (LO30 ?s - student)
        (LO31 ?s - student)
    )


    ; (:functions ;todo: define numeric functions here
    ; )

    ; Planning intro
    ; 
    (:action LO1
    :parameters (?s - student)
        :precondition (and 
            (not (LO1 ?s))
        )
        :effect (and 
            (LO1 ?s)
        )
    )

     ; States
    (:action LO2
        :parameters (?s - student)
        :precondition (and 
            (LO1 ?s)
            (not (LO2 ?s))
        )
        :effect (and 
            (LO2 ?s)
        )
    )

    ; Goals
    (:action LO3
        :parameters (?s - student)
        :precondition (and 
            (LO2 ?s)
            (not (LO3 ?s))
        )
        :effect (and 
            (LO3 ?s)
        )
    )

    ; Actions
    (:action LO4
        :parameters (?s - student)
        :precondition (and 
            (LO3 ?s)
            (not (LO4 ?s))
        )
        :effect (and 
            (LO4 ?s)
        )
    )
    
    ; Further Planning
    (:action LO5
        :parameters (?s - student)
        :precondition (and 
            (LO4 ?s)
            (not (LO5 ?s))
        )
        :effect (and 
            (LO5 ?s)
        )
    )

    ; Search intro
    (:action LO6
        :parameters (?s - student)
        :precondition (and 
            (LO5 ?s)
            (not (LO6 ?s))
        )
        :effect (and 
            (LO6 ?s)
        )
    )

    ; Search Trees
    (:action LO7
        :parameters (?s - student)
        :precondition (and 
            (LO6 ?s)
            (not (LO7 ?s))
        )
        :effect (and 
            (LO7 ?s)
        )
    )

    ; BFS
    (:action LO8
        :parameters (?s - student)
        :precondition (and 
            (LO7 ?s)
            (not (LO8 ?s))
        )
        :effect (and 
            (LO8 ?s)
        )
    )
    
    ; DFS
    (:action LO9
        :parameters (?s - student)
        :precondition (and 
            (LO8 ?s)
            (not (LO9 ?s))
        )
        :effect (and 
            (LO9 ?s)
        )
    )
    
    ; BFS v DFS
    (:action LO10
        :parameters (?s - student)
        :precondition (and 
            (LO9 ?s)
            (not (LO10 ?s))
        )
        :effect (and 
            (LO10 ?s)
        )
    )
    
    ; Sets and Set Operations
    (:action LO11
        :parameters (?s - student)
        :precondition (and 
            (LO10 ?s)
            (not (LO11 ?s))
        )
        :effect (and 
            (LO11 ?s)
        )
    )
    
    ; Set Properties
    (:action LO12
        :parameters (?s - student)
        :precondition (and 
            (LO11 ?s)
            (not (LO12 ?s))
        )
        :effect (and 
            (LO12 ?s)
        )
    )

    ; State Space Search Problem
    (:action LO13
        :parameters (?s - student)
        :precondition (and 
            (LO12 ?s)
            (not (LO13 ?s))
        )
        :effect (and
            (LO13 ?s)    
        )
    )
    
    ; Problem Solving by Graph Searching
    (:action LO14
        :parameters (?s - student)
        :precondition (and 
            (LO13 ?s)
            (not (LO14 ?s))
        )
        :effect (and
            (LO14 ?s)    
        )
    )
    
    ; Different planning representations
    (:action LO15
        :parameters (?s - student)
        :precondition (and 
            (LO14 ?s)
            (not (LO15 ?s))
        )
        :effect (and 
            (LO15 ?s)
        )
    )
    
    ; STRIPS Representation
    (:action LO16
        :parameters (?s - student)
        :precondition (and              
            (LO15 ?s)
            (not (LO16 ?s))
        )
        :effect (and 
            (LO16 ?s)
        )
    )
    
    ; Feature-Based Representation of Actions
    (:action LO17
        :parameters (?s - student)
        :precondition (and 
            (LO16 ?s)
            (not (LO17 ?s))
        )
        :effect (and 
            (LO17 ?s)
        )
    )
    
    ; PDDL
    (:action LO18
        :parameters (?s - student)
        :precondition (and 
            (LO17 ?s)
            (not (LO18 ?s))
        )
        :effect (and 
            (LO18 ?s)
        )
    )

    ; Explicit state space Representation
    (:action LO19
        :parameters (?s - student)
        :precondition (and             
            (LO18 ?s)
            (not (LO19 ?s))
        )
        :effect (and 
            (LO19 ?s)
        )
    )

    ; Logic intro
    (:action LO20
        :parameters (?s - student)
        :precondition (and 
            (LO19 ?s)
            (not (LO20 ?s))
        )
        :effect (and 
            (LO20 ?s)
        )
    )

    ; Propositional Logic
    (:action LO21
        :parameters (?s - student)
        :precondition (and 
            (LO20 ?s)
            (not (LO21 ?s))
        )
        :effect (and 
            (LO21 ?s)
        )
    )
    ; First Order Logic
    (:action LO22
        :parameters (?s - student)
        :precondition (and 
            (LO21 ?s)
            (not (LO22 ?s))
        )
        :effect (and 
            (LO22 ?s)
        )
    )

    ; Relational State Representation
    (:action LO23
        :parameters (?s - student)
        :precondition (and
            (LO22 ?s)
            (not (LO23 ?s))
        )
        :effect (and 
            (LO23 ?s)
        )
    )

    ; STRIPS Action Schema
    (:action LO24
        :parameters (?s - student)
        :precondition (and
            (LO23 ?s)
            (not (LO24 ?s))
        )
        :effect (and 
            (LO24 ?s)
        )
    )

    ; Simple Planning Algorithms
    (:action LO25
        :parameters (?s - student)
        :precondition (and 
            (LO24 ?s)
            (not (LO25 ?s))
        )
        :effect (and 
            (LO25 ?s)
        )
    )

    ; Forward Planning
    (:action LO26
        :parameters (?s - student)
        :precondition (and 
            (LO25 ?s)
            (not (LO26 ?s))
        )
        :effect (and 
            (LO26 ?s)
        )
    )
    
    ; Regression Planning
    (:action LO27
        :parameters (?s - student)
        :precondition (and 
            (LO26 ?s)
            (not (LO27 ?s))
        )
        :effect (and 
            (LO27 ?s)
        )
    )
    
    ; Progression v Regression
    (:action LO28
        :parameters (?s - student)
        :precondition (and 
            (LO27 ?s)
            (not (LO28 ?s))
        )
        :effect (and 
            (LO28 ?s)
        )
    )

    ; Planning Graphs
    (:action LO29
        :parameters (?s - student)
        :precondition (and 
            (LO28 ?s)
            (not (LO29 ?s))
        )
        :effect (and 
            (LO29 ?s)
        )
    )
    
    ; Heuristics
    (:action LO30
        :parameters (?s - student)
        :precondition (and 
            (LO7 ?s)
            (not (LO30 ?s))
        )
        :effect (and 
            (LO30 ?s)
        )
    )

    ; A* Search
    (:action LO31
        :parameters (?s - student)
        :precondition (and 
            (LO30 ?s)
            (not (LO31 ?s))
        )
        :effect (and 
            (LO31 ?s)
        )
    )  

)