// document.addEventListener('DOMContentLoaded', () => {
//     const isCaseSpecificRadios = document.querySelectorAll('input[name="isCaseSpecific"]');
//     const hasPaidRadios = document.querySelectorAll('input[name="hasPaid"]');
//     const isPpRadios = document.querySelectorAll('input[name="isPp"]');
//     const priorityDateIsCurrentRadios = document.querySelectorAll('input[name = "priorityDateIsCurrent"]');
//     const anotherPriorityDateRadios = document.querySelectorAll('input[name="anotherPriorityDate"]');
//     const isInsideUSRadios = document.querySelectorAll('input[name="isInsideUS"]');
  
//     const usersCaseContainer = document.getElementById('usersCaseContainer');
//     const usersCaseContainer2 = document.querySelector('#usersCaseContainer.usersCase2');
//     const remainingAttorneyFeeContainer = document.getElementById('remainingAttorneyFeeContainer');
//     const countryOfBirthContainer = document.getElementById('countryOfBirthContainer');
//     const priorityDateIsCurrentContainer = document.getElementById('priorityDateIsCurrentContainer');
//     const anotherPriorityDateContainer = document.getElementById('anotherPriorityDateContainer');
//     const priorityDateContainer = document.getElementById('priorityDateContainer');
//     const isInsideUSContainer = document.getElementById('isInsideUSContainer');
//     const h1bIsExpiringContainer = document.getElementById('h1bIsExpiringContainer');
//     const serviceCenterContainer = document.getElementById('serviceCenterContainer');
//     const processingTimeContainer = document.getElementById('processingTimeContainer');
  
//     function moveUsersCaseAfter(targetContainer) {
//       targetContainer.insertAdjacentElement('afterend', usersCaseContainer);
//     }
  
//     function updateVisibility() {
//       const isCaseSpecific = document.querySelector('input[name="isCaseSpecific"]:checked')?.value;
//       const hasPaid = document.querySelector('input[name="hasPaid"]:checked')?.value;
//       const isPp = document.querySelector('input[name="isPp"]:checked')?.value;
//       const anotherPriorityDate = document.querySelector('input[name="anotherPriorityDate"]:checked')?.value;
//       const isInsideUS = document.querySelector('input[name="isInsideUS"]:checked')?.value;
//       const usersCase = document.querySelector('select[name="usersCase"]')?.value;
//       const priorityDateIsCurrent = document.querySelector('input[name = "priorityDateIsCurrent"]:checked')?.value;
  
//       // Show/hide User's Case and determine its position
//       if (isCaseSpecific === 'yes') {
//         usersCaseContainer.classList.remove('hidden');
//       } 
      
//       else if (isCaseSpecific === 'no' && isPp === 'yes') {
//         usersCaseContainer2.classList.remove('hidden');
//         moveUsersCaseAfter(document.getElementById('isPpContainer'));
//       } 
      
//       else {
//         usersCaseContainer.classList.add('hidden');
//         usersCaseContainer2.classList.add('hidden');
//       }
  
//       // Show/hide Remaining Attorney Fee
//       if (hasPaid === 'no') {
//         remainingAttorneyFeeContainer.classList.remove('hidden');
//       } else {
//         remainingAttorneyFeeContainer.classList.add('hidden');
//       }
  
//       // Show/hide additional fields for EB1A + Premium Processing
//       if (isPp === 'yes' && (usersCase === 'EB1A')) {
//         countryOfBirthContainer.classList.remove('hidden');
//         priorityDateIsCurrentContainer.classList.remove('hidden');
//         isInsideUSContainer.classList.remove('hidden');
//         serviceCenterContainer.classList.remove('hidden');
//         processingTimeContainer.classList.remove('hidden');
//       } 
      
//       else {
//         countryOfBirthContainer.classList.add('hidden');
//         priorityDateIsCurrentContainer.classList.add('hidden');
//         anotherPriorityDateContainer.classList.add('hidden');
//         isInsideUSContainer.classList.add('hidden');
//         serviceCenterContainer.classList.add('hidden');
//         processingTimeContainer.classList.add('hidden');
//       }

//       //another priority date field only shows up when pd is not current
//       if (priorityDateIsCurrent === 'yes'){
//         anotherPriorityDateContainer.classList.add('hidden');
//       }

