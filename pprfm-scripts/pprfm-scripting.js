let requiredSubModules = {};

async function dependenciesReady(){
    const pathToCustomUtilFuncs = chrome.runtime.getURL('lib/UTILITIES/custom-utils.js');
    const pathToTaskBrowserActionFuncs = chrome.runtime.getURL('lib/UTILITIES/pprfm-browser-action/pprfm-browser-scripts.js');
    const pathToSharedObjects = chrome.runtime.getURL('lib/shared-objects.js');
    const pathToBrowserActionFuncs = chrome.runtime.getURL('lib/UTILITIES/browser-actions.js');
    const customUtilFuncs = await import(pathToCustomUtilFuncs);
    const taskBrowserActionFuncs = await import(pathToTaskBrowserActionFuncs);
    const sharedObjects = await import(pathToSharedObjects);
    const browserActionFuncs = await import(pathToBrowserActionFuncs);
    requiredSubModules = { customUtilFuncs, taskBrowserActionFuncs, sharedObjects, browserActionFuncs };
}

export async function autoCompleteTask(orderID){

    await dependenciesReady();
    //object destructuring syntax for easy reference
    const {
            localStorageKeys,
            aisNames,
            taskers,
            remainingFeeMsgKeywords,
            messageTypes,
            remFeeKeySteps,
            actions,
            caseTypes,
            caseStages
          } = requiredSubModules.sharedObjects;
    
    const {
            getMsgSender,
            addDelay
          } = requiredSubModules.customUtilFuncs;
    
    const {
            billForAttyFeeAndFF,
            billForPP,
            postPPWarning
          } = requiredSubModules.taskBrowserActionFuncs;

    const {
            approveMostRecentMsg,
            markOffAIS,
            updateCaseStage,
            enterText
          } = requiredSubModules.browserActionFuncs;


    //read into data base
    const taskInfoDBKeyValue = await chrome.storage.local.get(localStorageKeys.taskDataBase);

    let targetOrderInfo;

    if(taskInfoDBKeyValue){
        targetOrderInfo = taskInfoDBKeyValue?.[localStorageKeys.taskDataBase]?.[aisNames.remFeeCollect]?.[orderID];
        if(!targetOrderInfo){
            return;
        }
    }
    else{
        return;
    }

    const taskInputs = targetOrderInfo.messageInputs;
    
    //#region BETA FEATURE: Avoiding Collision with Others
    const msgBoxBody = document.querySelector('#messageBoxBody');
    const latestMsgBox = msgBoxBody.children[0];
    const latestMsgSender = getMsgSender(latestMsgBox, taskers);
    //IF the latest message is posted by me
    if(latestMsgSender == taskers.taskMaster){
        //If someone else has already posted a similar message
        //below, terminate the scripting process
        const secondToLatestMsgBox = msgBoxBody.children[1];
        const secondToLatestMsgSender = getMsgSender(secondToLatestMsgBox, taskers);
        if(secondToLatestMsgSender != taskers.taskMaster && secondToLatestMsgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyWord2) && secondToLatestMsgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyword3)&& secondToLatestMsgBox.textContent.toLowerCase().includes(remainingFeeMsgKeywords.touchedKeyWord4)){

            //send a message to update the scripting in progress to false, and then terminate the scripting
            await chrome.runtime.sendMessage(
                {
                    type: messageTypes.updateTaskDB,
                    info:{
                        taskType: aisNames.remFeeCollect,
                        orderID,
                        scriptingInProgress: false
                    }
                }
            )
            console.log("Message by other found, aborted the scripting process.")
            return; 

            //Send Message To Background so it gives a notification that this task has been taken,
            //Put the tab in a separate group that's just for "failed to execute."



        }
        //If not, continue with the scripting process by doing nothing 
        //and allowing the program to continue. 
        console.log("Message by others not found, continuing the scripting process.")
    }
    //IF the latest message IS NOT posted by me:
    else{
        //Terminate the scripting process and update the scriptingInProgress to false. 
        await chrome.runtime.sendMessage(
            {
                type: messageTypes.updateTaskDB,
                info:{
                    taskType: aisNames.remFeeCollect,
                    orderID,
                    scriptingInProgress: false
                }
            }
        )
        console.log("Latest message is not posted by task master, scripting aborted.")

        return; 
    }
    //#endregion

    if(targetOrderInfo.currentScriptingStep == remFeeKeySteps.dummyStep){
        //send a message to background to have the window's alerts removed, also, update the scripting data to the next step
        
        await chrome.runtime.sendMessage({ 
            type: messageTypes.updateTaskDB, 
            info: { taskType: aisNames.remFeeCollect, orderID, scriptingInProgress: false, action: actions.removeAlertsFromWindow }
        })
        //send invoices
        if(taskInputs.isPp){
            //send two invoices
            await billForAttyFeeAndFF(taskInputs);
            await addDelay();
            await billForPP(taskInputs);
            //add special note depending on NIW vs EB1A
            //TODO: Fix this logic
            if((!taskInputs.ppInfoIsProvided) ||(taskInputs.ppInfoIsProvided && taskInputs.oldPpInfo)){
                await addDelay();
                await postPPWarning(taskInputs.usersCase);
            }

        }
        else{
            //simply send the invoice
            await taskBrowserActionFuncs.billForAttyFeeAndFF(targetOrderInfo.messageInputs);
        }
        await addDelay();
        await approveMostRecentMsg();
        await addDelay();
        await markOffAIS(aisNames.remFeeCollect);
        await addDelay();
        //TODO
        const NIW = caseTypes.NIW;
        const EB1A = caseTypes.EB1A;
        const prefilingStage = caseStages["Pre-filing"];

        if(taskInputs.usersCase ==  NIW ){
            await updateCaseStage(NIW, 1, prefilingStage);
        }
        else if(taskInputs.usersCase == EB1A){
            await updateCaseStage(EB1A, 1, prefilingStage);
        }
    }
    else if(targetOrderInfo.currentScriptingStep == remFeeKeySteps.sendPPWarning){
        //send a message to background to have the window's alerts removed, also, update the scripting data to the next step
        await chrome.runtime.sendMessage({ 
            type: messageTypes.updateTaskDB, 
            info: { taskType: aisNames.remFeeCollect, orderID, currentScriptingStep: remFeeKeySteps.dummyStep, action: actions.removeAlertsFromWindow }
        });

        await approveMostRecentMsg();
        //get the pp warning message of the order
        const result = await chrome.storage.local.get(localStorageKeys.taskDataBase);

        const ppWarningMessage = result?.[localStorageKeys.taskDataBase]?.[aisNames.remFeeCollect]?.[orderID]?.['message']?.ppWarning;

        if(ppWarningMessage){
            enterText(ppWarningMessage);
            await chrome.runtime.sendMessage({ 
                type: messageTypes.updateTaskDB, 
                info: { taskType: aisNames.remFeeCollect, 
                        orderID, 
                        action: actions.sendMessage 
                        }
            })

            const sendBtn = document.querySelector('input.btn.btn-secondary.mb-1.ml-1');
            // console.log("content script, btn selected:", sendBtn);
            const event = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            
            sendBtn.dispatchEvent(event);

        }
        else{
            //TODO: When there isn't a pp warning message generated, it should just proceed to regular steps.
            console.log("ERROR: CANNOT READ PP WARNING MESSAGE")
        }


    }


}