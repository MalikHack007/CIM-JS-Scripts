//#region Definitions
const documentBody = document.querySelector('body');

const taskColumnParent = document.getElementById('taskStatusCols');

const taskStatusPage = document.querySelector('#TaskStatusInfo');

const clearLocalBtn = document.getElementById('clearLocal');

const remainingFeeStopBtn = document.getElementById('remainingFeeStop');

const remainingFeeStartBtn = document.getElementById('remainingFeeStart');

const remFeeFetStartBtn = document.getElementById('taskFetcherStart');

const remFeeFetStopBtn = document.getElementById('taskFetcherStop');

const availTaskBtn = document.getElementById('availTaskInquiry');

const taskListTab = document.getElementById('taskList')

const controlsTab = document.getElementById('controls');

const controlPanel = document.getElementById('controlPanel')

const openFormTab = document.getElementById('openFormTab');

const formActivateBtnsPage = document.getElementById('formActivateBtns');

const openRemFeeColFormBtn = document.getElementById('openRemFeeColMsgForm');

const tabBar = document.getElementById('tabBar');

const testBtn = document.getElementById('testBtn');

const pagesForDisplay = {
    formActivateBtnsPage,
    taskStatusPage,
    controlPanel
}

const scriptNames = {
    remFeeWatch: "Remaining Fee Task Watcher",
    remFeeFetch: "Remaining Fee Task Fetcher"
}

const runningStatuses = {
    runningStatus: "Running",
    stoppedStatus: "Stopped"
}

const messageTypes = {
    setScriptRunStatus: "Set up script running status.",
    updateTaskDB: "Update task database."
}

const localStorageKeys = {
    scriptRunningStatusesDB: "Scripts Statuses",
    taskDataBase: "Task Database",
    activelyManagedTabs: "Task Browser Management"
}

const taskers = {
    taskMaster: "Malik Zhang",
    nonTaskMaster: "others"
}

const taskStatuses = {
    statusAvail: "Available",
    statusPend: "Pending",
    statusMaster: `Done by ${taskers.taskMaster}`,
    statusUnavail: "Undoable"
}

const aisNames = {
    remFeeCollect: "Please Post Remaining Fee Message"
}

const initializeRemFeeFetScriptBtns = ()=>{
    remFeeFetStopBtn.disabled = false;
    remFeeFetStartBtn.disabled = true;
}

const scriptRunBtnActivate = (btnToEnable, btnToDisable)=>{
    btnToEnable.disabled = false;
    btnToDisable.disabled = true;
}

const updateScriptRunBtnStatus = (scriptName)=>{
    let startBtn;
    let stopBtn;
    // console.log(`The script name passed into updateScriptRunBtnStatus is ${scriptName}`);
    if(scriptName == scriptNames.remFeeWatch){
        startBtn = remainingFeeStartBtn;
        stopBtn = remainingFeeStopBtn;
        // console.log(`startBtn/stopBtn set up for watcher: start:${startBtn.id} stop:${stopBtn.id}`)
    }
    else if(scriptName == scriptNames.remFeeFetch){
        startBtn = remFeeFetStartBtn;
        stopBtn = remFeeFetStopBtn;
        // console.log(`startBtn/stopBtn set up for fetcher: start:${startBtn.id} stop:${stopBtn.id}`)
    }
    chrome.storage.local.get(localStorageKeys.scriptRunningStatusesDB, (result)=>{
        if(result[localStorageKeys.scriptRunningStatusesDB]){
            const scriptRunDB = result[localStorageKeys.scriptRunningStatusesDB];
            if(scriptRunDB[scriptName]){
                const scriptRunStatus = scriptRunDB[scriptName];
                if(scriptRunStatus == runningStatuses.runningStatus){
                    scriptRunBtnActivate(stopBtn, startBtn);
                }
                else{
                    scriptRunBtnActivate(startBtn, stopBtn);
                }
            }
            else{
                scriptRunBtnActivate(startBtn, stopBtn);
            }
        }
        else{
            scriptRunBtnActivate(startBtn, stopBtn);
        }
    })

}


