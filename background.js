//#region definitions
const remFeeKeySteps = {
    dummyStep: "not initiated",
    sendInvoice: "Send Invoice(s)",
    markOffAIS: "Mark off AIS"
}

const tabDummy = "toBeWritten";


const taskers = {
    taskMaster: "Malik Zhang",
    nonTaskMaster: "others"
}

const aisNames = {
    remFeeCollect: "Please Post Remaining Fee Message"
}

const actions = {
    writeMessage: "Please write message.",
    sendMessage: "Please write and then send message.",
    runRemFeeTask: "Run script to complete the task.",
    removeAlertsFromWindow: "Please remove alerts from window"
}

const taskStatuses = {
    statusAvail: "Available",
    statusPend: "Pending",
    statusMaster: `Done by ${taskers.taskMaster}`,
    statusUnavail: "Undoable"
}

const remFeeWatchingTask = "remFeeWatchingStatus";

const remFeeFetTask = "remFeeFetchingStatus";

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database"
}


const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const queues = {
    [localStorageKeys.scriptRunningStatusesDB]: {queue: [], queueType: localStorageKeys.scriptRunningStatusesDB},
    [localStorageKeys.taskDataBase] : {queue: [], queueType: localStorageKeys.taskDataBase}
}


let notificationURLs = {};

const isProcessingBooleans = {
    isProcessingTaskDB: false,
    isProcessingScriptStatus: false
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database.",
    enterMessage: "Enter the message.",
    remFeeTaskInit: "Initiate rem fee task completion"
}

const msgNotReady = "Not Ready";

let lastTimestamp = 0;
let counter = 0;

function generateUniqueId() {
    const now = Date.now();
    if (now === lastTimestamp) {
        counter++;
    } else {
        lastTimestamp = now;
        counter = 0;
    }
    return `${now}-${counter}`;
}

