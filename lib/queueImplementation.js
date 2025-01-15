const msgQueue = [];

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
    const currentMsg = msgQueue.shift();
    /* currentMsg ==
        {
        taskOpened: {[orderID]:orderID or ("1234":1234)},
        [orderID]: taskStatus or "1234":"Available", 
        }

    */
    const orderID= Object.keys(currentMsg.taskOpened)[0];
    const { taskOpened } = currentMsg;
    const taskStatus = currentMsg[orderID];
    const newTaskStatus = {[orderID]: taskStatus};

    //get the info from local storage fist
    chrome.storage.local.get(taskInfoLookUp, (result)=>{
        //the following code will be executed asynchronously
        let taskInfoDB = result[taskInfoLookUp];
        let taskOpenedDB = {};
        if(taskInfoDB){
            taskOpenedDB = taskInfoDB.taskOpened;
            //add the new data into the taskInfoDB
            const taskOpenedUpdated = Object.assign({}, taskOpenedDB, taskOpened);
            taskInfoDB.taskOpened = taskOpenedUpdated;
            const taskInfoDBUpdated = Object.assign({}, newTaskStatus, taskInfoDB);
            const finalOutput = {[taskInfoLookUp]: taskInfoDBUpdated};
            chrome.storage.local.set(finalOutput);
        }
        else{
            const taskInfoDBNew = {
                taskOpened: {[orderID]:orderID},
                [orderID]:taskStatus
            }
            const finalOutput = {[taskInfoLookUp]: taskInfoDBNew};
            chrome.storage.local.set(finalOutput);
        }

    })


}
