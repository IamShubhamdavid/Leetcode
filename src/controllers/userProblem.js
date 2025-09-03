const {getLanguageById,submitBatch}=require("../utils/problemUtility")


const createProblem= async(requestAnimationFrame,res)=>{

    const {title,description,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body;

    try{
        for(const {language,completeCode} of referenceSolution){


            // source_code:
            // language_id:
            // stdin:
            // expectOutput:

            const languageId= getLanguageById(language);

            // I am creating Batch submission
            const submissions= visibleTestCases.map((input,output)=>({
                source_code:completeCode,
                language_id: language,
                stdin: input,
                expected_output: output

            }));

            const submitResult= await submitBatch(submissions);

        }

    }
    catch(err){

    }
}

const submissions=[
    {
        "language_id":46,
        "source_code":"echo hello from Bash",
        stdin:23,
        expected_output:43,
    },
    {
         "language_id":123456789,
        "source_code":"print(\"hello from Python\")"
    },
    {
         "language_id":72,
        "source_code":""
    }
]



