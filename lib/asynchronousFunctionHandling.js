const taskMaster = "Malik Zhang"

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

/*
taskInfoDB == 
{
"1234":"pending",
"3456": "available",
"7890": "Undoable",
.........
} */

/* 
message === {
signal: 'task detected',
info:{[orderID]:"Pending"}
}
*/

//first Listener:
chrome.runtime.onMessage.addListener(async (message, senderObject) =>{
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

    switch(signal){
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
            await handleUndoableTask()
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
})

async function processQueue(){
    return new Promise((resolve)=>{
        if(msgQueue.length === 0){
            isProcessing = false;
            resolve()
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
    })
    //if there is no more message in the queue

}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse)=>{
    if(message.signal == taskDiscoverySignal){
        taskStatQueue.push(message.info);
        await new Promise((resolve)=>{
            sendResponse(`Task ${message.info}sent to queue for storage.`, ()=>{
                resolve(`Task sent to queue for storage: ${orderID}`);
            });
        })
            .then((resolution)=>{
                console.log(resolution);
            })
        
        if(!isProcessing){
            processQueue();
        }
    }
})



/*
Ok, so given this scenario:
I have two chrome message listeners that listens for the same message. 
The first one listens to the message, checks the local storage against the message,
and decide if it should give out a notification.

The second one listens to the message, checks the local storage against the message, 
and decide if it should update(write) the local storage.

The first one is declared before the second one in the background.js. 

If I make the first one's inside code block 100% blocking, which ensures the first listener is not done
until everything inside finishes executing, and also make sure that a queuing mechanism is set in place
for writing inside the second message listener, in the event of multiple content scripts executing (dozens),
is it guranteed that for every single content script's message I'm able to check the status of my local storage
right before their message gets updated onto my local storage? Could there be an issue where
it gets updated before I even finish reading.

*/