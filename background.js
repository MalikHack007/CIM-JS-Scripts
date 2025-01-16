const taskMaster = "Malik Zhang"

const remFeeTaskLookUp = "Available Task Inquiry"

const statusAvail = "Available";
const statusPend = "Pending";
const statusMaster = `Done by ${taskMaster}`;
const statusUnavail = "Undoable";

const remFeeWatchingTask = "remFeeWatchingStatus";

const remFeeFetTask = "remFeeFetchingStatus";

const runningStatus = "Running";

const stoppedStatus = "Stopped";

const taskStatQueue = [];

const taskDiscoverySignal = "Task Detected";

let isProcessing = false;

const taskInfoLookUp = "collectRemFeeMsgTasks";

const processQueue = ()=>{
    //if there is no more message in the queue
    if(taskStatQueue.length === 0){
        isProcessing = false;
        return;
    }
    //else if there's still msg left for processing
    isProcessing = true;
    const currentTask = taskStatQueue.shift();
    /* currentMsg ==
        {
        "signal": "Task Detected",
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

//this person checks the rem fee watching run/stop status and tell rem fee watching content script whether to execute
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
//this person checks the rem fee fetching run/stop status and tell rem fee fetching content script whether to execute
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
chrome.runtime.onMessage.addListener(async (message, senderObject, sendResponse) =>{
    //wrap chrome.notifications inside of a promise, so we can wait for it to resolve. 
    async function sendAvailableNotification(){
        return new Promise ((resolve, reject)=>{
            chrome.notifications.create({
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
    async function handleAvailableTask (){
        //only the available ones that are either 1) not in the database or 2) shows as pending before.
        return new Promise ((resolve, reject)=>{
            chrome.storage.local.get([taskInfoLookUp], (result)=>{
                if(result[taskInfoLookUp]){
                    const taskInfoDB = result[taskInfoLookUp]
                    if(taskInfoDB[orderID] == statusPend || (!taskInfoDB[orderID])){
                        sendAvailableNotification()
                            .then((successMsg)=>{
                                console.log(successMsg);
                                resolve(`Handled new available task successfully ${orderID}.`)
                            })
                            .catch((errorMsg)=>{
                                console.log(errorMsg);
                                reject(`Failed to handle new available task ${orderID}`)
                            })
                    }
                }
                else{
                    sendAvailableNotification()
                        .then((successMsg)=>{
                            console.log(successMsg);
                            resolve("Handled new available task successfully.")
                        })
                        .catch((errorMsg)=>{
                            console.log(errorMsg);
                            reject("Failed to handle new available task.")
                        })
                }
            })
        }) 

    }
    
    
    async function handleUndoableTask(tabID){
        return new Promise((resolve, reject)=>{
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

    //THIS ONE DOES NOT NEED TO PROCESS SENDER INFO.
    async function handleTouchedTask (tabID, msgSender) {
        //look at if the pending msg/posted msg comes from malik zhang
        return new Promise((resolve, reject)=>{
            console.log(`Touched detected, message sender:${msgSender}`);
            if((msgSender !== taskMaster)){
                chrome.tabs.remove(tabID, ()=>{
                    if(chrome.runtime.lastError){
                        reject(`failed to remove task done by others: ${orderID}`);
                    }
                    else{
                        resolve(`removed tab ${tabID}.`);
                    }
                });
            } 
        })

  
    }
    //parse out the message

    /* 
    message === {
    signal: 'task detected',
    info:{[orderID]:"Pending"}
    }
    */
    let signal;
    let status;
    let orderID;
    if(message.signal){
        signal = message.signal;
    }  

    if(message.info){
        status = Object.values(message.info)[0];
        orderID = Object.keys(message.info)[0];
    }

    //get the tab ID of the opened tab
    const{ tab } = senderObject;
    const tabID = tab.id;

    switch(status){
        case statusAvail:
            await handleAvailableTask()
                .then((resolution)=>{
                    console.log(resolution)
                })
                .catch((rejection)=>{
                    console.log(rejection)
                })
            break;
        case statusPend:
            console.log(`task status pending:${orderID}`)
            break;
        case statusUnavail:
            console.log(`Task undoable:${orderID}`);
            await handleUndoableTask(tabID)
                .then((resolution)=>{
                    console.log(resolution);
                })
                .catch((error)=>{
                    console.log(error);
                })
            break;
        case statusMaster:
            console.log(`Touched detected ${orderID}`);
            await handleTouchedTask(tabID, msgSender)
                .then((resolution)=>{
                    console.log(resolution);
                })
                .catch((error)=>{
                    console.log(error);
                })
            break;
    }

    if(message.signal == taskDiscoverySignal){
        taskStatQueue.push(message.info);
        sendResponse(`Task ${message.info}sent to queue for storage.`);
        if(!isProcessing){
            processQueue();
        }
    }
})
//this person is responsible for storing task info in local database.


//this person reports the local storage upon loading the extension
chrome.storage.local.get(null, (result)=>{
    console.log(`${JSON.stringify(result.collectRemFeeMsgTasks)}`);
})

chrome.runtime.onMessage((message)=>{
    if (message.question == remFeeTaskLookUp){
        chrome.storage.local.get(taskInfoLookUp, (result)=>{
            let taskInfoDB;
            if(result[taskInfoLookUp]){
                taskInfoDB = result[taskInfoLookUp];
                Object.keys(taskInfoDB).forEach((orderID)=>{
                    if(taskInfoDB[orderID] == statusAvail){
                        console.log(`Available task: ${orderID} `);
                    }
                })
            }
            else{
                console.log("Nothing is in the database yet.")
            }
        
        })
    }
})




