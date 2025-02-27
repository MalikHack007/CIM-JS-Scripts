//#region definitions
const defaultMsgInputs = {};

const addDelay = (delay=1000)=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, delay);
    })
};

const remFeeKeySteps = {
    dummyStep: "not initiated",
    sendInvoice: "Send Invoice(s)",
    markOffAIS: "Mark off AIS"
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
    taskDataBase: "Task Database"
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
    remFeeTaskInit: "Initiate rem fee task completion"
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
const sendMsgToUpdteTskDB = ({taskType, orderID, taskStatus, messageInputs="N/A", message = "N/A", msgSent="N/A", tabID="N/A", scriptingInProgress="N/A", currentScriptingStep="N/A"} = {}) => {
    if(taskType && orderID && taskStatus){
        const unfilteredPayload = {taskType, orderID, taskStatus, messageInputs, message, msgSent, tabID, scriptingInProgress, currentScriptingStep};
        const filteredPayload = {};
        Object.keys(unfilteredPayload).forEach((key)=>{
            if(unfilteredPayload[key] !== "N/A"){
                Object.assign(filteredPayload, {[key]: unfilteredPayload[key]});
            }
        })
        console.log(`${JSON.stringify(filteredPayload)}`);
        const finalMessage = {type: messageTypes.updateTaskDB, info: filteredPayload};
        chrome.runtime.sendMessage(finalMessage);
    }
    else{
        console.log(`Need task type, order ID and taskStatus to send message to BG for update.`);
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


// see if the content script is supposed to be running
chrome.storage.local.get([localStorageKeys.scriptRunningStatusesDB],(result)=>{
    if(result[localStorageKeys.scriptRunningStatusesDB]){
        const scriptRunStatusDB = result[localStorageKeys.scriptRunningStatusesDB]
        if(scriptRunStatusDB[scriptNames.remFeeWatch]){
            const status = scriptRunStatusDB[scriptNames.remFeeWatch]
            if(status == runningStatuses.runningStatus){
                //content script actions go here.
                setTimeout(()=>{
                    //#region Definitions 2
                    //test
                    // const hitSendBtn = ()=>{
                    //     const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
                    
                    //     const event = new MouseEvent("click", {
                    //         bubbles: true,
                    //         cancelable: true,
                    //         view: window,
                    //     });
                    
                    //     // Temporarily attach the event to `window` before dispatching
                    //     Object.defineProperty(window, "event", {
                    //         value: event,
                    //         configurable: true,
                    //     });
                    
                    //     sendBtn.dispatchEvent(event);
                    // }  
                                     
                    //endTest
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
                    const btnsGroupWithShowAll = document.querySelectorAll(".btn.btn-primary.px-4");
                    let showAllBtn;
                    btnsGroupWithShowAll.forEach((btn)=>{
                        const keyword = "show all";
                        if(btn.textContent.toLowerCase().includes(keyword)){
                            showAllBtn = btn;
                        }
                    });

                    // console.log(sendMessageBtn);
                    
                    const msgBoxBody = document.querySelector('#messageBoxBody');
                
                    console.log(msgBoxBody);
                
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
                        const touchedKeyWord2 = "petition letter";
                        const touchedKeyword3 = "invoice email";
                        const touchedKeyWord4 = "finalized";
                
                        for (let i = 0; i < numberOfMsgToGoThrough; i++){
                            const msgBox = msgBoxBody.children[i];
                            if(msgBox.textContent.toLowerCase().includes(touchedKeyWord2) && msgBox.textContent.toLowerCase().includes(touchedKeyword3)&& msgBox.textContent.toLowerCase().includes(touchedKeyWord4)){
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
                    //See if scripting is in progress.
                    async function autoCompleteTask(){
                        //read into data base
                        const taskInfoDBKeyValue = await chrome.storage.local.get([localStorageKeys.taskDataBase]);
                        const taskInfoDB = taskInfoDBKeyValue[localStorageKeys.taskDataBase];
                        const remFeeDB = taskInfoDB[aisNames.remFeeCollect];
                        const targetOrderInfo = remFeeDB[orderID];
                        console.log("current order info:", JSON.stringify(targetOrderInfo));
                        //#region definitions
                        function billForAttyFeeAndFF(inputObject){
                            return new Promise(async (resolve)=>{
                            //#region essential definitions
                            const asylumFee = 300;
                        
                            const filingFee = 715;

                            const invoiceConfirmationDialogBox = document.querySelector('#chargeCustomerConfirmation');
                            const sendEmailBtn = invoiceConfirmationDialogBox.querySelector('span.btn.btn-primary');
                        
                            let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
                            chargeCustomerInput.classList.add("show");
                        
                            let chargeCommentInput = document.querySelector('#chargeCustomerComment');
                        
                            const isCaseSpecific = inputObject.isCaseSpecific;
                        
                            const isRemainingAttyFee = !inputObject.hasPaid;
                        
                            const isFFCredit = inputObject.isFilingFeeCredit;
                        
                            //#endregion
                        
                                let caseType = "";
                                let remainingAttyFee = 0;
                                let ffCredit = 0;
                            
                                //handle comment
                            
                                if(isCaseSpecific && isRemainingAttyFee){
                                    caseType = inputObject.usersCase;
                                    chargeCommentInput.value = `Remaining I-140 ${caseType} Attorney Fee, I-140 ${caseType} Filing Fee and Asylum Program Fee`;
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            
                                else if(isCaseSpecific && (!isRemainingAttyFee)){
                                    caseType = inputObject.usersCase;
                                    chargeCommentInput.value = `I-140 ${caseType} Filing Fee and Asylum Program Fee`;
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            
                                else if ((!isCaseSpecific) && isRemainingAttyFee){
                                    chargeCommentInput.value = `Remaining I-140 Attorney Fee, I-140 Filing Fee and Asylum Program Fee`;
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            
                                else{
                                    chargeCommentInput.value = "I-140 Filing Fee and Asylum Program Fee";
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                };
                            
                                //handle amount to charge
                            
                                if(isRemainingAttyFee && isFFCredit){
                                    remainingAttyFee = Number(inputObject.remainingAttorneyFee);
                                    ffCredit = Number(inputObject.filingFeeCredit);
                                    const amountToCharge = remainingAttyFee + filingFee + asylumFee - ffCredit;
                                    const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
                                    amountToChargeInput.value = String(amountToCharge);
                                    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                                else if(isRemainingAttyFee && !isFFCredit){
                                    remainingAttyFee = Number(inputObject.remainingAttorneyFee);
                                    const amountToCharge = remainingAttyFee + filingFee + asylumFee - ffCredit;
                                    const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
                                    amountToChargeInput.value = String(amountToCharge);
                                    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            
                                else if(!isRemainingAttyFee && isFFCredit){
                                    ffCredit = Number(inputObject.filingFeeCredit);
                                    const amountToCharge = filingFee + asylumFee - ffCredit;
                                    const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
                                    amountToChargeInput.value = String(amountToCharge);
                                    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                                else{
                                    const amountToCharge = filingFee + asylumFee;
                                    const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
                                    amountToChargeInput.value = String(amountToCharge);
                                    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                };
                            
                                //click charge button
                                let chargeButton = document.querySelector('[data-v-38146dfa][type="button"]');
                                chargeButton.click();
                                await addDelay(800);
                                sendEmailBtn.click();
                                resolve("Filing Fee Invoice sent successfully!");
                            })
                                
                        }
                        function billForPP(inputObject){
                            return new Promise(async (resolve)=>{
                                const ppFee = 2805;
                        
                                const invoiceConfirmationDialogBox = document.querySelector('#chargeCustomerConfirmation');
                                const sendEmailBtn = invoiceConfirmationDialogBox.querySelector('span.btn.btn-primary');
                            
                                let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
                                chargeCustomerInput.classList.add("show");
                            
                                let amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
                                amountToChargeInput.value = String(ppFee);
                                amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
                                amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
                            
                                let chargeCommentInput = document.querySelector('#chargeCustomerComment');
                                // const hasFiledPPWithUsInput = prompt("Have they filed PP with us on another case before?(Y/N)").toLowerCase();
                                const hasFiledAnotherPP = inputObject.ppSpecific
                                let ppCaseType = "";
                                if(hasFiledAnotherPP){
                                    ppCaseType = inputObject.usersCase;
                                    chargeCommentInput.value = `I-140 ${ppCaseType} Premium Processing Fee`;
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            
                                else{
                                    chargeCommentInput.value = `Premium Processing Fee`;
                                    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
                                    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
                                };
                            
                                let chargeButton = document.querySelector('[data-v-38146dfa][type="button"]');
                                chargeButton.click();
                            
                                await addDelay(800);
                                sendEmailBtn.click();
                                resolve("PP Invoice sent successfully!");
                            })
                        }

                        function addSpecialNote (note, delay=1000){
                            return new Promise(async (resolve)=>{
                                const editSpecialNoteBtn = document.querySelector("button.btn.btn-sm.ml-1.p-0.border-0[type='button']");
                                console.log(editSpecialNoteBtn);
                                editSpecialNoteBtn.click();
                            
                                await addDelay(delay);
                            
                                const textAreaForm = document.querySelector('textarea[name="note_special"]');
                                textAreaForm.value += `\n\n${note}`;
                                textAreaForm.dispatchEvent(new Event("input", { bubbles: true }));
                                // console.log(textAreaForm.value);
                                // specialNoteForm.submit();
                            
                                await addDelay(delay);
                            
                                const updateSpecialNoteBtn = document.querySelector("button[type='submit']");
                                // console.log(updateSpecialNoteBtn);
                                updateSpecialNoteBtn.click();
                                resolve("Successfully added special note!");
                            })
                        };
                        
                        //produce date in the format of yyyy-mm-dd
                        
                        const getDateISO8601 = ()=>{
                        const now = new Date();
                        
                        const year = now.getFullYear();
                        const month = String(now.getMonth()+1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const ISO8601Date = `${year}-${month}-${day}`;
                        
                        return ISO8601Date;
                        };
                        
                        function postNIWPPWarning (){
                            return new Promise(async (resolve)=>{
                                const currentDate = getDateISO8601();
                                await addSpecialNote(`<font color="red">${currentDate} NIW PP warning msg posted</font>`, 1);
                                resolve();
                            })
                        };
                        
                        function postEB1APPWarning (){
                            return new Promise(async(resolve)=>{
                                const currentDate = getDateISO8601();
                                await addSpecialNote(`<font color="red">${currentDate} EB1A PP warning msg posted</font>`, 1);
                                resolve();
                            })

                        };
                        function approveMostRecentMsg(){
                            const targetMsgBox = document.querySelector("#messageBox0");
                            // console.log(targetMsgBox);
                            
                            const msgButtons = targetMsgBox.querySelectorAll("button.btn.btn-primary.btn-sm.mr-1.mb-1");
                            
                            // msgButtons.forEach((btn)=>{
                            //   console.log(btn);
                            // })
                            
                            let approvalBtn;
                            
                            msgButtons.forEach((btn)=>{
                            if(btn.textContent.includes("Approve")){
                                approvalBtn = btn;
                            }
                            });
                            
                            console.log(approvalBtn);
                            // window.alert = function() {}; 
                            // window.confirm = function() { return true; }; 
                            // window.prompt = function() { return ""; };
                            
                            approvalBtn.click();
                        }

                        function markOffRemainingFeeAIS(){
                            const AISTable = document.querySelector("table.table.table-xs.table-borderless.table-hover");
                        
                            const AISRows = AISTable.querySelectorAll("tr");
                            
                            let remFeeRow;
                            
                            AISRows.forEach((tr)=>{
                            if(tr.textContent.includes("Please post remaining fee")){
                                remFeeRow = tr;
                            }
                            });
                            
                            // console.log(remFeeRow);
                            if(remFeeRow){
                                const AISActionBox = remFeeRow.querySelector("td.text-nowrap.text-right");
                            
                                // console.log(AISActionBox);
                                
                                const checkBox = AISActionBox.querySelector("span.img-icon.iicon-checkbox");
                                
                                // console.log(checkBox);
                                
                                checkBox.click();
                            }

                        }

                        const updateCaseToPreFiling = async (caseType, delay)=>{

                            const caseBoxes = document.querySelectorAll('div.hover-show-icon.hover-show-icon-right.hover-light.hover-show-box.orderCaseBox');
                        
                            let targetCaseBox;
                        
                            caseBoxes.forEach((caseBox)=>{
                            if(caseBox.textContent.includes(caseType)){
                                targetCaseBox = caseBox;
                            }
                            });
                        
                            // console.log(targetCaseBox);
                        
                            const editBtn = targetCaseBox.querySelector('span.mr-1.img-icon.iicon-edit');
                        
                            // console.log(editBtn);
                            
                            editBtn.click();
                            
                            // console.log(caseStatusSelectMenu);
                        
                            await addDelay(delay);
                        
                            const caseStatusSelectMenu = document.querySelector('select[name="case_status"]');
                            caseStatusSelectMenu.selectedIndex = 2;
                        
                            await addDelay(delay);
                        
                            const caseUpdateForm = document.querySelector('form[action="https://northcms.wenzo.com/order/add-update-order-case"]');
                            
                            // console.log(caseUpdateForm);
                            
                            caseUpdateForm.submit();
                        
                        };
                        
                        const updateNIWToPrefile = ()=>{
                            updateCaseToPreFiling("NIW", 1);
                        };
                        
                        const updateEB1AToPrefile = ()=>{
                            updateCaseToPreFiling("EB1A", 1);
                        };
                        //#endregion
                        //send a message to background to have the window's alerts removed, also, update the scripting data to the next step
                        await chrome.runtime.sendMessage({ 
                            type: messageTypes.updateTaskDB, 
                            info: { taskType: aisNames.remFeeCollect, orderID, scriptingInProgress: false, action: actions.removeAlertsFromWindow }
                        })
                        if (targetOrderInfo.scriptingInProgress){
                            //send invoices
                            if(targetOrderInfo.messageInputs.isPp){
                                //send two invoices
                                await billForAttyFeeAndFF(targetOrderInfo.messageInputs);
                                await addDelay();
                                await billForPP(targetOrderInfo.messageInputs);
                                //add special note depending on NIW vs EB1A
                                if(!targetOrderInfo.messageInputs.ppInfoIsProvided){
                                    await addDelay();
                                    if(targetOrderInfo.messageInputs.usersCase == "NIW"){
                                        await postNIWPPWarning();
                                    }
                                    else if(targetOrderInfo.messageInputs.usersCase == "EB1A"){
                                        await postEB1APPWarning();
                                    }
                                }

                            }
                            else{
                                //simply send the invoice
                                await billForAttyFeeAndFF(targetOrderInfo.messageInputs);
                            }
                            await addDelay();
                            approveMostRecentMsg();
                            await addDelay();
                            markOffRemainingFeeAIS();
                            await addDelay();
                            if(targetOrderInfo.messageInputs.usersCase == "NIW"){
                                updateNIWToPrefile();
                            }
                            else if(targetOrderInfo.messageInputs.usersCase == "EB1A"){
                                updateEB1AToPrefile();
                            }
                        }
                    }
                    autoCompleteTask();
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
                            info: { taskType: aisNames.remFeeCollect, orderID, action: actions.sendMessage }
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
                            // console.log('event dispatched.');
                        })
                    }
                })
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


