//receive a message, send the message back
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.event == "remainingFeeCollection?"){
        chrome.storage.local.get({remainingFeeListenStatus:"Paused"}, (result)=>{
            if(result.remainingFeeListenStatus == "Listening"){
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

chrome.storage.local.get({remainingFeeListenStatus: "Paused"}, (result)=>{
    if(result.remainingFeeListenStatus == "Listening"){
        //execute content script
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
        
        chrome.runtime.onMessage.addListener((data, senderObject) =>{
            console.log(`message received: ${data}`)
            console.log(`senderObject received: ${senderObject}`)
            const {event, orderId} = data;
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
            }
            return true;
        })
    }
})





