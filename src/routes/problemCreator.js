
const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware= require("../middleware/adminMiddleware");


// Create
problemRouter.post("/create",CreateProblem);
problemRouter.patch("/:id", UpdateProblem);
problemRouter.delete("/:id",DeleteProblem);


problemRouter.get("/:id",getProblemById);
problemRouter.get("/", getAllProblem);
problemRouter.get("/user", solvedAllProblembyUser);

// fetch
// update
// delete 




