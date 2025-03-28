//#region definitions
const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const scriptNames = {
    remFeeWatch: "Remaining Fee Task Watcher",
    remFeeFetch: "Remaining Fee Task Fetcher"
}

const aisNames = {
    remFeeCollect: "Please Post Remaining Fee Message"
}

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database"
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database.",
    enterMessage: "Enter the message.",
    remFeeTaskInit: "Initiate rem fee task completion",
    taskURLs: "taskURLs"
}

function getOrderID(){
    let orderForm = document.querySelector('#sideBarGoToOrderForm');
    let orderIDContainer = orderForm.querySelector('input');
    return orderIDContainer.value;
}
//#endregion

chrome.storage.local.get([localStorageKeys.scriptRunningStatusesDB], async (result)=>{
    if(result[localStorageKeys.scriptRunningStatusesDB]){
        const scriptRunStatusDB = result[localStorageKeys.scriptRunningStatusesDB];
        if(scriptRunStatusDB[scriptNames.remFeeFetch]){
            const status = scriptRunStatusDB[scriptNames.remFeeFetch]
            if(status == runningStatuses.runningStatus){
                //#region definitions
                const fluidAISContainer = document.querySelector('.container-fluid');
                let allViableUrls = [];
                let contentLoaded = false;
                let accumulator = 0;
                
                function collectALLViableURLs(taskKeyWord){
                    return new Promise(async (resolve)=>{
                        //#region definitions
                        const financialAisBox = document.querySelector('#aisBox7');
                        const doneKeyword = "line-through";
                        const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');
                        // allFinancialAISRows.forEach((row)=>{
                        //     console.log(row);
                        // })
                        const CSPAKeyword = "badge";
                        // const delayBetweenOpenMS = 1000;

                        // let newWindow = null;
                        
                    
                        const collectURL = (row)=>{
                            const firstChild = row.children[0];
                            const aTag = firstChild.querySelector('a');
                            accumulator += 1;
                            if(aTag){
                                allViableUrls.push(aTag.href);
                            }
                        }



                        function collectViableURL(cleanedID, AISSection, row){
                            return new Promise((resolve)=>{
                                chrome.storage.local.get([localStorageKeys.taskDataBase], (result)=>{
                                    if(result[localStorageKeys.taskDataBase]){
                                        const taskDataBase = result[localStorageKeys.taskDataBase];
                                        if(taskDataBase[aisNames.remFeeCollect]){
                                            const remFeeAisDB = taskDataBase[aisNames.remFeeCollect];
                                            if(!remFeeAisDB[cleanedID]){
                                                if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                                    collectURL(row);
                                                    resolve();
                                                }
                                            }
                                        }
                                        else{
                                            if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                                collectURL(row);
                                                resolve();
                                            }
                                        }
                                    }
                                    else{
                                        if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                            collectURL(row);
                                            resolve();
                                        }
                                    }
                                    resolve();
                                })
                            })

                        }
                        
                        function iterateOverEachAisRow(allAISRows){
                            return new Promise(async (resolve)=>{
                                for (const row of allAISRows){
                                    const orderIDContainer = row.children[0];
                                    const cleanedID = String(Number(orderIDContainer.textContent));
                                    const fourthChild = row.children[3];
                                    const AISSection = fourthChild.children[0].children[0];
                                    if(fourthChild && fourthChild.textContent.includes(taskKeyWord)){
                                        await collectViableURL(cleanedID, AISSection, row);                                   
                                    }
                                }
                                resolve();
                            })

                        }
                        //#endregion
                        
                        await iterateOverEachAisRow(allFinancialAISRows);
                        
                        console.log(`total ${taskKeyWord} task URLs collected: ${accumulator}.`);

                        resolve();
                    })
                }  
                
                const aisObserver = new MutationObserver(async (mutationsList, observer) => {
                
                    for(const mutation of mutationsList){
                        if(mutation.type === "childList"){
                            const financialAisBox = document.querySelector('#aisBox7');
                            if(financialAisBox){
                                contentLoaded = true;
                                observer.disconnect()
                                break;
                            }
                        }
                    }
                    if(contentLoaded){
                        //code goes here
                        await collectALLViableURLs("Please post remaining fee message");
                        chrome.runtime.sendMessage({
                            type: messageTypes.taskURLs, 
                            info: {
                                taskType: aisNames.remFeeCollect, 
                                URLS: allViableUrls
                            }
                        })
                    }
                })
                //#endregion
                //start observing
                aisObserver.observe(fluidAISContainer, { childList: true, subtree: true });
            }
            else{
                console.log(`${scriptNames.remFeeFetch} is not active`)
            }
        }
        else{
            console.log(`${scriptNames.remFeeFetch} is not active`)
        }
    }
    else{
        console.log(`${scriptNames.remFeeFetch} is not active`)
    }
})