const processQueue = (queue, queueType, tabID = tabDummy)=>{
//#region Local Storage Reference
/*
        chrome.storage.local



    key: localStorageKeys.taskDataBase



    value: 

    {

    “remFeeCollect”: {

        “1234”:{

        taskStatus: “pending”,

        messageInputs: {…….},

        message: “N/A”

        }

        [orderID]: {

        taskStatus: [status],

        messageInputs: {…….},

        message: [pre-written message]

        }

        }

    }

    key: localStorageKeys.scriptRunningStatusesDB



    value:

    {



        [scriptName]: runningStatus



        remFeeDetection: “Running”



        remFeeFetch: “Stopped”



    }
*/
//#endregion
    
    if(queueType == localStorageKeys.taskDataBase){
        //if there is no more message in the queue
        if(queue.length === 0){
            isProcessingBooleans.isProcessingTaskDB = false;
            return;
        }
        const currentItem = queue.shift();

        //#region definitions
        /*
            MESSAGE LOOKS LIKE THIS
            {
                type: messageTypes.updateTaskDB, 
                info: {
                    taskType: taskType,
                    orderID: [orderID],
                    taskStatus: taskStatus,
                    **below is optional**
                    messageInputs: messageInputs,
                    message: msgNotReady
                }
            }
            key: localStorageKeys.taskDataBase



            value: 

            {
                [taskType]:{
                    [orderID]:{
                        taskStatus:"pending",
                        messageInputs: {},
                        message: "N/A"
                    }
            }

            “remFeeCollect”: {

                “1234”:{

                taskStatus: “pending”,

                messageInputs: {…….},

                message: “N/A”

            }
        */
        //currentItem is the raw message.info
        const taskType = currentItem.taskType;
        const orderID = currentItem.orderID;
        let status;
        let messageInputs;
        let msg;
        let messageSent;
        let scriptingInProgress;
        let currentScriptingStep;
        let relevantDetails = {};
        // console.log(`${JSON.stringify(currentItem)}`);
        if("taskStatus" in currentItem){
            status = currentItem.taskStatus;
            Object.assign(relevantDetails, { taskStatus: status });
        }
        if("messageInputs" in currentItem){
            messageInputs = currentItem.messageInputs;
            Object.assign(relevantDetails, { messageInputs: messageInputs });
        }
        if("message" in currentItem){
            msg = currentItem.message
            Object.assign(relevantDetails, { message: msg });
        }
        if("msgSent" in currentItem){
            messageSent = currentItem.msgSent;
            Object.assign(relevantDetails, {msgSent: messageSent} );
        }
        if("tabID" in currentItem){
            Object.assign(relevantDetails, {tabID: tabID});
        }
        if("scriptingInProgress" in currentItem){
            scriptingInProgress = currentItem.scriptingInProgress;
            Object.assign(relevantDetails, {scriptingInProgress: scriptingInProgress});
        }
        if("currentScriptingStep" in currentItem){
            currentScriptingStep = currentItem.currentScriptingStep;
            Object.assign(relevantDetails, {currentScriptingStep: currentScriptingStep});
        }
        // console.log(`${JSON.stringify(relevantDetails)}`);

        relevantDetails = {[orderID]:relevantDetails};

        const taskTypeDBInit = { [taskType]: relevantDetails};


        //#endregion
        //else if there's still msg left for processing
        isProcessingBooleans.isProcessingTaskDB = true;
        
        chrome.storage.local.get(localStorageKeys.taskDataBase, (result)=>{
            if(result[localStorageKeys.taskDataBase]){
                const taskInfoDB = result[localStorageKeys.taskDataBase];
                if(taskInfoDB[taskType]){
                    const remFeeDB = taskInfoDB[taskType];
                    if(remFeeDB[orderID]){
                        const remFeeTaskInfo = remFeeDB[orderID];
                        Object.assign(remFeeTaskInfo, relevantDetails[orderID]);
                        const newRemFeeDBItem = {[orderID]: remFeeTaskInfo};
                        Object.assign(remFeeDB, newRemFeeDBItem);
                        const newTaskInfoDBItem = {[taskType]: remFeeDB};
                        Object.assign(taskInfoDB, newTaskInfoDBItem);
                        const finalOutput = {[localStorageKeys.taskDataBase]: taskInfoDB}
                        // console.log(`writing into local storage(key:value)${JSON.stringify(finalOutput)}`);
                        chrome.storage.local.set(finalOutput, ()=>{
                            processQueue(queue, queueType);
                        })
                    }
                    else{
                        Object.assign(remFeeDB, relevantDetails);
                        const remFeeDBUpdated = {[taskType]: remFeeDB};
                        Object.assign(taskInfoDB, remFeeDBUpdated);
                        const finalOutput = { [localStorageKeys.taskDataBase]: taskInfoDB }
                        chrome.storage.local.set(finalOutput, ()=>{
                            processQueue(queue, queueType);
                        });
                    }
                }
                else{
                    Object.assign(taskInfoDB, taskTypeDBInit);
                    const finalOutput = {[localStorageKeys.taskDataBase]: taskInfoDB};
                    chrome.storage.local.set(finalOutput, ()=>{
                        processQueue(queue, queueType)
                    })
                }
                /*
                const taskInfoDBUpdated = Object.assign(taskInfoDB, currentItem)
                const finalOutput = {[localStorageKeys.taskDataBase]: taskInfoDBUpdated};
                chrome.storage.local.set(finalOutput, ()=>{
                    console.log(`Task added: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                    processQueue(queue, queueType);
                });
                */
            }
            else{
                const finalOutput = {[localStorageKeys.taskDataBase]: taskTypeDBInit};
                chrome.storage.local.set(finalOutput, ()=>{
                    // console.log(`Task database initiated: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                    processQueue(queue, queueType)
                });
            }
        })

    }

    else if (queueType == localStorageKeys.scriptRunningStatusesDB){
        //if there is no more message in the queue
        // console.log(`Selected for queue type:${JSON.stringify(queueType)}`);
        if(queue.length === 0){
            // console.log(`Queue length is 0:${JSON.stringify(queue)}`);
            isProcessingBooleans.isProcessingScriptStatus = false;
            return;
        }
        const currentItem = queue.shift();
        // console.log(`currently processing item: ${JSON.stringify(currentItem)}`);
        //process script running status queue
        // console.log(`Queue started processing.`)
        chrome.storage.local.get(localStorageKeys.scriptRunningStatusesDB, (result)=>{
            if(result[localStorageKeys.scriptRunningStatusesDB]){
                const currentStorageObj = result[localStorageKeys.scriptRunningStatusesDB]
                Object.assign(currentStorageObj, currentItem)
                const finalPayLoad = {[localStorageKeys.scriptRunningStatusesDB]: currentStorageObj}
                chrome.storage.local.set(finalPayLoad, ()=>{
                    processQueue(queue, queueType);
                })
            }
            else{
                const finalPayLoad = {[localStorageKeys.scriptRunningStatusesDB]: currentItem};
                chrome.storage.local.set(finalPayLoad, ()=>{
                    processQueue(queue, queueType);
                })
            }
        })
    }
}

//#endregion

