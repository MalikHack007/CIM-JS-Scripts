import {generateFeeCollectionMessage, generatePPWarningMessage} from "./message-contents-generation.js";

document.addEventListener('DOMContentLoaded', () => {
  //#region messages
  const caseSpecificRadioBtns = document.querySelectorAll('input[name="isCaseSpecific"]');
  const usersCaseSlectField1 = document.querySelector('#usersCase1');

  const hasComplainedRadios = document.querySelectorAll('input[name ="hasComplained"]');

  const ppInfoPvdedRadios = document.querySelectorAll('input[name="ppInfoIsProvided"]');

  const unresolvedInquiryRadios = document.querySelectorAll('input[name="isFurtherInquiry"]');
  //#endregion

  //#region Client Record
  const directPPRadios = document.querySelectorAll('input[name="isPp"]');
  const countryOfBirthSelect = document.querySelector('select[name="countryOfBirth"]');
  const isInUSRadios = document.querySelectorAll('input[name="isInsideUS"]');
  const ppSpecificRadios = document.querySelectorAll('input[name="ppSpecific"]');
  //#endregion

  //#region Additional PP Info

  const earlierCaseTypeInput = document.querySelector('input[name="earlierCaseType"]');

  const pdIsCurrentRadios = document.querySelectorAll('input[name="priorityDateIsCurrent"]')
  const anotherPDRadios = document.querySelectorAll('input[name="anotherPriorityDate"]')

  const serviceCenterSelect = document.querySelector('select[name="serviceCenter"]');

  const anotherPDDateInput = document.querySelector('#anotherPD')
  //#endregion

  //#region Billing Info

  const attyFeePaidRadios = document.querySelectorAll('input[name="hasPaid"]');

  const attyFeeAmtInput = document.querySelector('#remAttyFee');

  const isDiscountRadios = document.querySelectorAll('input[name="isFilingFeeCredit"]');

  const discountTypeSelect = document.querySelector('#filing-credit-type');

  const discAmtInput = document.querySelector('#filing-fee-amt');

  //#endregion

  const findCheckedRadioBtn = (radioBtnPair)=>{
    let checkedRadioBtn
    radioBtnPair.forEach((radio)=>{
      if(radio.checked){
        checkedRadioBtn = radio;
      }
    })
    // console.log(checkedRadioBtn);
    return checkedRadioBtn;
  }

  const remFeeKeySteps = {
    dummyStep: "not initiated",
    sendPPWarning: "PP Warning"
  }
  
  const visibilityRules = {
    complaintField: {
      dependsOn: ["inquiryField"],
      condition: ([checkedInquiryRadio]) => checkedInquiryRadio == "y" 
    },


    attyFeeAmtField: {
      dependsOn: ["attyFeeYesOrNo"],
      condition: ([checkedAttyRadio]) => checkedAttyRadio == "n"  
    },

    discountAmtField:{
      dependsOn: ["discountYesOrNo"],
      condition: ([checkedDiscRadio]) => checkedDiscRadio == "y"
    },
    discountTypeField:{
      dependsOn: ["discountYesOrNo"],
      condition: ([checkedDiscRadio]) => checkedDiscRadio == "y"
    },
    //#region ALL PP RELATED
    additionalPPInfoBox:{
      dependsOn: ["ppYesOrNo"],
      condition: ([ppYoNChecked]) => ppYoNChecked == "y"
    },

    ppInfoPvdedField:{
      dependsOn: ["ppYesOrNo"],
      condition: ([checkedPPRadio]) => checkedPPRadio == "y"
    },
    oldPpInfo:{
      dependsOn: ["ppYesOrNo","ppInfoPvdedYesOrNo"],
      condition: ([checkedPPRadio, ppInfoRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'y'
    },

    ppSpecificField:{
      dependsOn:["ppYesOrNo"],
      condition:([checkedPPRadio])=> checkedPPRadio == "y"
    },

    countryOfBirthField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' 
    },

    isInTheUSField: {
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' 
    },

    serviceCenterField: {
      dependsOn: ["ppYesOrNo"],
      condition: ([checkedPPRadio]) => checkedPPRadio == 'y'
    },

    h1BIsExpiringField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "isInUSorNo"], 
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, isInUSRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && isInUSRadio == 'y'
    },

    currentPDYorNField:{
      dependsOn: ["ppYesOrNo"], 
      condition: ([checkedPPRadio]) => checkedPPRadio == 'y'
    },

    anotherPDYorNField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "countryOfBirthSelect", "currentPDYorN"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, countryOfBirthSelect, isPDCurrentRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && (countryOfBirthSelect == "China" || countryOfBirthSelect == "India") && isPDCurrentRadio == 'n'
    },

    earlierPDCaseType:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "countryOfBirthSelect", "currentPDYorN", "anotherPDYorN"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, countryOfBirthSelect, isPDCurrentRadio, anotherPDRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && (countryOfBirthSelect == "China" || countryOfBirthSelect == "India") && isPDCurrentRadio == 'n' && anotherPDRadio == 'y'
    },

    anotherPDDateField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "countryOfBirthSelect", "currentPDYorN", "anotherPDYorN"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, countryOfBirthSelect, isPDCurrentRadio, anotherPDRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && (countryOfBirthSelect == "China" || countryOfBirthSelect == "India") && isPDCurrentRadio == 'n' && anotherPDRadio == 'y'
    },

    isAnotherPDApprovedField: {
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "countryOfBirthSelect", "currentPDYorN", "anotherPDYorN"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, countryOfBirthSelect, isPDCurrentRadio, anotherPDRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && (countryOfBirthSelect == "China" || countryOfBirthSelect == "India") && isPDCurrentRadio == 'n' && anotherPDRadio == 'y'
    },
    //#endregion
    usersCase1Warning:{
      dependsOn:["caseType"],
      condition: ([caseTypeValue]) => caseTypeValue == 'N/A'
    },
    countryOfBirthWarning:{
      dependsOn:["countryOfBirthSelect"],
      condition: ([countryOfBirthSelectValue]) => countryOfBirthSelectValue == 'N/A'
    },
    serviceCenterWarning:{
      dependsOn:["serviceCenter"],
      condition: ([serviceCenterSelectValue]) => serviceCenterSelectValue == 'N/A'
    },
    attyFeeAmtWarning:{
      dependsOn:["remainingAttorneyFee"],
      condition:([remainingAttyFee]) => remainingAttyFee == 0
    },
    discountTypeWarning:{
      dependsOn:["filingFeeCreditType"],
      condition:([filingCreditType]) => filingCreditType == "N/A"
    },
    discountAmtWarning:{
      dependsOn:["filingFeeCredit"],
      condition:([discountAmount]) => discountAmount == 0
    },
    pdDateWarning:{
      dependsOn:["exactPriorityDate"],
      condition: ([exactPD]) => exactPD == ""
    },
    earlierCaseTypeWarning:{
      dependsOn:["earlierCaseType"],
      condition: ([caseTypeEntry]) => caseTypeEntry == ""
    }
  };

  const formState = {
    isCaseSpecificField: "n", //mapped
    inquiryField: "n",  //mapped
    attyFeeYesOrNo: "y",  //mapped
    discountYesOrNo: "n", //mapped
    ppYesOrNo: "n", //mapped
    ppInfoPvdedYesOrNo:"n", //mapped
    caseType:"NIW", //mapped
    isInUSorNo: "n", //mapped
    countryOfBirthSelect: "N/A", //mapped
    currentPDYorN: 'n', //mapped
    anotherPDYorN: "n",
    serviceCenter: "N/A",
    remainingAttorneyFee: 0,
    filingFeeCreditType: "N/A",
    filingFeeCredit: 0,
    exactPriorityDate: "",
    earlierCaseType: "",
    ppSpecific: "n"
  }

  const nameToFieldTableRadio = {
    isCaseSpecific: "isCaseSpecificField",
    isPp: "ppYesOrNo",
    hasComplained: "complaintField",
    hasPaid: "attyFeeYesOrNo",
    isFilingFeeCredit: "discountYesOrNo",
    ppInfoIsProvided: "ppInfoPvdedYesOrNo",
    isInsideUS: "isInUSorNo",
    priorityDateIsCurrent: "currentPDYorN",
    anotherPriorityDate: "anotherPDYorN",
    ppSpecific: "ppSpecific",
    isFurtherInquiry: "inquiryField"
  }

  const nameToFieldTableSelectMenu = {
    usersCase: "caseType",
    countryOfBirth: "countryOfBirthSelect",
    serviceCenter: "serviceCenter",
    filingFeeCreditType: "filingFeeCreditType"
  }

  const dropDownMenuListFormState = [usersCaseSlectField1, countryOfBirthSelect, serviceCenterSelect, discountTypeSelect];

  const radioPairListFormState = [caseSpecificRadioBtns, directPPRadios, hasComplainedRadios, attyFeePaidRadios, isDiscountRadios, ppInfoPvdedRadios, isInUSRadios, pdIsCurrentRadios, anotherPDRadios, ppSpecificRadios, unresolvedInquiryRadios];

  const inputListFormState = [attyFeeAmtInput, discAmtInput, anotherPDDateInput, earlierCaseTypeInput];

  function evaluateVisibility(field, dependedStates, rules) {
    const ruleThatApplies = rules[field];
    // console.log(`${JSON.stringify(ruleThatApplies)}`);
    if (!ruleThatApplies) return true; // No rule means always visible
    const { dependsOn, condition } = ruleThatApplies;

    const dependedValues = [];

    for(const dependedField of dependsOn){
      dependedValues.push(dependedStates[dependedField]);
    }
    // if(field == "countryOfBirthField"){
    //   // console.log(dependedValues)
    //   // console.log(condition(dependedValues));
    // }
    return condition(dependedValues);
  }

  function updateVisibility() {
    // console.log(`update visibility is called.`)
    Object.keys(visibilityRules).forEach((field) => {
      const isVisible = evaluateVisibility(field, formState, visibilityRules);
      toggleFieldVisibility(field, isVisible);
    });
  }

  function toggleFieldVisibility(field, isVisible) {
    const wrapper = document.getElementById(`${field}-wrapper`);
    // Check if the visibility state has changed before modifying the class
    const wasVisible = !wrapper.classList.contains("is-hidden");
    
    if (isVisible && !wasVisible) {
      wrapper.classList.remove("is-hidden");
    } 
    
    else if (!isVisible && wasVisible) {
      wrapper.classList.add("is-hidden");
    }
  }

  //event listeners for the depended inputs
  const addEvtListenerToUpdteFormStatesFromRadio = (listOfRadioPairs)=>{
    for(const radioPair of listOfRadioPairs){
      radioPair.forEach((radio)=>{
        radio.addEventListener('change', ()=>{
          const selectedRadio = findCheckedRadioBtn(radioPair);
          const isSelectedYes = selectedRadio.value == 'y';
          const radioName = radio.getAttribute("name");
          const keyInFormState = nameToFieldTableRadio[radioName];
          if(isSelectedYes){
            formState[keyInFormState] = 'y';
            // console.log(`${formState[keyInFormState]}`)
            updateVisibility();
          }
          else{
            formState[keyInFormState] = 'n';
            // console.log(`${formState[keyInFormState]}`)
            updateVisibility();
          }
        })
      })
    }
  }

  const addEvtListenerToUpdteFormStatesFromSelect = (listOfSelectMenus) =>{
    for(const selectMenu of listOfSelectMenus){
      selectMenu.addEventListener('change', ()=>{
        const nameOfSelect = selectMenu.getAttribute("name");

        const keyInFormState = nameToFieldTableSelectMenu[nameOfSelect];
        formState[keyInFormState] = selectMenu.value;
        // if(nameOfSelect == "serviceCenter"){
        //   // console.log(`Service center form state updated to ${formState[keyInFormState]}`);
        // }
        updateVisibility();
      })
    }
  }

  const addEvtLstnerToUpdteFSInput = (listOfInputs) =>{
    for (const input of listOfInputs){
      input.addEventListener('change', ()=>{
        const inputValue = input.value;
        const inputName = input.getAttribute('name');
        formState[inputName] = inputValue
        updateVisibility();
      })
    }
  }

  addEvtListenerToUpdteFormStatesFromRadio(radioPairListFormState);
  addEvtListenerToUpdteFormStatesFromSelect(dropDownMenuListFormState);
  addEvtLstnerToUpdteFSInput(inputListFormState);

  updateVisibility();

  //#endregion

  const testBtn = document.getElementById('Test');
  
  const remFeeMsgForm = document.getElementById('remFeeMsgInputForm');

