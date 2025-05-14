//#region definitions
const defaultMsgInputs = {};

const addDelay = (delay=2000)=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, delay);
    })
};

const remFeeKeySteps = {
    dummyStep: "not initiated",
    sendPPWarning: "PP Warning"
}

const remainingFeeMsgKeywords = {
    touchedKeyWord2: "petition letter", 
    touchedKeyword3: "invoice email", 
    touchedKeyWord4: "finalized"
}

const tabDummy = "toBeWritten";

const msgNotReady = "Not Ready";

const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const scriptNames = {
    remFeeWatch: "Remaining Fee Task Watcher",
    remFeeFetch: "Remaining Fee Task Fetcher"
}

const actions = {
    writeMessage: "Please write message.",
    sendMessage: "Please write and then send message.",
    runRemFeeTask: "Run script to complete the task.",
    removeAlertsFromWindow: "Please remove alerts from window"
}

const aisNames = {
    remFeeCollect: "Please Post Remaining Fee Message"
}

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database",
    activelyManagedTabs: "Task Browser Management"
}

function getOrderID(){
    let orderForm = document.querySelector('#sideBarGoToOrderForm');
    let orderIDContainer = orderForm.querySelector('input');
    return orderIDContainer.value;
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database.",
    enterMessage: "Enter the message.",
    remFeeTaskInit: "Initiate rem fee task completion",
    taskURLs: "taskURLs",
    contentScriptPermit: "Check my tab id"
}

