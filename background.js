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

const handleNewPendingTask = (orderId)=>{
    let storageObject = {}
    storageObject[orderId] = "pending"
    chrome.storage.local.set(storageObject);
    console.log(`Remaining Fee Task Pending: ${orderId}`);
}

chrome.runtime.onMessage.addListener(data =>{
    const {event, orderId} = data;
    switch(event){
        case 'available':
            chrome.storage.local.get([orderId], (result)=>{
                if((!result[orderId]) || result[orderId] == "pending"){
                    handleNewAvailableTask(orderId);
                }
            })
            break;
        case 'pending':
            chrome.storage.local.get([orderId], (result)=>{
                if(!result[orderId]){
                    handleNewPendingTask(orderId);
                }
            })
            break;
    }
})