//       else{
//         anotherPriorityDateContainer.classList.remove('hidden');
//       }
  
//       // Show/hide Priority Date
//       if (anotherPriorityDate === 'yes') {
//         priorityDateContainer.classList.remove('hidden');
//       } else {
//         priorityDateContainer.classList.add('hidden');
//       }
  
//       // Show/hide H1B Expiring
//       if (isInsideUS === 'yes') {
//         h1bIsExpiringContainer.classList.remove('hidden');
//       } else {
//         h1bIsExpiringContainer.classList.add('hidden');
//       }
//     }
  
//     // Attach event listeners
//     isCaseSpecificRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     hasPaidRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     isPpRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     priorityDateIsCurrentRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     anotherPriorityDateRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     isInsideUSRadios.forEach(radio => radio.addEventListener('change', updateVisibility));
//     document.querySelector('select[name="usersCase"]').addEventListener('change', updateVisibility);
  
//     // Initial visibility setup
//     updateVisibility();
//   });
  
const clearLocalBtn = document.getElementById('clearLocal');

const remainingFeeStopBtn = document.getElementById('remainingFeeStop');

const remFeeWatchingTask = "remFeeWatchingStatus";

const remFeeFetTask = "remFeeFetchingStatus";

const remainingFeeStartBtn = document.getElementById('remainingFeeStart');

const remFeeFetStartBtn = document.getElementById('taskFetcherStart');

const remFeeFetStopBtn = document.getElementById('taskFetcherStop');

const runningStatus = "Running";

const stoppedStatus = "Stopped";

const setTaskStatusStop = (task)=>{
    const storageObject = { [task]: stoppedStatus };
    chrome.storage.local.set(storageObject);
}

const setTaskStatusRun = (task)=>{
    const storageObject = {[task]: runningStatus};
    chrome.storage.local.set(storageObject);
}

const defaultBtnState = {
    [remFeeWatchingTask]: "Paused"
}

const defaultFetBtnState = {
    [remFeeFetTask]: "Paused"
}


chrome.storage.local.get(defaultBtnState, (result)=>{
    if(result[remFeeWatchingTask] == runningStatus){
        console.log(result[remFeeWatchingTask]);
        remainingFeeStopBtn.disabled = false;
        remainingFeeStartBtn.disabled = true;
    }
    else{
        console.log(result[remFeeWatchingTask]);
    }
})

//set up rem fee fetch buttons
chrome.storage.local.get(defaultFetBtnState, (result)=>{
    if(result[remFeeFetTask] == runningStatus){
        remFeeFetStopBtn.disabled = false;
        remFeeFetStartBtn.disabled = true;
    }
    else{
        console.log(result[remFeeFetTask]);
    }
})

chrome.storage.local.get(null, (result) => {
    // 'result' will be an object containing all stored key-value pairs
    if (Object.keys(result).length === 0) {
      clearLocalBtn.disabled = true;
    } else {
      clearLocalBtn.disabled = false;
    }
  });

if (clearLocalBtn) {
    clearLocalBtn.onclick = () => {
        chrome.storage.local.clear(function () {
            console.log('local storage cleared');
        });
        clearLocalBtn.disabled = true;
    };
} 
else {
    console.error('Button with id "clearLocal" not found.');
}


remainingFeeStopBtn.onclick = ()=>{
    setTaskStatusStop(remFeeWatchingTask);

    remainingFeeStartBtn.disabled = false;
    remainingFeeStopBtn.disabled = true;
}

remainingFeeStartBtn.onclick = () =>{
    setTaskStatusRun(remFeeWatchingTask);
    remainingFeeStopBtn.disabled = false;
    remainingFeeStartBtn.disabled = true;
}

remFeeFetStopBtn.onclick = ()=>{
    setTaskStatusStop(remFeeFetTask);
    remFeeFetStartBtn.disabled = false;
    remFeeFetStopBtn.disabled = true;
}

remFeeFetStartBtn.onclick = ()=>{
    setTaskStatusRun(remFeeFetTask);
    remFeeFetStopBtn.disabled = false;
    remFeeFetStartBtn.disabled = true;
}

chrome.storage.local.get(remFeeWatchingTask, (result)=>{
    console.log(result[remFeeWatchingTask]);
})

chrome.storage.local.get(remFeeFetTask, (result)=>{
    console.log(result[remFeeFetTask]);
})

