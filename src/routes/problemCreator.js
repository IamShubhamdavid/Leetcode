
const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware= require("../middleware/adminMiddleware");
const createProblem = require("../controllers/userProblem");

// Create
problemRouter.post("/create",adminMiddleware, createProblem);
// problemRouter.patch("/:id", UpdateProblem);
// problemRouter.delete("/:id",DeleteProblem);


// problemRouter.get("/:id",getProblemById);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedAllProblembyUser);


module.exports = problemRouter;

// fetch
// update
// delete 




