chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {
    async function someFunction(){
        //code logic
        sendResponse("Hello")
    }
    someFunction();

    return true
})