const urlParams = new URLSearchParams(window.location.search);
const orderID = urlParams.get('orderID');
const taskType = urlParams.get('taskType');

const preLoadMsgBtn = document.querySelector('#msgPreload');

const messageTypes = {
  setScriptRunStatus: "Set up script running status.",
  updateTaskDB: "Update task database.",
  enterMessage: "Enter the message.",
  remFeeTaskInit: "Initiate rem fee task completion"
}

const msgEnterBtn = document.querySelector('#msgEnter');

const runTaskBtn = document.querySelector("#runRemFeeTask");

const actions = {
  writeMessage: "Please write message.",
  sendMessage: "Please write and then send message.",
  runRemFeeTask: "Run script to complete the task."
}

preLoadMsgBtn.onclick = ()=>{
  //read the form data into an object
  const formData = new FormData(remFeeMsgForm);
  const formDataObject = {};
  for (const [name, value] of formData.entries()) {
    formDataObject[name] = value;
  }
  Object.keys(formDataObject).forEach((key)=>{
    if(formDataObject[key] == "n"){
      formDataObject[key] = false;
    }
    else if(formDataObject[key] == "y"){
      formDataObject[key] = true;
    }
    else if(key == "remainingAttorneyFee" || key == "filingFeeCredit" ){
      formDataObject[key] = Number(formDataObject[key]);
    }
  })
  //generate the message according to the form inputs
  const message = customizedMessage(formDataObject, orderID);
  const messageInputs = formDataObject;
  //send a message to the background to store it
  const finalPayload = {taskType, 
                        orderID, 
                        message, 
                        messageInputs
                      }
  const finalMessageToBG = {type: messageTypes.updateTaskDB, info:finalPayload};
  chrome.runtime.sendMessage(finalMessageToBG).then(()=>{
    //close the window
    chrome.windows.getCurrent().then((window)=>{
    const windowID = window.id;
    chrome.windows.remove(windowID);
  });
});
}