/*
<div class="column has-text-centered">
    <h3 class="title is-6 has-text-grey">Taken Tasks(20)</h3>
    <ul>
        <li>Item 1</li>
    </ul>
</div>
*/
const generateTaskList = (taskName,taskNumber,orderIDs)=>{
    /*
    taskName == ["Available Tasks", "Pending Tasks", "Done Tasks", "Taken Tasks"]

    taskNumber == ["20", "20", "20", "20"]

    orderID == [["1234"....], [....], [....], [.....]];
    */
    taskColumnParent.innerHTML = '';

    const colorClasses = ["has-text-primary", "has-text-danger", "has-text-success", "has-text-grey"]
    
    for (let i = 0; i < 4; i++){
        
        // Create the column div
        
        const columnDiv = document.createElement("div");
        columnDiv.className = "column has-text-centered";

        // Create the heading
        const heading = document.createElement("h3");
        heading.className = `title is-6 ${colorClasses[i]}`;
        heading.textContent = `${taskName[i]}(${taskNumber[i]})`;

        // Create the unordered list
        const ul = document.createElement("ul");

        // Create the list items
        for(const orderid of orderIDs[i]){
            const li = document.createElement("li");
            li.textContent = `${orderid}`;
    
            // Append the list item to the unordered list
            ul.appendChild(li);
        }


        // Append the heading and unordered list to the column div
        columnDiv.appendChild(heading);
        columnDiv.appendChild(ul);

        // Append the column div to the parent element
        taskColumnParent.appendChild(columnDiv);
    }

}

const setScriptStatusStop = (script)=>{
    const storageObject = { [script]: runningStatuses.stoppedStatus };
    chrome.runtime.sendMessage({ type: messageTypes.setScriptRunStatus, info: storageObject });
}

const setScriptStatusRun = (script)=>{
    if(script == scriptNames.remFeeFetch){  
        const payload = {
            taskType: aisNames.remFeeCollect,
            scriptName: scriptNames.remFeeFetch,
            scriptStatus: runningStatuses.runningStatus
        }
        chrome.runtime.sendMessage({
            type: messageTypes.setScriptRunStatus,
            info: payload
        })
    }
    else{
        const storageObject = {[script] : runningStatuses.runningStatus};
        chrome.runtime.sendMessage({type: messageTypes.setScriptRunStatus, info: storageObject})
    }
}

//#region Local Storage Reference
/*
        chrome.storage.local



    key: localStorageKeys.taskDataBase



    value: 

    {

    “remFeeCollect”: {

        “1234”:{

        taskStatus: “pending”,

        messageInputs: {…….},

        message: “N/A”

        }

        [orderID]: {

        taskStatus: [status],

        messageInputs: {…….},

        message: [pre-written message]

        }

        }

    }

    key: localStorageKeys.scriptRunningStatusesDB



    value:

    {



        [scriptName]: runningStatus



        remFeeDetection: “Running”



        remFeeFetch: “Stopped”



    }
*/
//#endregion

const switchElement = (elemToShow, showTab)=>{
    const {currentlyDisplayedPage, currentlyDisplayedTab} = findCurrentlyDisplayed();
    // console.log(`Currently displayed page: ${currentlyDisplayedPage}, Currently displayed tab: ${currentlyDisplayedTab}`);
    currentlyDisplayedPage.style.display= "none";
    elemToShow.style.display = "";
    currentlyDisplayedTab.classList.remove("is-active");
    showTab.classList.add("is-active");
}

const findCurrentlyDisplayed = ()=>{
    let currentlyDisplayedPage;
    let currentlyDisplayedTab;
    Object.values(pagesForDisplay).forEach((page)=>{
        if(window.getComputedStyle(page).display !== "none"){
            currentlyDisplayedPage = page;
        }
    })

    Array.from(tabBar.children[0].children).forEach((tab)=>{
        if(tab.classList.contains("is-active")){
            currentlyDisplayedTab = tab;
        }
    })
    // const activePage = {currentlyDisplayedPage, currentlyDisplayedTab}.currentlyDisplayedPage
    // const activeTab = {currentlyDisplayedPage, currentlyDisplayedTab}.currentlyDisplayedTab
    // console.log(activePage, activeTab);
    return {currentlyDisplayedPage, currentlyDisplayedTab};
}

//#endregion