chrome.runtime.onMessage.addListener((message, senderObject, sendResponse) =>{
    //#region reference
        /*
            {
                type: messageTypes.updateTaskDB, 
                info: {
                    taskType: taskType,
                    orderID: [orderID],
                    taskStatus: taskStatus,
                    messageInputs: messageInputs,
                    message: msgNotReady
                    //additions
                    tabID: tab.id
                    scriptingInProgress: false
                    currentScriptingStep: sendInvoice
                }
            }
        */
    //#endregion

    if(message.type == messageTypes.updateTaskDB){
        //#region definitions
        function sendAvailableNotification(){
            return new Promise ((resolve, reject)=>{
                const notificationID = generateUniqueId();
                notificationURLs[notificationID] = `https://northcms.wenzo.com/order/${orderID}`;
                chrome.notifications.create(notificationID, {
                    title: "New Collect Remaining Fees Task Available",
                    message: `Order ID: ${orderID}`,
                    iconUrl:"images/icon-48.png",
                    type: "basic"
                }, ()=>{
                    if(chrome.runtime.lastError){
                        reject("Failed to create notification")
                    }
                    else{
                        resolve("notification created successfully.")
                    }
                })
            })

        }
        // console.log(`message received: ${data}`)
        // console.log(`senderObject received: ${senderObject}`)
        
        
        function removeTab(){
            return new Promise((resolve, reject)=>{
                const tabID = senderObject.tab.id
                chrome.tabs.remove(tabID, ()=>{
                    if(chrome.runtime.lastError){
                        reject(`failed to close tab for ${orderID}`);
                    }
                    else{
                        resolve(`tab closed successfully for ${orderID}`);
                    }
                });
            })
        }

        function updateTaskDB (tabID = "N/A"){
            //push it to the queue
            queues[localStorageKeys.taskDataBase].queue.push(message.info);
            // sendResponse(`Task ${message.info}sent to queue for storage.`);
            if(!isProcessingBooleans.isProcessingTaskDB){
                processQueue(queues[localStorageKeys.taskDataBase].queue, queues[localStorageKeys.taskDataBase].queueType, tabID);
            }
        }
        // console.log(`message received: ${JSON.stringify(message)}`);
        //get the orderID
        const orderID = message.info.orderID;
        //get the tab ID of the opened tab
        // const tab = senderObject.tab;
        // const tabID = tab.id;
        //#endregion
        //Status Update
        if(message.info.taskStatus){
            if(message.info.taskStatus == taskStatuses.statusAvail){
                if(!message.info.action){
                    sendAvailableNotification()
                    updateTaskDB();
                }
                else{
                    //BETA FEATURE: Automatic message sending
                    if(message.info.action == actions.sendMessage){
                        sendAvailableNotification()
                        updateTaskDB();
                        chrome.scripting.executeScript(
                            { target: {tabId: tabID, },
                              world: "MAIN",
                              func: ()=>{
                                const hitSendBtn = ()=>{
                                    const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
                                    // console.log("dynamic script injection, btn selected:", sendBtn);
                                    const event = new MouseEvent("click", {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                    });
                                    window.event = event;
                                
                                    // Temporarily attach the event to `window` before dispatching
                                    // Object.defineProperty(window, "event", {
                                    //     value: event,
                                    //     configurable: true,
                                    // });
                                    // window._testValue = "Hello from console!"
                                    // console.log("window.event under executeScript context:", window.event);
                                    sendBtn.dispatchEvent(event);
                                    // sendBtn.click();
                                    // console.log('event called on sendBtn:', event, "sendBtn is:", sendBtn);
                                } 
                                hitSendBtn(); 
                              }
                            }
                        )
                        .then(()=>{
                            sendResponse("Button clicked for the first time.")
                        })
                        return true;
                    }
                }

                return true;
            }
            else if(message.info.taskStatus == taskStatuses.statusUnavail){
                removeTab();
                updateTaskDB();
            }
            else{
                updateTaskDB();
            }
        }
        //Other updates
        else{
            if((!message.info.action)){
                updateTaskDB();
            }
            else{
                if(message.info.action == actions.writeMessage){
                    // console.log(`message generated: ${message.info.message}`);
                    const theMessage = message.info.message;
                    const targetTabID = Number(message.info.tabID);
                    // console.log(`targetTabID with first method: ${targetTabID}`);
                    //update the database
                    updateTaskDB();
                    // Send the form data to the content script of the active tab
                    console.log("target Tab ID:", targetTabID);
                    chrome.tabs.sendMessage(targetTabID, {
                        type: messageTypes.enterMessage,
                        info: { message: theMessage },
                    });
                    // chrome.tabs.query({active:true}, (tabs)=>{
                    //     const browserTab = tabs.find((tab) => tab.url.includes(orderID));
                    //     if (browserTab) {
                    //         console.log(`Active tab URL: ${browserTab.url}`);
                    //         const activeTabId = browserTab.id;
                    //         console.log(`targetTabID with second method: ${activeTabId}`)
                    //         // Send the form data to the content script of the active tab
                    //         chrome.tabs.sendMessage(activeTabId, {
                    //             type: messageTypes.enterMessage,
                    //             info: { message: theMessage },
                    //         });
                    //      }
                    // })                                       
                }
                else if (message.info.action == actions.runRemFeeTask){
                    const tabID = Number(message.info.tabID);
                    const theMessage = message.info.message;
                    updateTaskDB(tabID);
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{
                        // console.log(JSON.stringify(taskDataBase));

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];
                        // console.log(JSON.stringify(remFeeDataBase));
                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);
                        console.log("target tab ID in storage", targetTabID);
                        console.log("target tab ID from message", tabID);

                        
                    })
                    chrome.tabs.sendMessage(tabID, {
                        type: messageTypes.remFeeTaskInit,
                        info: { message: theMessage },
                    });
                }
                else if (message.info.action == actions.sendMessage){
                    let tabID;
                    updateTaskDB();
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{
                        // console.log(JSON.stringify(taskDataBase));

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];
                        // console.log(JSON.stringify(remFeeDataBase));
                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);
                        tabID = targetTabID;
                        console.log("target tab ID in storage before background script click submission button", tabID);  
                        console.log("tabID before scripting", tabID);
                        chrome.scripting.executeScript(
                            { target: {tabId: tabID },
                              world: "MAIN",
                              func: ()=>{
                                const hitSendBtn = ()=>{
                                    const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
                                    // console.log("dynamic script injection, btn selected:", sendBtn);
                                    const event = new MouseEvent("click", {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window,
                                    });
                                    window.event = event;
                                
                                    // Temporarily attach the event to `window` before dispatching
                                    // Object.defineProperty(window, "event", {
                                    //     value: event,
                                    //     configurable: true,
                                    // });
                                    // window._testValue = "Hello from console!"
                                    // console.log("window.event under executeScript context:", window.event);
                                    sendBtn.dispatchEvent(event);
                                    // sendBtn.click();
                                    // console.log('event called on sendBtn:', event, "sendBtn is:", sendBtn);
                                } 
                                hitSendBtn(); 
                              }
                            }
                        )
                        .then(()=>{
                            sendResponse("Button clicked for the first time.")
                        })
                    })

                    return true;
                }
                else if (message.info.action == actions.removeAlertsFromWindow){
                    let tabID;
                    updateTaskDB();
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{
                        // console.log(JSON.stringify(taskDataBase));

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];
                        // console.log(JSON.stringify(remFeeDataBase));
                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);
                        tabID = targetTabID;
                        console.log("target tab ID in storage before background script click submission button", tabID);  
                        console.log("tabID before scripting", tabID);
                        chrome.scripting.executeScript(
                            { target: { tabId: tabID },
                              world: "MAIN",
                              func: ()=>{
                                window.alert = function() {}; 
                                window.confirm = function() { return true; }; 
                                window.prompt = function() { return ""; };
                              }
                            }
                        )
                        .then(()=>{
                            sendResponse("Window alerts removed.")
                        })
                    })

                    return true;
                }
            }
        }
    }

    else if(message.type == messageTypes.setScriptRunStatus){
        // console.log(`entered into ${messageTypes.setScriptRunStatus} message handler`)
        //push the message payload to its corresponding queue
        queues[localStorageKeys.scriptRunningStatusesDB].queue.push(message.info)
        // console.log(`successfully pushed into the script status update queue ${JSON.stringify(queues[localStorageKeys.scriptRunningStatusesDB].queue)}`);
        //if the processing hasn't started, start it.
        if(!isProcessingBooleans.isProcessingScriptStatus){
            // console.log(`script run info queue selected for processing`);
            processQueue(queues[localStorageKeys.scriptRunningStatusesDB].queue, queues[localStorageKeys.scriptRunningStatusesDB].queueType)
        }
    }
    //test
    //endtest
})


chrome.storage.local.get(null, (result)=>{
    console.log(`${JSON.stringify(result)}`);
})

chrome.notifications.onClicked.addListener((notificationId)=>{
    const url = notificationURLs[notificationId];
    if(url){
        chrome.tabs.create({url})
        delete notificationURLs[notificationId];
    }
    
})




