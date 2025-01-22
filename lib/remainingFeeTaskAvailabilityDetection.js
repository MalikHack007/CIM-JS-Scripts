//#region definitions
const defaultMsgInputs = {
    isCaseSpecific: false,
    usersCase: "", 
    hasPaid: false, 
    remainingAttorneyFee: 0, 
    isPp: false, 
    ppInfoIsProvided: false, 
    isInsideUS: false, 
    anotherPriorityDate: false, 
    exactPriorityDate: "N/A",
    countryOfBirth: "N/A", 
    priorityDateIsCurrent: false, 
    h1bIsExpiring: false, 
    serviceCenter: "N/A", 
    processingTime: "N/A", 
    isFurtherInquiry: false,
    //new input additions 01-08-2025
    isOtherPDApproved: false,
    isFilingFeeCredit: false,
    filingFeeCreditType:"N/A",
    filingFeeCredit: 0,
    hasComplained: false
}

const msgNotReady = "N/A";

const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const scriptNames = {
    remFeeWatch: "Remaining Fee Task Watcher",
    remFeeFetch: "Remaining Fee Task Fetcher"
}

const aisNames = {
    remFeeCollect: "Please Post Remaining Fee Message"
}

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database"
}

function getOrderID(){
    let orderForm = document.querySelector('#sideBarGoToOrderForm');
    let orderIDContainer = orderForm.querySelector('input');
    return orderIDContainer.value;
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database."
}

const taskers = {
    taskMaster: "Malik Zhang",
    nonTaskMaster: "others"
}