msgEnterBtn.onclick = ()=>{
    //read the form data into an object
    const formData = new FormData(remFeeMsgForm);
    const formDataObject = {};
    for (const [name, value] of formData.entries()) {
      formDataObject[name] = value;
    }
    Object.keys(formDataObject).forEach((key)=>{
      if(formDataObject[key] == "n"){
        formDataObject[key] = false;
      }
      else if(formDataObject[key] == "y"){
        formDataObject[key] = true;
      }
      else if(key == "remainingAttorneyFee" || key == "filingFeeCredit" ){
        formDataObject[key] = Number(formDataObject[key]);
      }
    })
    //generate the message according to the form inputs
    //TODO:FIX THIS AFTER TESTING
    const message = formDataObject.isPp ? generateFeeCollectionMessage(formDataObject, orderID) + generatePPWarningMessage(formDataObject) : generateFeeCollectionMessage(formDataObject, orderID);

    const messageInputs = formDataObject;
    //send a message to the background to store it
    const finalPayload = {taskType, orderID, message, messageInputs, msgSent: true, action: actions.writeMessage};
    const finalMessageToBG = {type: messageTypes.updateTaskDB, info:finalPayload};
    chrome.runtime.sendMessage(finalMessageToBG).then(()=>{
          //close the window
          chrome.windows.getCurrent().then((window)=>{
          const windowID = window.id;
          chrome.windows.remove(windowID);
        });
    });

}

