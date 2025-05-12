//#region definitions
const remFeeKeySteps = {
    dummyStep: "not initiated",
    sendInvoice: "Send Invoice(s)",
    markOffAIS: "Mark off AIS"
}

const PPRFM_GROUP_NAMES = {
    Available: "Available",
    Pending: "Pending",
    Aborted: "Aborted",
    Done: "Done"
}

const PPRFM_GROUP_COLORS = {
    Available: "green",
    Pending: "red",
    Aborted: "orange",
    Done: "grey"
}

const scriptNames = {
    remFeeWatch: "Remaining Fee Task Watcher",
    remFeeFetch: "Remaining Fee Task Fetcher"
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
    statusUnavail: "Undoable",
    statusDisqualified: "Disqualified",
    statusTaken: "Done By Others",
    statusWaitingToPostMsg: "Waiting for message"
}

const remFeeWatchingTask = "remFeeWatchingStatus";

const remFeeFetTask = "remFeeFetchingStatus";

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database",
    activelyManagedTabs: "Task Browser Management"
}


const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const queues = {
    [localStorageKeys.scriptRunningStatusesDB]: {queue: [], queueType: localStorageKeys.scriptRunningStatusesDB},
    [localStorageKeys.taskDataBase] : {queue: [], queueType: localStorageKeys.taskDataBase},
    [localStorageKeys.activelyManagedTabs] : {queue: [], queueType: localStorageKeys.activelyManagedTabs}
}


let notificationURLs = {};

