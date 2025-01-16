//ask the service worker if it's ok to execute
chrome.runtime.sendMessage({event:"remainingFeeCollection?"}, (answer)=>{
    console.log(`remainingTaskWatchingPermission: ${answer}`);
    if(answer){
        function getOrderID(){
            let orderForm = document.querySelector('#sideBarGoToOrderForm');
            let orderIDContainer = orderForm.querySelector('input');
            return orderIDContainer.value;
        }
      
        setTimeout(()=>{
            const pendingKeyWord = "pending";

            const taskDiscoverySignal = "Task Detected";

            const taskMaster = "Malik Zhang"

            const nonTaskMaster = "others"

            const taskInfoLookUp = "collectRemFeeMsgTasks";
            const statusAvail = "Available";
            const statusPend = "Pending";
            const statusMaster = `Done by ${taskMaster}`;
            const statusUnavail = "Undoable";

            const msgBoxBody = document.querySelector('#messageBoxBody');
        
            console.log(msgBoxBody);
            
            const keyWord1 = "finalized version";
            
            const keyword2 = "petition letter";
            
            const keyword3 = "multiple and thorough reviews";
        
            const keyword4 = "EB1B";

            let remainingFeeMsgExist = false;

            let isRemainingFeeTask = false;
        
            const AISKeyWord = "Please post remaining fee message";
        
            const AISMarkedKeyWord = "marked";
        
            const orderID = getOrderID();
            
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

            /* 
            message === {
            signal: 'task detected',
            info:{[orderID]:"Pending"}
            }
            */
            
            const handleAvailableTask = ()=>{
                chrome.runtime.sendMessage({
                    signal: taskDiscoverySignal,
                    info:{[orderID]:statusAvail}
                })
            }
            
            const handlePendingTask = () =>{

                chrome.runtime.sendMessage({
                    signal: taskDiscoverySignal,
                    info: {[orderID]:statusPend}
                });
            }
            
            const handleTouchedTask = (pendingMsgBox) =>{
                const msgSender = getPendingMsgSender(pendingMsgBox);

                handleUndoableTask(msgSender);              
            }

            const handleUndoableTask = (msgSender) => {
                if(msgSender){
                    if(msgSender == taskMaster){
                        chrome.runtime.sendMessage ({
                                signal: taskDiscoverySignal, 
                                info: {[orderID]:statusMaster},
                                sender: msgSender
                        })

                    }
                    else{
                        chrome.runtime.sendMessage ({
                            signal: taskDiscoverySignal, 
                            info: {[orderID]:statusUnavail},
                            sender: msgSender
                        });
                    }

                }
                else{
                    chrome.runtime.sendMessage ({
                        signal: taskDiscoverySignal, 
                        info: {[orderID]:statusUnavail}
                    });
                }

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
            showMoreBtn.dispatchEvent(mouseEvent);
            const AISTable = document.querySelector('.table.table-xs.table-borderless.table-hover');
            const AISlistElem = AISTable.firstChild;
            for (let i = 0; i < AISlistElem.children.length; i++){
                if(AISlistElem.children[i].textContent.includes(AISKeyWord)){
                    isRemainingFeeTask = true;
                    if(AISlistElem.children[i].textContent.includes(AISMarkedKeyWord)){
                        handleUndoableTask();
                        return;
                    }
                    
                }             
            }
            if(!isRemainingFeeTask){
                console.log(`page not qualified to be ${taskInfoLookUp}, no messages regarding ${taskInfoLookUp} were sent.`);
                return;
            }

            //looking through the message box
            for (let i = 0; i < numberOfMsgToGoThrough; i++) {
                console.log("Looking through messages...");
                const child = msgBoxBody.children[i];
                //filter each msgBox for the PL finalized message
                if (child.textContent.includes(keyWord1) && child.textContent.includes(keyword2) && child.textContent.includes(keyword3)) {
                    remainingFeeMsgExist = true;
                    //EB1B scenario
                    if (child.textContent.includes(keyword4)){
                        handleUndoableTask();
                        break;
                    }
                    //pending message
                    else if (child.classList.contains(pendingKeyWord)) {
                        handlePendingTask();
                        break;
                    }
                    
                    //if available
                    else{
                        const { touched, msgBox } = searchForPostedFeeMsg();
                        //available & untouched
                        if ((!touched)){
                            console.log("qualified the message");
                            handleAvailableTask();
                            break;
                        }
                        //available & touched
                        else{
                            console.log(`Message touched by ${nonTaskMaster}`);
                            handleTouchedTask(msgBox);
                            break;
                        }
                    }

                }
            };
            //edge case: no remaining fee msg was found, but somehow remaining fee is in the AIS.
            if(!remainingFeeMsgExist){
                handleUndoableTask();
            }

        }, 2000)     
    }
})









