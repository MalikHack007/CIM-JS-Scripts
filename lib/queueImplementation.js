const taskStatQueue = [];

let isProcessing = false;

const taskInfoLookUp = "collectRemFeeMsgTasks";

const processQueue = ()=>{
    //if there is no more message in the queue
    if(msgQueue.length === 0){
        isProcessing = false;
        return;
    }
    //else if there's still msg left for processing
    isProcessing = true;
    const currentTask = taskStatQueue.shift();
    /* currentMsg ==
        {
        "event": "Task Detected",
        "info": {[orderID]: taskStatus} or {"1234":"Available"}
        }

        taskInfoDB == 
        {
        "1234":"pending",
        "3456": "available",
        "7890": "Undoable",
        .........
        }

    */
    //get the info from local storage fist
    chrome.storage.local.get(taskInfoLookUp, (result)=>{
        //the following code will be executed asynchronously
        let taskInfoDB = result[taskInfoLookUp];
        if(taskInfoDB){
            const taskInfoDBUpdated = Object.assign({}, currentTask, taskInfoDB)
            const finalOutput = {[taskInfoLookUp]: taskInfoDBUpdated};
            chrome.storage.local.set(finalOutput, ()=>{
                console.log(`Task added: ${JSON.stringify(finalOutput[taskInfoLookUp])}`, "Moving onto the next msg...");
                processQueue();
            });
        }
        else{
            const finalOutput = {[taskInfoLookUp]: currentTask};
            chrome.storage.local.set(finalOutput, ()=>{
                console.log(`Task database initiated: ${JSON.stringify(finalOutput[taskInfoLookUp])}`, "Moving onto the next msg...");
                processQueue();
            });
        }
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.event == "Task Detected"){
        taskStatQueue.push(message.info);
        sendResponse(`Task ${message.info}sent to queue for storage.`);
        if(!isProcessing){
            processQueue();
        }
        return true;
    }
})
