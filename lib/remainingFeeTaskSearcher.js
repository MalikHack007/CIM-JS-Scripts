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

function getOrderID(){
    let orderForm = document.querySelector('#sideBarGoToOrderForm');
    let orderIDContainer = orderForm.querySelector('input');
    return orderIDContainer.value;
}
//#endregion

chrome.storage.local.get([localStorageKeys.scriptRunningStatusesDB],(result)=>{
    if(result[localStorageKeys.scriptRunningStatusesDB]){
        const scriptRunStatusDB = result[localStorageKeys.scriptRunningStatusesDB];
        if(scriptRunStatusDB[scriptNames.remFeeFetch]){
            const status = scriptRunStatusDB[scriptNames.remFeeFetch]
            if(status == runningStatuses.runningStatus){
                //#region definitions
                const fluidAISContainer = document.querySelector('.container-fluid');

                let contentLoaded = false;
                let accumulator = 0;
                
                async function openTasks(taskKeyWord){
                    //#region definitions
                    const financialAisBox = document.querySelector('#aisBox7');
                    const doneKeyword = "line-through";
                    const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');
                    // allFinancialAISRows.forEach((row)=>{
                    //     console.log(row);
                    // })
                    const CSPAKeyword = "badge";
                    const delayBetweenOpenMS = 1000;

                    let newWindow = null;
                    
                
                    const openInNewTab = (row)=>{
                        const firstChild = row.children[0];
                        const aTag = firstChild.querySelector('a');
                        accumulator += 1;
                        if(aTag){
                            if(!newWindow){
                                // console.log("Attempted to open a new tab.");
                                newWindow = window.open(aTag.href, "_blank");
                            }
                            else{
                                // console.log("Attempted to open a new tab.");
                                newWindow.open(aTag.href, '_blank');
                            }
                        }
                    }

                    function delay(ms){
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
                    
                    async function iterateOverEachAisRow(allAISRows){
                        function openUnopenedTaskWithDelay(cleanedID, AISSection, row){
                            return new Promise((resolve)=>{
                                chrome.storage.local.get([localStorageKeys.taskDataBase], async (result)=>{
                                    if(result[localStorageKeys.taskDataBase]){
                                        const taskDataBase = result[localStorageKeys.taskDataBase];
                                        if(taskDataBase[aisNames.remFeeCollect]){
                                            const remFeeAisDB = taskDataBase[aisNames.remFeeCollect];
                                            if(remFeeAisDB[cleanedID]){
                                                console.log(`Task already opened before:${cleanedID}`);
                                                resolve();
                                            }
                                            else{
                                                if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                                    openInNewTab(row);
                                                    await delay(delayBetweenOpenMS);
                                                    resolve();
                                                }
                                                else{
                                                    resolve();
                                                }
                                            }
                                        }
                                        else{
                                            if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                                openInNewTab(row);
                                                await delay(delayBetweenOpenMS);
                                                resolve();
                                            }
                                            else{
                                                resolve();
                                            }
                                        }
                                    }
                                    else{
                                        if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                            openInNewTab(row);
                                            await delay(delayBetweenOpenMS);
                                            resolve();
                                        }
                                        else{
                                            resolve();
                                        }
                                    }
                                })
                            })
                        }
                        for (const row of allAISRows){
                            const orderIDContainer = row.children[0];
                            const cleanedID = String(Number(orderIDContainer.textContent));
                            const fourthChild = row.children[3];
                            const AISSection = fourthChild.children[0].children[0];
                            if(fourthChild && fourthChild.textContent.includes(taskKeyWord)){
                                //skip this whole thing if order ID is already in my local storage.
                                //chrome.storage.local DOES NOT support await.
                                await openUnopenedTaskWithDelay(cleanedID, AISSection, row);                                                
                            }
                        }
                    }
                    //#endregion
                    
                    await iterateOverEachAisRow(allFinancialAISRows);
                
                    console.log(`total ${taskKeyWord} tasks opened: ${accumulator}.`);
                
                
                }  
                
                const aisObserver = new MutationObserver((mutationsList, observer) => {
                
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
                        openTasks("Please post remaining fee message");
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