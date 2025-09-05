const Problem = require("../models/problem");
const Submission= require("../models/submission");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.id;

        const {code,language} = req.body;

        if(!userId || !code || !problemId || !language)
            return res.status(400).send("Some field is missing");

        // Fetch the problem from database
        const problem = await Problem.findById(problemId);
        // testCases (Hidden)

        // Kya apne submission store kar du pehle...
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:'pending',
            testCasesTotal: problem.hiddenTestCases.length
        })

        // Judge0 code ko submit karna hai

        const languageId= getLanguageById(language);
            // I am creating Batch submission
            const submissions= problem.hiddenTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }));

            const submitResult= await submitBatch(submissions);
            const resultToken= submitResult.map((value)=>value.token);

            const testResult = await submitToken(resultToken);

            // submittedResult ko update karo
            let testCasesPassed = 0;
            let runtime=0;
            let memory=0;
            let status ='accepted';
            let errorMessage =null;

            for(const test of testResult){
                if(test.status_id==3){
                    testCasesPasses++;
                    runtime = runtime+parseFloat(test.time);
                    memory = Math.max(memory,test.memory);
                }
                else{
                    if(test.status_id==4){
                        status ='error'
                        errorMessage = test.stderr
                    }
                    else{
                        status='wrong'
                        errorMessage = test.stderr
                    }
                }
            }
            // Store the result in database in Submission
            submittedResult.status = status;
            submitResult.testCasesPassed = testCasesPassed;
            submittedResult.errorMessage = errorMessage;
            submittedResult.runtime = runtime;
            submittedResult.memory = memory;

            await submittedResult.save();

            res.status(201).send(submittedResult);

    }
    catch(err){
        res.status(500).send("Internal error: "+err);
    }

}

module.exports = submitCode;
