function getOrderID(){
        let orderForm = document.querySelector('#sideBarGoToOrderForm');
        let orderIDContainer = orderForm.querySelector('input');
        return orderIDContainer.value;
}
  
setTimeout(()=>{
    const msgBoxBody = document.querySelector('#messageBoxBody');

    console.log(msgBoxBody);
    
    const keyWord1 = "finalized version";
    
    const keyword2 = "petition letter";
    
    const keyword3 = "multiple and thorough reviews";

    const keyword4 = "EB1B";

    const orderID = getOrderID();
    
    const pendingKeyWord = "pending";
    
    const numberOfMsgToGoThrough = 20;

    const searchForPostedFeeMsg = ()=>{
        let touched = false;
        const touchedKeyWord1 =  "Now that your";
        const touchedKeyWord2 = "petition letter is finalized";
        const touchedKeyword3 = "Zelle";

        for (let i = 0; i < numberOfMsgToGoThrough; i++){
            const msgBox = msgBoxBody.children[i];
            if(msgBox.textContent.includes(touchedKeyWord1) && msgBox.textContent.includes(touchedKeyWord2) && msgBox.textContent.includes(touchedKeyword3)){
                touched = true;
                return touched;
            }
        }

        return touched;
    }
    
    const sendAvailableTask = (orderID)=>{
        console.log("Available task sent")
        chrome.runtime.sendMessage({event: 'available', orderId: orderID})
    }
    
    const sendPendingTask = (orderID) =>{
        console.log("pending task sent")
        chrome.runtime.sendMessage({event: 'pending', orderId: orderID})
    }
    
    const sendUndoableTask = (orderID) =>{
        chrome.runtime.sendMessage ({event: 'Undoable', orderId: orderID})
    }

    
    for (let i = 0; i < numberOfMsgToGoThrough; i++) {
        console.log("entered into for loop");
        const child = msgBoxBody.children[i];
        //Go through the AIS list on the page to see if the fee task has actually been marked.
        //filter each msgBox for the PL finalized message
        if (child.textContent.includes(keyWord1) && child.textContent.includes(keyword2) && child.textContent.includes(keyword3)) {
            //EB1B scenario
            if (child.textContent.includes(keyword4)){
                sendUndoableTask(orderID);
                break;
            }
            //pending message
            else if (child.classList.contains(pendingKeyWord)) {
                sendPendingTask(orderID);
                break;
            }
            //available & untouched
            else if ((!searchForPostedFeeMsg())){
                console.log("qualified the message");
                sendAvailableTask(orderID);
                break;
            }
            //available & touched
            else{
                sendUndoableTask(orderID);
                break;
            }
        }
    };
}, 500)





// }