chrome.storage.local.get([localStorageKeys.taskDataBase], (result)=>{
    if(result[localStorageKeys.taskDataBase]){
        const taskDataBase = result[localStorageKeys.taskDataBase];
        if(taskDataBase[aisNames.remFeeCollect]){
            let accumAvail = 0;
            let accumPend = 0;
            let accumUnd = 0;
            let accumMast = 0;
            const taskName = ["Available Tasks", "Pending Tasks", "Done Tasks", "Taken Tasks"]
            let availTasks = [];
            let pendTask = [];
            let mastTask = [];
            let undTask = [];
            const remFeeAisDB = taskDataBase[aisNames.remFeeCollect];
            Object.keys(remFeeAisDB).forEach((orderID)=>{
                // console.log(orderID);
                const taskStatus = remFeeAisDB[orderID].taskStatus;
                switch (taskStatus){
                    case taskStatuses.statusAvail:
                        accumAvail += 1;
                        availTasks.push(orderID);
                        break;
                    case taskStatuses.statusMaster:
                        accumMast += 1;
                        mastTask.push(orderID);
                        break;
                    case taskStatuses.statusPend:
                        accumPend += 1;
                        pendTask.push(orderID);
                        break;
                    case taskStatuses.statusUnavail:
                        accumUnd += 1;
                        undTask.push(orderID);
                        break;
            }
            })
            const orderIDs = [availTasks, pendTask, mastTask, undTask];
            console.log(`orderIDs extracted: ${orderIDs}`)
            const orderCounts = [accumAvail, accumPend, accumMast, accumUnd];
            console.log(`orderCounts extracted: ${orderCounts}`);
            generateTaskList(taskName, orderCounts, orderIDs);
        }
        else{
            //code here
            console.log("Task database of rem fee collect task does not exist, nothing is generated");
        }
    }
    else{
        //code here
        console.log("Task database does not exist, nothing is generated")
    }
})

//#region Set Up for script run btns

Object.keys(scriptNames).forEach((scriptNameKey)=>{
    updateScriptRunBtnStatus(scriptNames[scriptNameKey]);
})

remainingFeeStopBtn.onclick = ()=>{
    setScriptStatusStop(scriptNames.remFeeWatch);
    scriptRunBtnActivate(remainingFeeStartBtn, remainingFeeStopBtn);
}

remainingFeeStartBtn.onclick = () =>{
    setScriptStatusRun(scriptNames.remFeeWatch);
    scriptRunBtnActivate(remainingFeeStopBtn, remainingFeeStartBtn);
}

remFeeFetStopBtn.onclick = ()=>{
    setScriptStatusStop(scriptNames.remFeeFetch);
    scriptRunBtnActivate(remFeeFetStartBtn, remFeeFetStopBtn);
}

remFeeFetStartBtn.onclick = ()=>{
    setScriptStatusRun(scriptNames.remFeeFetch);
    scriptRunBtnActivate(remFeeFetStopBtn, remFeeFetStartBtn);
}

//#endregion

//#region Set Up for Tabs
taskListTab.onclick = ()=>{
    
    switchElement(taskStatusPage, taskListTab);
}

controlsTab.onclick = ()=>{
    switchElement(controlPanel, controlsTab);
}

openFormTab.onclick = ()=>{
    switchElement(formActivateBtnsPage, openFormTab);
}

//#endregion

function parseOrderId(url) {
    const match = url.match(/\/order\/(\d+)/);
    return match ? match[1] : "This is not a valid page.";
}

openRemFeeColFormBtn.onclick = ()=>{
    const queryCriteria = { active:true, currentWindow:true };
    chrome.tabs.query(queryCriteria, (tabs)=>{
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        const orderID = parseOrderId(currentURL);
        
        // console.log(`orderID: ${orderID}`);

        chrome.windows.create({
            url: `pprfm-scripts/remFeeCollectForm.html?orderID=${orderID}&taskType=${aisNames.remFeeCollect}`,
            type: "popup",
            width: 400,
            height: 600
        })
    })


}

if (clearLocalBtn) {
    clearLocalBtn.onclick = () => {
        chrome.storage.local.clear(function () {
            // console.log('local storage cleared');
        });
        clearLocalBtn.disabled = true;
    };
} 

chrome.storage.local.get(null, (result) => {
    // 'result' will be an object containing all stored key-value pairs
    if (Object.keys(result).length === 0) {
      clearLocalBtn.disabled = true;
    } else {
      clearLocalBtn.disabled = false;
    }
});
