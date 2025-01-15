const taskMaster = "Malik Zhang"

const remFeeWatchingTask = "remFeeWatchingStatus";

const remFeeFetTask = "remFeeFetchingStatus";

const runningStatus = "Running";

const stoppedStatus = "Stopped";

//this person checks the rem fee watching task status and tell rem fee watching content script whether to execute
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.event == "remainingFeeCollection?"){
        chrome.storage.local.get({[remFeeWatchingTask]:stoppedStatus}, (result)=>{
            if(result[remFeeWatchingTask] == runningStatus){
                sendResponse(true);
            }
            else{
                sendResponse(false);
            }
        })
    }
    //keep the channel open
    return true
})
//this person checks the rem fee fetching task status and tell rem fee fetching content script whether to execute
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.event == "remFeeFetchingTask?"){
        chrome.storage.local.get({[remFeeFetTask]:stoppedStatus}, (result)=>{
            if(result[remFeeFetTask] == runningStatus){
                sendResponse(true);
            }
            else{
                sendResponse(false);
            }
        })
    }
    //keep the channel open
    return true
})

//set up listener for task viability messages

//execute content script

//this person needs to notify me when a new available task appears.
chrome.runtime.onMessage.addListener((data, senderObject) =>{
    // console.log(`message received: ${data}`)
    // console.log(`senderObject received: ${senderObject}`)
    const handleNewAvailableTask = (orderId)=>{
        chrome.storage.local.get([orderId], (result)=>{
            if((!result[orderId]) || result[orderId] == "pending"){
                let storageObject = {}
                storageObject[orderId] = "available"
                chrome.storage.local.set(storageObject);
                console.log(`Remaining Fee Task Available: ${orderId}`);
                chrome.notifications.create({
                    title: "New Collect Remaining Fees Task Available",
                    message: `Order ID: ${orderId}`,
                    iconUrl:"images/icon-48.png",
                    type: "basic"
                })
            }
        })
    
    }
    
    const handleNewPendingTask = (orderId)=>{
        chrome.storage.local.get([orderId], (result)=>{
            if(!result[orderId]){
                let storageObject = {}
                storageObject[orderId] = "pending"
                chrome.storage.local.set(storageObject);
                console.log(`Remaining Fee Task Pending: ${orderId}`);
            }
        })
    }
    
    const handleUndoableTask = (tabID) =>{
        chrome.tabs.remove(tabID);
    }


    const handleTouchedTask = (tabID, msgSender) =>{
        //look at if the pending msg/posted msg comes from malik zhang
        console.log(`Touched detected, message sender:${msgSender}`);
        if((msgSender !== taskMaster)){
            chrome.tabs.remove(tabID);
            console.log(`removed tab ${tabID}.`);
        }   
    }
    let event = "N/A";
    let orderId = "N/A";
    let msgSender = "N/A";

    if(data.msgSender){
        ({event, msgSender, orderId} = data);
    }
    else{
        ({event, orderId} = data);
    }
    //get the tab ID of the opened tab
    const{ tab } = senderObject;
    const tabID = tab.id;
    switch(event){
        case 'available':
            handleNewAvailableTask(orderId);
            break;
        case 'pending':
            handleNewPendingTask(orderId);
            break;
        case 'Undoable':
            console.log(`Undoable detected:${orderId}`);
            handleUndoableTask(tabID);
            break;
        case 'Touched':
            console.log(`Touched detected ${orderId}`);
            handleTouchedTask(tabID, msgSender);
    }
    return true;
})


chrome.storage.local.get(null, (result)=>{
    console.log(`${JSON.stringify(result.collectRemFeeMsgTasks)}`);
})