const isProcessingBooleans = {
    isProcessingTaskDB: false,
    isProcessingScriptStatus: false,
    isProcessingTabIDs: false
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database.",
    enterMessage: "Enter the message.",
    remFeeTaskInit: "Initiate rem fee task completion",
    taskURLs: "taskURLs",
    contentScriptPermit: "Check my tab id"
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

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

const newTabGroup = (taskType, orderID, tabGroupTitle, tabGroupColor)=>{

    /*
    This function creates a new tab group and move the target task tab to that tab group,
    and then it will update the Task Browser Managment Database accordingly.
    */
    return new Promise((resolve, reject)=>{
        //Obtain the tabID for the specific order
        chrome.storage.local.get(localStorageKeys.taskDataBase)
            .then((result)=>{
                const targetTabID = result?.[localStorageKeys.taskDataBase]?.[taskType]?.[orderID]?.tabID;                                                   
                if(targetTabID){
                    chrome.storage.local.get(localStorageKeys.activelyManagedTabs)
                        .then((result)=>{
                            const targetWindowID = result?.[localStorageKeys.activelyManagedTabs]?.[taskType]?.WindowID
                            if(targetWindowID){
                                //Create a new tab group using the obtained tabID and windowID for the taskType
                                chrome.tabs.group( {createProperties:{windowId: targetWindowID}, tabIds:[targetTabID]} )
                                    .then((groupId)=>{
                                        //update the group information
                                        console.log("Debug groupID:", groupId);
                                        chrome.tabGroups.update(groupId, {
                                            title: tabGroupTitle,
                                            color: tabGroupColor
                                        })                                                                                             
                                        .then(()=>{
                                            //update the group id to Task Browser Managment
                                            chrome.storage.local.get(localStorageKeys.activelyManagedTabs)
                                                .then((result)=>{
                                                    const TaskBMgmtDB = result?.[localStorageKeys.activelyManagedTabs];
                                                    const taskSpecific = TaskBMgmtDB?.[taskType];
                                                    const groupMap = taskSpecific?.GroupMap;
                                                    if(TaskBMgmtDB && taskSpecific && groupMap){
                                                        const updatedTBM = {
                                                            [localStorageKeys.activelyManagedTabs]: {
                                                                ...TaskBMgmtDB,
                                                                [taskType]:{
                                                                    ...taskSpecific,
                                                                    GroupMap: {
                                                                        ...groupMap,
                                                                        [tabGroupTitle]:groupId
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        chrome.storage.local.set(updatedTBM)
                                                            .then(()=>{
                                                                resolve();
                                                            })  
                                                    }
                                                    else{
                                                        reject("NOT ABLE TO READ TASK BROWSER MGMT DB.");
                                                    }                                                     
                                                })
                                        })
                                    })
                            }
                            else{
                                reject("Unable to read window ID!")
                            }
                        })

                }
                else{
                    reject("Unable to read tabID!");
                }
            })
    })
}

const moveToExistingTabGroup = (taskType, orderID, groupID)=>{
    return new Promise((resolve, reject)=>{
        //put the tab in the existing tab group
        chrome.storage.local.get(localStorageKeys.taskDataBase)
        .then((result)=>{
            const targetTabID = result?.[localStorageKeys.taskDataBase]?.[taskType]?.[orderID]?.tabID;
            if(targetTabID){
                chrome.tabs.group({
                    tabIds:[targetTabID],
                    groupId: groupID
                })
                .then(()=>{
                    resolve();
                })
            }
            else{
                reject("Cannot read tab ID.")
            }
        })
    })
}

const generateTBMForTask = (scriptWindowID, taskType)=>{
    //This function will either return a tbm for the task or an empty object if 
    //it cannot determine the correct groupmap. 

    //region definitions
    let groupmap = {};
    if(taskType == aisNames.remFeeCollect){
        for (const key in PPRFM_GROUP_NAMES){
            groupmap[PPRFM_GROUP_NAMES[key]] = null;
        }
    }
    //#endregion
    if(Object.keys(groupmap).length === 0){
        return groupmap;
    }

    else{
        const tbmForTask = {
            [taskType]:{
                WindowID: scriptWindowID,
                GroupMap: groupmap,
                TabIDs: []
            }
        }
        return tbmForTask;
    }
}

const initializeTBM = (scriptWindowID, taskType)=>{
    return new Promise((resolve, reject)=>{
        //region definitions
        const tbmForTask = generateTBMForTask(scriptWindowID, taskType);
        //#endregion

        if(Object.keys(tbmForTask).length === 0){
            reject("cannot initialize the tbm for task");
        }

        else{
            const finalPayLoad = {
                [localStorageKeys.activelyManagedTabs]: {
                    ...tbmForTask
                }
            }
    
            chrome.storage.local.set(finalPayLoad)
                .then(()=>{
                    resolve();
                })
                .catch((error)=>{
                    reject(error);
                })
        }
    })
}



const moveToAppropriateTabGroup = (statusTask, taskType, orderID)=>{
    return new Promise((resolve, reject)=>{
        //region definitions
        let tabGroupTitle;
        let tabGroupColor;

        if(statusTask == taskStatuses.statusAvail){
            tabGroupTitle = PPRFM_GROUP_NAMES.Available;
            tabGroupColor = PPRFM_GROUP_COLORS.Available;
        }
        else if(statusTask == taskStatuses.statusPend){
            tabGroupTitle = PPRFM_GROUP_NAMES.Pending;
            tabGroupColor = PPRFM_GROUP_COLORS.Pending;
        }
        //CAUTION: Waiting to further finalize the taskStatuses.
        else if(statusTask == taskStatuses.statusDisqualified){
            tabGroupTitle = PPRFM_GROUP_NAMES.Aborted;
            tabGroupColor = PPRFM_GROUP_COLORS.Aborted;
        }
        else if(statusTask == taskStatuses.statusMaster){
            tabGroupTitle = PPRFM_GROUP_NAMES.Done;
            tabGroupColor = PPRFM_GROUP_COLORS.Done;
        }

        //#endregion
        if(tabGroupTitle&&tabGroupColor){
            //First look at the GroupMap for the specific taskType
            chrome.storage.local.get([localStorageKeys.activelyManagedTabs])
                .then((result)=>{
                    const existingGroupID = result?.[localStorageKeys.activelyManagedTabs]?.[taskType]?.GroupMap?.[tabGroupTitle];
                    //If there is a group id for available
                    if(existingGroupID){
                        chrome.tabGroups.get(existingGroupID)
                            .then(()=>{
                                moveToExistingTabGroup(taskType, orderID, existingGroupID)
                                .then(()=>{
                                    resolve();
                                })
                                .catch((error)=>{
                                    reject(error);
                                })
                            })
                            .catch(()=>{
                                //create a new tab group
                                newTabGroup(taskType, orderID, tabGroupTitle, tabGroupColor)
                                    .then(()=>{
                                        resolve();
                                    })
                                    .catch((error)=>{
                                        reject(error);
                                    })
                            })
                    }
                    //if it's null
                    else{
                        //create a new tab group
                        newTabGroup(taskType, orderID, tabGroupTitle, tabGroupColor)
                            .then(()=>{
                                resolve();
                            })
                            .catch((error)=>{
                                reject(error);
                            })
                    }
                })
        }
        else{
            resolve();
        }
    })
}

const processQueue = (queue, queueType)=>{
    
    if(queueType == localStorageKeys.taskDataBase){
        //if there is no more message in the queue
        if(queue.length === 0){
            isProcessingBooleans.isProcessingTaskDB = false;
            return;
        }
        const currentItem = queue.shift();

        //#region definitions

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
            Object.assign(relevantDetails, {tabID: currentItem.tabID});
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
        
        chrome.storage.local.get(localStorageKeys.taskDataBase)
            .then((result)=>{
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
                            //Additionally handle tab grouping when it comes to status update
                            if(currentItem.taskStatus){
                                chrome.storage.local.set(finalOutput)
                                    .then(()=>{
                                        moveToAppropriateTabGroup(currentItem.taskStatus, taskType, orderID)
                                            .then(()=>{
                                                processQueue(queue, queueType);
                                            })
                                            .catch((error)=>{
                                                console.log(error);
                                            })
                                    })

                            }
                            else{
                                chrome.storage.local.set(finalOutput, ()=>{
                                    // console.log(`Task database initiated: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                                    processQueue(queue, queueType)
                                });
                            }
                        }
                        else{
                            Object.assign(remFeeDB, relevantDetails);
                            const remFeeDBUpdated = {[taskType]: remFeeDB};
                            Object.assign(taskInfoDB, remFeeDBUpdated);
                            const finalOutput = { [localStorageKeys.taskDataBase]: taskInfoDB }
                            //Additionally handle tab grouping when it comes to status update
                            if(currentItem.taskStatus){
                                chrome.storage.local.set(finalOutput)
                                    .then(()=>{
                                        moveToAppropriateTabGroup(currentItem.taskStatus, taskType, orderID)
                                            .then(()=>{
                                                processQueue(queue, queueType);
                                            })
                                            .catch((error)=>{
                                                console.log(error);
                                            })
                                    })

                            }
                            else{
                                chrome.storage.local.set(finalOutput, ()=>{
                                    // console.log(`Task database initiated: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                                    processQueue(queue, queueType)
                                });
                            }
                        }
                    }
                    else{
                        Object.assign(taskInfoDB, taskTypeDBInit);
                        const finalOutput = {[localStorageKeys.taskDataBase]: taskInfoDB};
                        //Additionally handle tab grouping when it comes to status update
                        if(currentItem.taskStatus){
                            chrome.storage.local.set(finalOutput)
                                .then(()=>{
                                    moveToAppropriateTabGroup(currentItem.taskStatus, taskType, orderID)
                                        .then(()=>{
                                            processQueue(queue, queueType);
                                        })
                                        .catch((error)=>{
                                            console.log(error);
                                        })
                                })

                        }
                        else{
                            chrome.storage.local.set(finalOutput, ()=>{
                                // console.log(`Task database initiated: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                                processQueue(queue, queueType)
                            });
                        }
                    }
                }
                else{
                    const finalOutput = {[localStorageKeys.taskDataBase]: taskTypeDBInit};
                    //Additionally handle tab grouping when it comes to status update
                    if(currentItem.taskStatus){
                        chrome.storage.local.set(finalOutput)
                            .then(()=>{
                                moveToAppropriateTabGroup(currentItem.taskStatus, taskType, orderID)
                                    .then(()=>{
                                        processQueue(queue, queueType);
                                    })
                                    .catch((error)=>{
                                        console.log(error);
                                    })
                            })

                    }
                    else{
                        chrome.storage.local.set(finalOutput, ()=>{
                            // console.log(`Task database initiated: ${JSON.stringify(finalOutput[localStorageKeys.taskDataBase])}`, "Moving onto the next msg...");
                            processQueue(queue, queueType)
                        });
                    }
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
    //Task Browser Managment DB change
    else if(queueType == localStorageKeys.activelyManagedTabs){

        if(queue.length === 0){
            isProcessingBooleans.isProcessingTabIDs = false;
            return;
        }

        const currentItem = queue.shift();

        chrome.storage.local.get(localStorageKeys.activelyManagedTabs)
            .then((result)=>{
                //If task browser managment DB has already been initialized
                const activeMgedTabs = result?.[localStorageKeys.activelyManagedTabs];
                if(activeMgedTabs){
                    const taskSpecificBM = activeMgedTabs?.[currentItem.taskType];
                    if(taskSpecificBM){
                        //Window ID field update                     
                        if(currentItem.ScriptWindowID){

                            const finalPayload = {[localStorageKeys.activelyManagedTabs]:{
                                ...activeMgedTabs,
                                [currentItem.taskType]:{
                                    ...taskSpecificBM,
                                    WindowID: currentItem.ScriptWindowID
                                }
                            }}

                            chrome.storage.local.set(finalPayload)
                                .then(()=>{
                                    processQueue(queue, queueType);
                                })       
                                .catch((error)=>{
                                    console.log(error);
                                    processQueue(queue, queueType);
                                })
                        }
                        //tab ID update
                        else if(currentItem.tabID){
                            if(taskSpecificBM.TabIDs){
                                const finalPayLoad = {
                                    [localStorageKeys.activelyManagedTabs]:{
                                        ...activeMgedTabs,
                                        [currentItem.taskType]:{
                                            ...taskSpecificBM,
                                            TabIDs: [...taskSpecificBM.TabIDs, currentItem.tabID]
                                        }
                                    }
                                }
                                chrome.storage.local.set(finalPayLoad)
                                    .then(()=>{
                                        processQueue(queue, queueType);
                                    })
                                    .catch((error)=>{
                                        console.log(error);
                                        processQueue(queue, queueType);
                                    })
                            }
                        }
                    }
                    //first entry at the task type level
                    else{
                        
                        const entryInBrowMgmt = generateTBMForTask(currentItem.ScriptWindowID, currentItem.taskType);

                        const finalPayloadToLocalStorage = { [localStorageKeys.activelyManagedTabs] : {
                            ...activeMgedTabs,
                            ...entryInBrowMgmt
                        }};

                        chrome.storage.local.set(finalPayloadToLocalStorage)
                            .then(()=>{
                                processQueue(queue, queueType);
                            })
                            .catch((error)=>{
                                console.log(error);
                                processQueue(queue, queueType);
                            })
                    }
                }

                //Initializing the "Task Browser Managment" Field    
                //We are assuming the initializing is only done through fetchers.

                //TODO
                else{
                    initializeTBM(currentItem.ScriptWindowID, currentItem.taskType)
                        .then(()=>{
                            processQueue(queue, queueType);
                        })
                        .catch((error)=>{
                            console.log(error);
                        })
                }
            })
    }
}

async function openURLs(urlArr, taskType, windowID){
    if(windowID){
        for(const currentURL of urlArr){
            await chrome.tabs.create({url: currentURL, windowId: windowID})
                .then((tab)=>{
                    const tabID = tab.id;
                    const payLoad = {taskType, tabID};
                    queues[localStorageKeys.activelyManagedTabs].queue.push(payLoad);
                })
            await delay(1000);
        }
        if(!isProcessingBooleans.isProcessingTabIDs){
            processQueue(queues[localStorageKeys.activelyManagedTabs].queue, queues[localStorageKeys.activelyManagedTabs].queueType)
        }
    }

    else{
        console.log("Need window id to open tabs.")
    }


}

//#endregion

chrome.runtime.onMessage.addListener((message, senderObject, sendResponse) =>{

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

        function updateTaskDB (){
            //push it to the queue
            queues[localStorageKeys.taskDataBase].queue.push(message.info);
            // sendResponse(`Task ${message.info}sent to queue for storage.`);
            if(!isProcessingBooleans.isProcessingTaskDB){
                processQueue(queues[localStorageKeys.taskDataBase].queue, queues[localStorageKeys.taskDataBase].queueType);
            }
        }
        // console.log(`message received: ${JSON.stringify(message)}`);
        //get the orderID
        const orderID = message.info.orderID;
        //get the tab ID of the opened tab
        const tab = senderObject.tab;
        const tabID = tab.id;
        //update the message info tabID field
        if(message.info.tabID){
            Object.assign(message.info, {tabID: tabID});
        }
       
        //#endregion
        //Status Update
        if(message.info.taskStatus){
            //add tabID to the message info if applicable

            if(message.info.taskStatus == taskStatuses.statusAvail){
                if(!message.info.action){
                    sendAvailableNotification();
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
                console.log("DEBUG: CORRECT IF BLOCK ENTERED")
                updateTaskDB();
            }
            else{
                if(message.info.action == actions.writeMessage){
                    // console.log(`message generated: ${message.info.message}`);
                    const theMessage = message.info.message;
                    
                    // console.log(`targetTabID with first method: ${targetTabID}`);
                    //update the database
                    updateTaskDB();
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                        .then((taskDataBaseKeyValue)=>{
                            const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                            const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];
                            const targetOrderInfo = remFeeDataBase[orderID];
                            
                            const targetTabID = Number(targetOrderInfo.tabID);
                            
                            console.log("target tab ID in storage", targetTabID);
                            chrome.tabs.sendMessage(targetTabID, {
                                type: messageTypes.enterMessage,
                                info: { message: theMessage },
                            });
                            sendResponse("Done."); 
                        }
                    
                    )
                    chrome.tabs.sendMessage(targetTabID, {
                        type: messageTypes.enterMessage,
                        info: { message: theMessage },
                    });                                       
                }
                else if (message.info.action == actions.runRemFeeTask){
                    // const tabID = Number(message.info.tabID);

                    const theMessage = message.info.message;

                    updateTaskDB();
                    
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];
                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);
                        
                        console.log("target tab ID in storage", targetTabID);
                        chrome.tabs.sendMessage(targetTabID, {
                            type: messageTypes.remFeeTaskInit,
                            info: { message: theMessage },
                        });
                        sendResponse("Done."); 
                    })
                     
                }
                else if (message.info.action == actions.sendMessage){

                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];

                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);

                        chrome.scripting.executeScript(
                            { target: {tabId: targetTabID },
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
                    updateTaskDB();
                    chrome.storage.local.get([localStorageKeys.taskDataBase])
                    .then((taskDataBaseKeyValue)=>{

                        const taskDataBase = taskDataBaseKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDataBase = taskDataBase[aisNames.remFeeCollect];

                        const targetOrderInfo = remFeeDataBase[orderID];
                        
                        const targetTabID = Number(targetOrderInfo.tabID);


                        chrome.scripting.executeScript(
                            { target: { tabId: targetTabID },
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
        //If setting the script run status for a fetcher
        if(message.info.scriptName == scriptNames.remFeeFetch){
            //payload for script statuses DB
            const payloadForScriptRunStatus = {[message.info.scriptName] : message.info.scriptStatus};
            //update script run status
            queues[localStorageKeys.scriptRunningStatusesDB].queue.push(payloadForScriptRunStatus);
            if(!isProcessingBooleans.isProcessingScriptStatus){
                // console.log(`script run info queue selected for processing`);
                processQueue(queues[localStorageKeys.scriptRunningStatusesDB].queue, queues[localStorageKeys.scriptRunningStatusesDB].queueType)
            }
            //payload for Task Browser Management DB
            let windowID;
            let payloadForActiveMgedTabs;
            chrome.windows.getLastFocused()
                .then((window)=>{
                    windowID = window.id;
                    payloadForActiveMgedTabs = {
                        taskType: message.info.taskType,
                        ScriptWindowID: windowID
                    }
                    //update window ID in the Task Browser Management DB for 
                    //the specific task
                    queues[localStorageKeys.activelyManagedTabs].queue.push(payloadForActiveMgedTabs);
                    if(!isProcessingBooleans.isProcessingTabIDs){
                        processQueue(queues[localStorageKeys.activelyManagedTabs].queue, queues[localStorageKeys.activelyManagedTabs].queueType);
                    }
                }) 
                .catch(()=>{
                    console.log("Cannot get last focused window.")
                })
        }

        //push the message payload to its corresponding queue
        else{
            queues[localStorageKeys.scriptRunningStatusesDB].queue.push(message.info)
            // console.log(`successfully pushed into the script status update queue ${JSON.stringify(queues[localStorageKeys.scriptRunningStatusesDB].queue)}`);
            //if the processing hasn't started, start it.
            if(!isProcessingBooleans.isProcessingScriptStatus){
                // console.log(`script run info queue selected for processing`);
                processQueue(queues[localStorageKeys.scriptRunningStatusesDB].queue, queues[localStorageKeys.scriptRunningStatusesDB].queueType)
            }
        }

    }

    else if(message.type == messageTypes.taskURLs){
        const allURLs = message.info.URLS;
        const taskType = message.info.taskType;
        chrome.storage.local.get([localStorageKeys.activelyManagedTabs])
            .then((result) => {
                if(result[localStorageKeys.activelyManagedTabs]){
                    const tabsDB = result[localStorageKeys.activelyManagedTabs];
                    if(tabsDB[message.info.taskType]){
                        const tabsDBTaskSpecific = tabsDB[message.info.taskType];
                        if(tabsDBTaskSpecific.WindowID){
                            //Specifically open the tab in stored window
                            openURLs(allURLs, taskType, tabsDBTaskSpecific.WindowID);
                        }   
                        else{
                            console.log("No window ID, cannot open tab.")
                        }
                    }
                    else{
                        console.log("No window ID, cannot open tab.")
                    }
                }
                else{
                    console.log("No window ID. Cannot open tab.")
                }
            })
    }
    else if(message.type == messageTypes.contentScriptPermit){
        const tabIDOfSender = senderObject.tab.id;
        // console.log("sender tab id:", tabIDOfSender);
        chrome.storage.local.get([localStorageKeys.activelyManagedTabs])
            .then((result)=>{
                // console.log("data retrieved", result);
        
                if(result[localStorageKeys.activelyManagedTabs]){
                    const activeMgedTabs = result[localStorageKeys.activelyManagedTabs];
                    if(activeMgedTabs[message.info.taskType]){
                        const taskSpecificDB = activeMgedTabs[message.info.taskType];
                        const tabIDArr = taskSpecificDB.TabIDs;
                        if(tabIDArr.includes(tabIDOfSender)){   
                            sendResponse({permission: true});
                        }
                        else{
                            sendResponse({permission: false});
                        }
                    }
                    //task type does not exist
                    else{
                        sendResponse({permission: false});
                    }
                }
                //database does not exist
                else{
                    sendResponse({permission: false});
                }  
            })
    }
    //test  
    //endtest
    return true;
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




