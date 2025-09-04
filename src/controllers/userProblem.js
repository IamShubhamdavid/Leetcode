const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");
const Problem = require("../models/problem");


const createProblem= async(req,res)=>{

    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

    try{
        for(const {language,completeCode} of referenceSolution){


            // source_code:
            // language_id:
            // stdin:
            // expectOutput:

            const languageId= getLanguageById(language);

            // I am creating Batch submission
            const submissions= visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }));

            const submitResult= await submitBatch(submissions);
            //console.log(submitResult);
            const resultToken= submitResult.map((value)=>value.token);

            const testResult = await submitToken(resultToken);
            console.log(testResult);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }

        }

        // we can store it in our DB

        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const updateProblem = async(req,res)=>{

    const {id}=req.params;
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

    try{
        if(!id){
            res.status(400).send("Misiing Id Field");
        }

        const DsaProblem = await Problem.findById(id);
        if(!DsaProblem)
        {
            return res.status(404).send("ID is not present in server");
        }

        for(const {language,completeCode} of referenceSolution){


            // source_code:
            // language_id:
            // stdin:
            // expectOutput:

            const languageId= getLanguageById(language);

            // I am creating Batch submission
            const submissions= visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }));

            const submitResult= await submitBatch(submissions);
            //console.log(submitResult);
            const resultToken= submitResult.map((value)=>value.token);

            const testResult = await submitToken(resultToken);
            console.log(testResult);
            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }

        const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true , new:true});
        res.status(200).send(newProblem);   

    }
    catch(err){
        res.status(404).send("Error: "+err);
    }
}

const deleteProblem = async(req,res)=>{

    const {id} = req.params;
    try{
        if(!id)
            return res.status(400).send("ID is Misiing");

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem)
            return res.status(404).send("Problem is missing");

        res.status(200).send("Successfully Deleted");
    }
    catch(err){

        res.status(500).send("Error: "+err);
    }
}

const getProblemById = async(req,res)=>{

    const {id} = req.params;
    try{
        if(!id)
            return res.status(400).send("ID is Misiing");

        const getProblem = await Problem.findById(id);

        if(!getProblem)
            return res.status(404).send("Problem is missing");

        res.status(200).send(getProblem);
    }
    catch(err){

        res.status(500).send("Error: "+err);
    }
}

const getAllProblem = async(req,res)=>{

    // Pageniation means ek page mein 10 data ho then baaaki mein 
    // next page mein 10 data load ho aise hi chlte jaye
    // And we can write like this -->. localhost:3000/problem/getApllProblem?page=1&limit=10
    // await getProblem = await Problem.find({});
    // await Problem.find().skip(20).limit(10) 

    // Filter for easy and difficulty  we can write like this 
    // await Problem.find({difficulty:'easy})
    const {id} = req.params;
    try{
        const getProblem = await Problem.find({});

        if(getProblem.length==0)
            return res.status(404).send("Problem is missing");

        res.status(200).send(getProblem);
    }
    catch(err){

        res.status(500).send("Error: "+err);
    }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem};

// const submissions=[
//     {
//         "language_id":46,
//         "source_code":"echo hello from Bash",
//         stdin:23,
//         expected_output:43,
//     },
//     {
//          "language_id":123456789,
//         "source_code":"print(\"hello from Python\")"
//     },
//     {
//          "language_id":72,
//         "source_code":""
//     }
// ]



