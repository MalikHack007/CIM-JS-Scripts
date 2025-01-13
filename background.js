//set up listener for tab reload

// chrome.webNavigation.onCompleted.addListener((details)=>{
//     const { tabId } = details;
//     setTimeout(()=>{
//         chrome.scripting.executeScript({
//             target: { tabId },
//             files: ["lib/remainingFeeTaskAvailabilityDetection.js"]
//         })
//     }, 500)


// })
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

const handleNewEB1BTask = (tabID) =>{
    chrome.tabs.remove(tabID);
}

chrome.runtime.onMessage.addListener(data, senderObject =>{
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
        case 'EB1B':
            handleNewEB1BTask(tabID);
    }
})