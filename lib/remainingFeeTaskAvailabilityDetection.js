//ask the service worker if it's ok to execute
chrome.runtime.sendMessage({event:"remainingFeeCollection?"}, (answer)=>{
    console.log(`answer received: ${answer}`);
    if(answer){
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
        
            const AISKeyWord = "Please pose remaining fee message";
        
            const AISMarkedKeyWord = "marked";
        
            const orderID = getOrderID();
            
            const pendingKeyWord = "pending";

            const taskMaster = "Malik Zhang"

            const nonTaskMaster = "others"
            
            const numberOfMsgToGoThrough = 20;

            const getPendingMsgSender = (pendingMsgBox)=>{
                if(pendingMsgBox.children[0].textContent.includes(taskMaster)){
                    return  taskMaster;
                }
                else{
                    return nonTaskMaster;
                }
            }
        
            const searchForPostedFeeMsg = ()=>{
                let touched = false;
                const touchedKeyWord1 =  "Now that your";
                const touchedKeyWord2 = "petition letter is finalized";
                const touchedKeyword3 = "Zelle";
        
                for (let i = 0; i < numberOfMsgToGoThrough; i++){
                    const msgBox = msgBoxBody.children[i];
                    if(msgBox.textContent.includes(touchedKeyWord1) && msgBox.textContent.includes(touchedKeyWord2) && msgBox.textContent.includes(touchedKeyword3)){
                        touched = true;
                        return {touched, msgBox};
                    }
                }
        
                return touched;
            }
            
            const sendAvailableTask = ()=>{
                console.log("Available task sent")
                chrome.runtime.sendMessage({event: 'available', orderId: orderID})
            }
            
            const sendPendingTask = () =>{
                console.log("pending task sent")
                chrome.runtime.sendMessage({event: 'pending', orderId: orderID})
            }
            
            const sendTouchedTask = (pendingMsgBox) =>{
                chrome.runtime.sendMessage ({event: 'Touched', msgSender: getPendingMsgSender(pendingMsgBox), orderId: orderID})
            }

            const sendUndoableTask = () => {
                chrome.runtime.sendMessage ({event: 'Undoable', orderId: orderID});
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
            const showMoreBtn = document.querySelector('.btn.btn-sm.btn-outline-secondary');
            //look through the AIS list first
            console.log(showMoreBtn)
            // if(showMoreBtn.dispatchEvent(mouseEvent));
            showMoreBtn.dispatchEvent(mouseEvent);
            console.log("clicked");
            const AISTable = document.querySelector('.table.table-xs.table-borderless.table-hover');
            console.log(AISTable);
            const AISlistElem = AISTable.firstChild;
            Array.from(AISlistElem.children).forEach((child)=>{
                console.log("Going through AIS list...");
                //first find the Task
                if(child.textContent.includes(AISKeyWord) && child.textContent.includes(AISMarkedKeyWord)){
                    console.log("Task not qualified");
                    sendUndoableTask();
                    return;
                }
            })
            //looking through the message box
            for (let i = 0; i < numberOfMsgToGoThrough; i++) {
                console.log("entered into for loop");
                const child = msgBoxBody.children[i];
                //filter each msgBox for the PL finalized message
                if (child.textContent.includes(keyWord1) && child.textContent.includes(keyword2) && child.textContent.includes(keyword3)) {
                    //EB1B scenario
                    if (child.textContent.includes(keyword4)){
                        sendUndoableTask();
                        break;
                    }
                    //pending message
                    else if (child.classList.contains(pendingKeyWord)) {
                        sendPendingTask();
                        break;
                    }
                    
                    //if available
                    else{
                        const { touched, msgBox } = searchForPostedFeeMsg();
                        //available & untouched
                        if ((!touched)){
                            console.log("qualified the message");
                            sendAvailableTask();
                            break;
                        }
                        //available & touched
                        else{
                            console.log("Message touched");
                            sendTouchedTask(msgBox);
                            break;
                        }
                    }

                }
            };



        }, 2000)     
    }
})