runTaskBtn.onclick = ()=>{
  //TEST
  //TEST END
  //read the form data into an object
  const formData = new FormData(remFeeMsgForm);
  const formDataObject = {};
  for (const [name, value] of formData.entries()) {
    formDataObject[name] = value;
  }
  Object.keys(formDataObject).forEach((key)=>{
    if(formDataObject[key] == "n"){
      formDataObject[key] = false;
    }
    else if(formDataObject[key] == "y"){
      formDataObject[key] = true;
    }
    else if(key == "remainingAttorneyFee" || key == "filingFeeCredit" ){
      formDataObject[key] = Number(formDataObject[key]);
    }
  })
  //generate the message according to the form inputs
  //TODO: 
  const message = {
    feeCollection: generateFeeCollectionMessage(formDataObject, orderID),
    ppWarning: generatePPWarningMessage(formDataObject)
  }
  const messageInputs = formDataObject;
  //send a message to the background to store it
  const finalPayload = {taskType, 
                        orderID, 
                        message, 
                        messageInputs, 
                        msgSent: true, 
                        action: actions.runRemFeeTask, 
                        scriptingInProgress: true, 
                        currentScriptingStep: (messageInputs.isPp && (!messageInputs.ppInfoIsProvided || (messageInputs.ppInfoIsProvided && messageInputs.oldPpInfo))) ? remFeeKeySteps.sendPPWarning : remFeeKeySteps.dummyStep
                        };
  const finalMessageToBG = {type: messageTypes.updateTaskDB, info:finalPayload};
  chrome.runtime.sendMessage(finalMessageToBG).then(()=>{
        console.log("Starting to close window.");
        //close the window
        chrome.windows.getCurrent().then((window)=>{
        const windowID = window.id;
        chrome.windows.remove(windowID);
      });
  });
}

//#endregion
});