const taskStatuses = {
    statusAvail: "Available",
    statusPend: "Pending",
    statusMaster: `Done by ${taskers.taskMaster}`,
    statusUnavail: "Undoable"
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

const sendMsgToUpdteTskDB = (taskType, orderID, taskStatus, messageInputs) => {
    if(messageInputs){
        chrome.runtime.sendMessage(
            {
                type: messageTypes.updateTaskDB, 
                info: {
                    taskType: taskType,
                    orderID: [orderID],
                    taskStatus: taskStatus,
                    messageInputs: messageInputs,
                    message: msgNotReady
                }
            }
        )
    }
    else{
        console.log(`sending message to BG...`)
        chrome.runtime.sendMessage(
            {
                type: messageTypes.updateTaskDB, 
                info: {
                    taskType: taskType,
                    orderID: [orderID],
                    taskStatus: taskStatus,
                }
            }
        )
    }

}

//#region message reference
/*
{
    type: messageTypes.updateTaskDB, 
    info: {
        taskType: aisNames.remFeeCollect,
        orderID: [orderID],
        taskStatus: taskStatuses.statusUnavail,
        messageInputs:{

        },
        message:"........."
    }
}
*/
//#endregion

//#region Local Storage Reference
/*
    chrome.storage.local



    key: localStorageKeys.taskDataBase



    value: 

    {
        [taskName]:{
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
//#endregion

//see if the content script is supposed to be running
chrome.storage.local.get([localStorageKeys.scriptRunningStatusesDB],(result)=>{
    if(result[localStorageKeys.scriptRunningStatusesDB]){
        const scriptRunStatusDB = result[localStorageKeys.scriptRunningStatusesDB]
        if(scriptRunStatusDB[scriptNames.remFeeWatch]){
            const status = scriptRunStatusDB[scriptNames.remFeeWatch]
            if(status == runningStatuses.runningStatus){
                //content script actions go here.
                setTimeout(()=>{
                    //#region Definitions 2
                
                    const msgBoxBody = document.querySelector('#messageBoxBody');
                
                    console.log(msgBoxBody);
                
                    const AISKeyWord = "Please post remaining fee message";
                
                    const AISMarkedKeyWord = "marked";
                
                    const orderID = getOrderID();
                    
                    const numberOfMsgToGoThrough = 20;

                    const showMoreBtn = document.querySelector('.btn.btn-sm.btn-outline-secondary');
                    //look through the AIS list first
                    showMoreBtn.dispatchEvent(mouseEvent);
                    const AISTable = document.querySelector('.table.table-xs.table-borderless.table-hover');
                    const AISlistElem = AISTable.firstChild;

                    let isRemainingFeeTask = false;

                    let remainingFeeMsgExists = false; 

                    function goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough){
                        //#region definition
                        //define your keywords here.
                        const keyWord1 = "finalized version";
                                        
                        const keyword2 = "petition letter";
                        
                        const keyword3 = "multiple and thorough reviews";
                    
                        const keyword4 = "EB1B";
                    
                        const pendingKeyWord = "pending";
                    
                        //helper functions
                    
                        const getPendingMsgSender = (pendingMsgBox)=>{
                            console.log("Looking for pending message sender...");
                            if(pendingMsgBox.children[0].textContent.includes(taskers.taskMaster)){
                                console.log(`msg sender: ${taskers.taskMaster}`);
                                return  taskers.taskMaster;
                            }
                            else{
                                console.log(`getPendingMsgSender: Task was done by ${taskers.nonTaskMaster}`)
                                return taskers.nonTaskMaster;
                            }
                        }
                    
                        const searchForPostedFeeMsg = ()=>{
                            let touched = false;
                            const touchedKeyWord1 =  "now that your";
                            const touchedKeyWord2 = "petition letter is finalized";
                            const touchedKeyword3 = "zelle";
                    
                            for (let i = 0; i < numberOfMsgToGoThrough; i++){
                                const msgBox = msgBoxBody.children[i];
                                if(msgBox.textContent.toLowerCase().includes(touchedKeyWord1) && msgBox.textContent.toLowerCase().includes(touchedKeyWord2) && msgBox.textContent.toLowerCase().includes(touchedKeyword3)){
                                    console.log(`found the response message.`)
                                    touched = true;
                                    return {touched, msgBox};
                                }
                            }
                    
                                return touched;
                        }
                        
                        const handleTask = (taskStatus)=>{
                            chrome.storage.local.get([localStorageKeys.taskDataBase], (result)=>{
                                if(result[localStorageKeys.taskDataBase]){
                                    const taskDataBase = result[localStorageKeys.taskDataBase];
                                    if(taskDataBase[aisNames.remFeeCollect]){
                                        const remFeeAisDB = taskDataBase[aisNames.remFeeCollect];
                                        if(remFeeAisDB[orderID]){
                                            const aisInfo = remFeeAisDB[orderID];
                                            const oldStatus = aisInfo.taskStatus;
                                            const preloadedMsg = aisInfo.message;
                                            //This should only be for available tasks.
                                            console.log(`old status: ${oldStatus}, new status: ${taskStatus}`)                    
                                            if(oldStatus !== taskStatus){                       
                                                if(taskStatus == taskStatuses.statusAvail){
                                                    if(preloadedMsg !== msgNotReady){
                                                        //update the database and send the message automatically
                                                        //CHANGE*DEFINE messageInputs somewhere prior.
                                                        sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus);
                                                        enterText(`preloadedMsg`);
                                                        //CHANGE* WE NEED TO HIT "SEND" BUTTON HERE
                                                    }
                                                    else{
                                                        //ONLY update the database of the status.
                                                        sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus);
                                                    }
                                                }
                                                else{
                                                    //ONLY update the database of the status.
                                                    sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus);
                                                }
                                            }
                                            else{
                                                console.log("Status has not changed since last update, no message sent to BG.");
                                            }
                                        }
                                        else{
                                            if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                                sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus)
                                            }
                                            else{
                                                //GENERATE THE AUTO MESSAGE INPUTS HERE.
                                                messageInputs = defaultMsgInputs;
                                                sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus, messageInputs);
                                            }
                        
                                        }
                                    }
                                    else{
                                        if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                            sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus);
                                        }
                                        else{
                                            //GENERATE THE AUTO MESSAGE INPUTS HERE.
                                            messageInputs = defaultMsgInputs;
                                            sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus, messageInputs);
                                        }
                        
                                    }
                                }
                                else{
                                    //GENERATE THE AUTO MESSAGE INPUTS HERE.
                                    messageInputs = defaultMsgInputs;
                                    if(taskStatus == taskStatuses.statusMaster || taskStatus == taskStatuses.statusUnavail){
                                        sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus);
                                    }
                                    else{
                                        sendMsgToUpdteTskDB(aisNames.remFeeCollect, orderID, taskStatus, messageInputs);
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
                        //#endregion                    
                        for (let i = 0; i < numberOfMsgToGoThrough; i++) {
                            // console.log("Looking through messages...");
                            const child = msgBoxBody.children[i];
                            //looking through the message box
                            if (child.textContent.includes(keyWord1) && child.textContent.includes(keyword2) && child.textContent.includes(keyword3)) {
                                //the message box containing all the keywords is located
                                remainingFeeMsgExists = true;
                                isRemainingFeeTask = true;
                                //EB1B scenario
                                if (child.textContent.includes(keyword4)){
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
                
                    //go through the AIS list on the page first
                    for (let i = 0; i < AISlistElem.children.length; i++){
                        //if there is a relevant ais item
                        if(AISlistElem.children[i].textContent.includes(AISKeyWord)){
                            isRemainingFeeTask = true;
                            //if it's already marked
                            if(AISlistElem.children[i].textContent.includes(AISMarkedKeyWord)){
                                handleUndoableTask();
                                return;
                            }
                            else{
                                break;
                            }
                        }
                        
                        else{
                            //code here
                            //go through the message to double check
                            goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough);
                            //if after double checking there turns out to be a message related to the task, the task will have been handled in
                            //the function above, all we gotta do now is to terminate this program.
                            if(isRemainingFeeTask){
                                return;
                            }
                            //otherwise do nothing and allow the page to be disqualified by the following code
                        }            
                    }
                
                    if(!isRemainingFeeTask){
                        console.log(`page not qualified to be "${aisNames.remFeeCollect}" task. No messages are sent to BG.`);
                        return;
                    }
                    
                    //if message was found in the AIS and not marked. We go through the messages.

                    goThroughMsgsForRemFeeCollect(numberOfMsgToGoThrough);
                
                    //edge case: no remaining fee msg was found, but somehow remaining fee is in the AIS.
                    if(!remainingFeeMsgExists){
                        handleTask(taskStatuses.statusUnavail);
                    }
                
                }, 2000) 
            }
            else{
                console.log(`${scriptNames.remFeeWatch} is not active`)
            }
        }
        else{
            console.log(`${scriptNames.remFeeWatch} is not active`)
        }
    }
    else{
        console.log(`${scriptNames.remFeeWatch} is not active`)
    }
})