const taskers = {
    taskMaster: "Malik Zhang",
    nonTaskMaster: "others"
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

const mouseEvent = new MouseEvent('click', {
    bubbles: true,           // Event bubbles up the DOM
    cancelable: true,        // The event can be cancelled
    view: window,            // The window the event was generated from
    detail: 1,               // The number of times the event has been triggered (for clicks)
    screenX: 0,              // Screen coordinates
    screenY: 0,
    clientX: 0,              // Mouse position relative to the viewport
    clientY: 0,
    button: 0,               // Left mouse button (0: left, 1: middle, 2: right)
    buttons: 1,              // Buttons pressed (1 = left button)
    ctrlKey: false,          // Whether the Ctrl key is pressed
    altKey: false,           // Whether the Alt key is pressed
    shiftKey: false,         // Whether the Shift key is pressed
    metaKey: false           // Whether the Meta key (Cmd or Windows) is pressed
});

function enterText(textMessage){
    let message_box = document.querySelector('#sendMessageBoxTitle');

    message_box.children[0].children[0].click();
    
    //Access the textbox
    
    let formDiv = document.querySelector('#sendMessageFormDiv');
    
    let iframe = formDiv.querySelector('iframe');
    
    let iframeDocument = iframe.contentDocument;
    
    let iframeTextBox = iframeDocument.querySelector('#tinymce');
    
    iframeTextBox.innerHTML = textMessage;
}

const autoGenerateMsgInputs = ()=>{
    //some code goes here
    //returns an object containing new set of msg inputs
}


const sendMsgToUpdteTskDB = ({taskType, orderID, taskStatus, messageInputs="N/A", message = "N/A", msgSent="N/A", tabID="N/A", scriptingInProgress="N/A", currentScriptingStep="N/A"} = {}) => {
    if(taskType && orderID && taskStatus){
        const unfilteredPayload = {taskType, orderID, taskStatus, messageInputs, message, msgSent, tabID, scriptingInProgress, currentScriptingStep};
        const filteredPayload = {};
        Object.keys(unfilteredPayload).forEach((key)=>{
            if(unfilteredPayload[key] !== "N/A"){
                Object.assign(filteredPayload, {[key]: unfilteredPayload[key]});
            }
        })

        const finalMessage = {type: messageTypes.updateTaskDB, info: filteredPayload};
        chrome.runtime.sendMessage(finalMessage);
    }
    else{
        console.log(`Need task type, order ID and taskStatus to send message to BG for update.`);
    }
}


//#endregion
let requiredModules = {};

async function loadRequiredModules(){
    const pathToAutoCompleteScript = chrome.runtime.getURL('pprfm-scripts/pprfm-scripting.js');
    const autoCompleteFuncObj = await import(pathToAutoCompleteScript);
    requiredModules = { autoCompleteFuncObj };
}

// see if the content script is supposed to be running
(async () => {
    await loadRequiredModules();
    const { autoCompleteTask } = requiredModules.autoCompleteFuncObj;

    const result = await chrome.storage.local.get(localStorageKeys.scriptRunningStatusesDB);
    const status = result?.[localStorageKeys.scriptRunningStatusesDB]?.[scriptNames.remFeeWatch];
    //first check for the running status
    if(status == runningStatuses.runningStatus){   
        const response = await chrome.runtime.sendMessage({
            type: messageTypes.contentScriptPermit,
            info: {taskType: aisNames.remFeeCollect}
        })

        if(response.permission){
            //content script actions go here.
            setTimeout(async ()=>{
                //#region Definitions 2
                //test
                                    
                //endTest
                const result = await chrome.storage.local.get(localStorageKeys.taskDataBase);
                const btnsGroupWithShowAll = document.querySelectorAll(".btn.btn-primary.px-4");
                let showAllBtn;
                btnsGroupWithShowAll.forEach((btn)=>{
                    const keyword = "show all";
                    if(btn.textContent.toLowerCase().includes(keyword)){
                        showAllBtn = btn;
                    }
                });

                
                const msgBoxBody = document.querySelector('#messageBoxBody');
            
                const AISKeyWord = "Please post remaining fee message";
            
                const AISMarkedKeyWord = "marked";
            
                const orderID = getOrderID();
                
                const numberOfMsgToGoThrough = 20;

                const showMoreBtn = document.querySelector('.btn.btn-sm.btn-outline-secondary');
                //look through the AIS list first
                showMoreBtn.dispatchEvent(mouseEvent);
                showAllBtn.dispatchEvent(mouseEvent);
                const AISTable = document.querySelector('.table.table-xs.table-borderless.table-hover');
                const AISlistElem = AISTable.firstChild;

                let isRemainingFeeTask = false;

                let remainingFeeMsgExists = false; 
                //helper functions
            
                const getPendingMsgSender = (pendingMsgBox)=>{
                    if(pendingMsgBox.children[0].textContent.includes(taskers.taskMaster)){
                        return  taskers.taskMaster;
                    }
                    else{
                        return taskers.nonTaskMaster;
                    }
                }
            
                const searchForPostedFeeMsg = ()=>{
                    let touched = false;

            
                    for (let i = 0; i < numberOfMsgToGoThrough; i++){
                        const msgBox = msgBoxBody.children[i];
                        if(msgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyWord2) && msgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyword3)&& msgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyWord4)){
                            console.log(`found the response message.`)
                            touched = true;
                            return {touched, msgBox};
                        }
                    }
            
                    return touched;
                }
                //BETA FEATURE IN HERE
                const handleTask = (taskStatus)=>{
                    chrome.storage.local.get([localStorageKeys.taskDataBase], (result)=>{
                        if(result[localStorageKeys.taskDataBase]){
                            const taskDataBase = result[localStorageKeys.taskDataBase];
                            if(taskDataBase[aisNames.remFeeCollect]){
                                const remFeeAisDB = taskDataBase[aisNames.remFeeCollect];
                                //second entry
                                if(remFeeAisDB[orderID]){
                                    const aisInfo = remFeeAisDB[orderID];
                                    const oldStatus = aisInfo.taskStatus;
                                    const preloadedMsg = aisInfo.message;
                                    let msgSent = aisInfo.msgSent;
                                    //This should only be for available tasks.
                                    // console.log(`old status: ${oldStatus}, new status: ${taskStatus}`)
                                    //If status changed
                                    if(oldStatus !== taskStatus){      
                                        //if status CHANGED to available                 
                                        if(taskStatus == taskStatuses.statusAvail){
                                            //check if both a message is ready AND the message has not been sent
                                            if(preloadedMsg !== msgNotReady && (!msgSent)){
                                                //update the database and send the message automatically                                                       
                                                msgSent = true;
                                                //BETA FEATURE: Automatic message sending
                                                enterText(`${preloadedMsg}`);
                                                chrome.runtime.sendMessage({ 
                                                    type: messageTypes.updateTaskDB, 
                                                    info: { taskType: aisNames.remFeeCollect, orderID, taskStatus, msgSent, action: actions.sendMessage}
                                                })
                                                    .then((response)=>{
                                                        console.log("response received:", response);
                                                        const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
                                                        console.log("content script, btn selected:", sendBtn);
                                                        const event = new MouseEvent("click", {
                                                            bubbles: true,
                                                            cancelable: true,
                                                            view: window,
                                                        });
                                                        sendBtn.dispatchEvent(event);
                                                        console.log('event dispatched.');
                                                    })
                                                //CHANGE* WE NEED TO HIT "SEND" BUTTON HERE
                                            }
                                            else{
                                                //ONLY update the database of the status.
                                                console.log("Task just became available, no message was sent to client because there isn't an available message or a message has been sent.")
                                                sendMsgToUpdteTskDB({taskType: aisNames.remFeeCollect, orderID, taskStatus});
                                            }
                                        }
                                        //if status changed to anything else
                                        else{
                                            //ONLY update the database of the status.
                                            sendMsgToUpdteTskDB({taskType: aisNames.remFeeCollect, orderID, taskStatus});
                                        }
                                    }
                                    //if status has not changed
                                    else{
                                        console.log("Status has not changed since last update, no message sent to BG.");
                                    }
                                }
                                //first entry
                                else{
                                    //GENERATE THE AUTO MESSAGE INPUTS HERE.
                                    const messageInputs = defaultMsgInputs;                          
                                    // {taskType, orderID, taskStatus, messageInputs="N/A", message = "N/A", msgSent="N/A", tabID="N/A", scriptingInProgress="N/A", currentScriptingStep="N/A"}
                                    if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                        sendMsgToUpdteTskDB({
                                            taskType: aisNames.remFeeCollect, 
                                            orderID, 
                                            taskStatus, 
                                            messageInputs: {}, 
                                            msgSent: true, 
                                            message: msgNotReady, 
                                            tabID: tabDummy, 
                                            scriptingInProgress: false, 
                                            currentScriptingStep: remFeeKeySteps.dummyStep
                                        });
                                    }
                                    else{                                        
                                        sendMsgToUpdteTskDB({
                                            taskType:aisNames.remFeeCollect, 
                                            orderID, taskStatus, 
                                            messageInputs, 
                                            msgSent: false, 
                                            message: msgNotReady,
                                            tabID: tabDummy,
                                            scriptingInProgress: false,
                                            currentScriptingStep: remFeeKeySteps.dummyStep
                                        });
                                    }   
                                }
                            }
                            //first entry
                            else{
                                //GENERATE THE AUTO MESSAGE INPUTS HERE.
                                const messageInputs = defaultMsgInputs;                          
                                if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                    sendMsgToUpdteTskDB({
                                        taskType: aisNames.remFeeCollect, 
                                        orderID, 
                                        taskStatus, 
                                        messageInputs, 
                                        msgSent: true, 
                                        message: msgNotReady, 
                                        tabID: tabDummy, 
                                        scriptingInProgress: false, 
                                        currentScriptingStep: remFeeKeySteps.dummyStep
                                    });
                                }
                                else{                                        
                                    sendMsgToUpdteTskDB({
                                        taskType:aisNames.remFeeCollect, 
                                        orderID, taskStatus, 
                                        messageInputs, 
                                        msgSent: false, 
                                        message: msgNotReady,
                                        tabID: tabDummy,
                                        scriptingInProgress: false,
                                        currentScriptingStep: remFeeKeySteps.dummyStep
                                    });
                                }                 
                            }
                        }
                        //first entry
                        else{
                            //GENERATE THE AUTO MESSAGE INPUTS HERE.
                            const messageInputs = defaultMsgInputs;                          
                            if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                sendMsgToUpdteTskDB({
                                    taskType: aisNames.remFeeCollect, 
                                    orderID, 
                                    taskStatus, 
                                    messageInputs, 
                                    msgSent: true, 
                                    message: msgNotReady, 
                                    tabID: tabDummy, 
                                    scriptingInProgress: false
                                });
                            }
                            else{                                        
                                sendMsgToUpdteTskDB({
                                    taskType:aisNames.remFeeCollect, 
                                    orderID, taskStatus, 
                                    messageInputs, 
                                    msgSent: false, 
                                    message: msgNotReady,
                                    tabID: tabDummy,
                                    scriptingInProgress: false,
                                    currentScriptingStep: remFeeKeySteps.dummyStep
                                });
                            }  
                        }
                    })
                }
            
                const handleTouchedTask = (pendingMsgBox) =>{
                    const msgSender = getPendingMsgSender(pendingMsgBox);
                    // console.log(`handleTouchedTask returns: msgSender`);
            
                    handleUndoableTask(msgSender);              
                }
            
                const handleUndoableTask = (msgSender) => {
                    if(msgSender == taskers.taskMaster){
                        console.log(`identified as done task, send to handleTask for processing.`)
                        handleTask(taskStatuses.statusMaster);
                    }
                    else{
                        handleTask(taskStatuses.statusUnavail);
                    }
                }

                function goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough){
                    //#region definition
                    //define your keywords here.
                    const keyWord1 = "finalized version";
                                    
                    const keyword2 = "petition letter";
                    
                    const keyword3 = "multiple and thorough reviews";
                
                    const keyword4 = "eb1b";

                    const keyword5 = "o1";
                
                    const pendingKeyWord = "pending";
                

                    //#endregion                    
                    for (let i = 0; i < numberOfMsgToGoThrough; i++) {
                        // console.log("Looking through messages...");
                        const child = msgBoxBody.children[i];
                        //looking through the message box
                        if (child.textContent.toLowerCase().includes(keyWord1) && child.textContent.toLowerCase().includes(keyword2) && child.textContent.toLowerCase().includes(keyword3)) {
                            //the message box containing all the keywords is located
                            remainingFeeMsgExists = true;
                            isRemainingFeeTask = true;
                            //EB1B scenario
                            if (child.textContent.toLowerCase().includes(keyword4) || child.textContent.toLowerCase().includes(keyword5)){
                                handleTask(taskStatuses.statusUnavail);
                                break;
                            }
                    
                            //pending message
                            else if (child.classList.contains(pendingKeyWord)) {
                                handleTask(taskStatuses.statusPend);
                                break;
                            }
                            
                            //if available
                            else{
                                const { touched, msgBox } = searchForPostedFeeMsg();
                                //available & untouched
                                if ((!touched)){
                                    // console.log("qualified the message");
                                    handleTask(taskStatuses.statusAvail);
                                    break;
                                }
                                //available & touched
                                else{
                                    // console.log(`Message touched by ${taskers.nonTaskMaster}`);
                                    handleTouchedTask(msgBox);
                                    break;
                                }
                            }
                    
                        }
                        //if the msgbox does not contain all the keywords, do nothing and move onto the next
                    };
                }
                //#endregion

                // //go through the AIS list on the page first
                // for (let i = 0; i < AISlistElem.children.length; i++){
                //     const AISListItemTextContent = AISlistElem.children[i].textContent;
                //     //if there is a relevant ais item
                //     if(AISListItemTextContent.includes(AISKeyWord)){
                //         isRemainingFeeTask = true;
                //         //if it's already marked by someone else
                //         if(AISListItemTextContent.includes(AISMarkedKeyWord) && (!AISListItemTextContent.includes(taskers.taskMaster))){
                //             handleUndoableTask();
                //             return;
                //         }
                //         else{
                //             break;
                //         }
                //     }
                    
                //     else{
                //         //code here
                //         //go through the message to double check
                //         goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough);
                //         //if after double checking there turns out to be a message related to the task, the task will have been handled in
                //         //the function above, all we gotta do now is to terminate this program.
                //         if(isRemainingFeeTask){
                //             return;
                //         }
                //         //otherwise do nothing and allow the page to be disqualified by the following code
                //     }            
                // }
            
                // if(!isRemainingFeeTask){
                //     console.log(`page not qualified to be "${aisNames.remFeeCollect}" task. No messages are sent to BG.`);
                //     return;
                // }
                
                //if message was found in the AIS and not marked. We go through the messages.

                goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough);
            
                // //edge case: no remaining fee msg was found, but somehow remaining fee is in the AIS.
                // if(!remainingFeeMsgExists){
                //     handleTask(taskStatuses.statusPend);
                // }

                //See if scripting is in progress.
                const targetOrderInfo = result?.[localStorageKeys.taskDataBase]?.[aisNames.remFeeCollect]?.[orderID];
                //If it is, simply do the task and return.
                if (targetOrderInfo.scriptingInProgress){  
                    await autoCompleteTask(orderID);
                    return;
                }

            }, 2000);
            chrome.runtime.onMessage.addListener((message)=>{
                if(message.type == messageTypes.enterMessage){
                    // console.log("message entered.");
                    enterText(message.info.message);
                }
                else if(message.type == messageTypes.remFeeTaskInit){
                    enterText(message.info.message);
                    const orderID = getOrderID();
                    chrome.runtime.sendMessage({ 
                        type: messageTypes.updateTaskDB, 
                        info: { taskType: aisNames.remFeeCollect, 
                                orderID, 
                                action: actions.sendMessage 
                                }
                    })
                    .then((response)=>{
                        console.log("response received:", response);
                        const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
                        // console.log("content script, btn selected:", sendBtn);
                        const event = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                        });
                        sendBtn.dispatchEvent(event);
                    })
                }
            })
        }     
        else{
            console.log(`Tab has NOT been opened by fetcher.`);
        }
           
    }
    else{
        console.log(`${scriptNames.remFeeWatch} is not active.`);
    }
})();





