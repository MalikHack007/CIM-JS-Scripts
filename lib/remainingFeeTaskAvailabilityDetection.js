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

            const updateRemFeeCollectTaskInfo = (taskStatus) => {
                // Get the key from chrome.storage.local
                chrome.storage.local.get(taskInfoLookUp, (result) => {
                  console.log("trying to update local storage...")  
                    // Retrieve the current value of the key (the object stored under taskInfoLookUp)
                  let currentTaskInfoObj = result[taskInfoLookUp];
                  let openedTasks = {};

                    // Check if the taskOpened property exists within currentTaskInfoObj
                  if (currentTaskInfoObj && currentTaskInfoObj.taskOpened) {
                        openedTasks = currentTaskInfoObj.taskOpened;
                    }
                  if (!currentTaskInfoObj) {
                    console.log("adding to the local storage...")
                    // If the key doesn't exist, initialize it as an empty object
                    currentTaskInfoObj = {
                        taskOpened: { [orderID]:orderID },
                        [orderID]: taskStatus
                    };
                    
                    const storageObject = {[taskInfoLookUp]: currentTaskInfoObj}
                    chrome.storage.local.set(storageObject, ()=>{
                        console.log(`New task(s) added: ${JSON.stringify(storageObject)}`);
                    })
                  }
                  else{
                    // Add new properties to the existing object
                    console.log(`adding to the local storage...currentTaskInfoObj: ${JSON.stringify(currentTaskInfoObj)}`);
                    const newTask = {[orderID]: orderID};
                    const newTaskStatus = {[orderID]:taskStatus};
                    console.log(`this is the newTaskStatus object: ${JSON.stringify(newTaskStatus)}`);
                    console.log(`this is the newTask object: ${JSON.stringify(newTask)}`);
                    console.log(`openedTasks:${JSON.stringify(openedTasks)}`);
                    const newOpenedTaskObj = Object.assign({}, newTask, openedTasks);
                    console.log(`newOpenedTasks:${JSON.stringify(newOpenedTaskObj)}`);
                    currentTaskInfoObj.taskOpened = newOpenedTaskObj;
                    console.log(`updated current task info obj: ${JSON.stringify(currentTaskInfoObj)}`);
                    const newTaskInfoObj = Object.assign(currentTaskInfoObj, newTaskStatus);
                    console.log(`new task info obj: ${JSON.stringify(newTaskInfoObj)}`);
                    const storageObject = {[taskInfoLookUp]: newTaskInfoObj};
                    console.log(`this is the new storage object: ${JSON.stringify(storageObject)}`);
                    chrome.storage.local.set(storageObject);
                  }
                  
                });
            };

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
            
            const handleAvailableTask = ()=>{
                console.log("Available task sent")
                chrome.runtime.sendMessage({event: 'available', orderId: orderID})
                updateRemFeeCollectTaskInfo(statusAvail);
            }
            
            const handlePendingTask = () =>{
                chrome.runtime.sendMessage({event: 'pending', orderId: orderID});
                updateRemFeeCollectTaskInfo(statusPend);
            }
            
            const handleTouchedTask = (pendingMsgBox) =>{
                const msgSender = getPendingMsgSender(pendingMsgBox);
                chrome.runtime.sendMessage ({event: 'Touched', msgSender: msgSender, orderId: orderID})
                if(msgSender!==taskMaster){
                    updateRemFeeCollectTaskInfo(statusUnavail);
                }

                else{
                    updateRemFeeCollectTaskInfo(statusMaster);
                }                
            }

            const handleUndoableTask = () => {
                chrome.runtime.sendMessage ({event: 'Undoable', orderId: orderID});
                updateRemFeeCollectTaskInfo(statusUnavail);
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
                console.log(`page not qualified to be ${taskInfoLookUp}, no further action is done.`);
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
                            console.log("Message touched");
                            handleTouchedTask(msgBox);
                            break;
                        }
                    }

                }
            };
            //if no remaining fee msg was found
            if(!remainingFeeMsgExist){
                handleUndoableTask();
            }

        }, 2000)     
    }
})









