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

  const additionalPPFormField = document.querySelector('#additionalPPInfoBox');
  const pdIsCurrentRadios = document.querySelectorAll('input[name="priorityDateIsCurrent"]')
  const anotherPDRadios = document.querySelectorAll('input[name="anotherPriorityDate"]')

  const serviceCenterSelect = document.querySelector('select[name="serviceCenter"]');

  const processingTimeInput = document.querySelector('#processing-time');

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
      dependsOn: ["ppYesOrNo", "caseType", "ppInfoPvdedYesOrNo"],
      condition: ([ppYoNChecked, caseTypeSelect, ppInfoPvdedRadio]) => ppYoNChecked == "y" && caseTypeSelect == "EB1A" && ppInfoPvdedRadio == "n"
    },

    ppInfoPvdedField:{
      dependsOn: ["ppYesOrNo"],
      condition: ([checkedPPRadio]) => checkedPPRadio == "y"
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
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' 
    },

    processingTimeField: {
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType"],
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' 
    },

    h1BIsExpiringField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "isInUSorNo"], 
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, isInUSRadio]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && isInUSRadio == 'y'
    },

    currentPDYorNField:{
      dependsOn: ["ppYesOrNo", "ppInfoPvdedYesOrNo", "caseType", "countryOfBirthSelect"], 
      condition: ([checkedPPRadio, ppInfoRadio, caseTypeSelect, countryOfBirthSelect]) => checkedPPRadio == 'y' && ppInfoRadio == 'n' && caseTypeSelect == 'EB1A' && (countryOfBirthSelect == "China" || countryOfBirthSelect == "India")
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
    processingTimeWarning: {
      dependsOn:["processingTime"],
      condition: ([processingTimeMonths]) => processingTimeMonths == 0
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
    processingTime: 0,
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

  const inputListFormState = [attyFeeAmtInput, discAmtInput, processingTimeInput, anotherPDDateInput, earlierCaseTypeInput];

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

function addComma(number){
    numString = number.toString();
    if (numString.length == 4){
        numString = numString[0]+','+numString[1]+numString[2]+numString[3];
    }
    return numString;
}

function customizedMessage(finalDetails, orderID){
    const filingFee = 715;

    const asylumFee = 300;

    const ppFee = 2805;

    const totalFilingFees = filingFee + asylumFee;

    const handleCaseDetails = {
        handleCaseSpecific: function (){
            if (finalDetails.isCaseSpecific){
                return " "+finalDetails.usersCase+" "; 
            }
            else{
                return " ";
            }
        },

        handleUnpaidAttyFee: {
            firstPlace: function(){
                if(!finalDetails.hasPaid){
                    return " and the remaining attorney fee are both ";
                }
                else{
                    return " is ";
                }
            },
        
            secondPlace: function(){
                if(!finalDetails.hasPaid){
                    return `$${addComma(finalDetails.remainingAttorneyFee)} remaining attorney fee + `;
                }
                else{
                    return '';
                }
            } 
        },

        handlePP: {
            //addressing the PP Warning Part
            ppWarnings: function(){
                const handlePortedPD = {
                    placeHolder1: function (){
                        if(!finalDetails.anotherPriorityDate){
                            return ", ";
                        }
    
                        else{
                            if(finalDetails.isOtherPDApproved){
                                return ` (in your case, your priority date will be the one ported through your approved ${finalDetails.earlierCaseType}, which is ${finalDetails.exactPriorityDate}), `;
                            }

                            else{
                                return ` (in your case, your priority date will be the one ported through your ${finalDetails.earlierCaseType} once approved, which is ${finalDetails.exactPriorityDate}), `;
                            }
                        };
                    },

                    placeHolder2: function(){
                        if(!finalDetails.anotherPriorityDate){
                            return ". ";
                        }

                        else{
                            return " until your priority date becomes current. ";
                        };
                    }
                };
                
                function handleVisaStatus(){
                    if(finalDetails.isInsideUS && finalDetails.h1bIsExpiring){
                        return `<p>Please note that it remains very important to maintain your non-immigrant status throughout the whole process. For instance, if you require an I-140 approval to extend your H-1B beyond the six-year cap and you do not have other I-140 pending/approved, you may still wish to request premium processing. If this applies, please update us as to your plans regarding your nonimmigrant status and we can advise accordingly.
                                </p><p><br></p>`;
                    }
                    else if (finalDetails.isInsideUS && (!finalDetails.h1bIsExpiring)){
                        return `<p>Please note that it remains very important to maintain your non-immigrant status throughout the whole process.</p><p><br></p>`;
                    }
                    else if ((!finalDetails.isInsideUS)){
                        return "";
                    };
                };

                //For info not provided
                const ppWarningNIW = `
                <P>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at the same time. If so, an additional 
                $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
                <p>&nbsp;</p>
                <p>Although we have not observed a lower approval rate for NIW cases processed under premium processing, and we are unable to make a meaningful comparison of 
                RFE rates between premium and regular processing cases due to the majority of regular processing NIW cases still pending adjudication, we want to highlight the 
                potentially higher risk of RFEs for NIW cases using premium processing.</p><p><br></p><p>Specifically, based on our recent observations, approximately 72% of the 
                NIW RFE/NOIDs we received from USCIS between November 2024 and March 2025 were for premium processing NIW cases. It appears that more USCIS officers are rushing 
                through case adjudications and issuing templated RFE/NOIDs to meet the premium processing deadlines.</p><p><br></p><p>In addition to the increased risk of RFE/NOIDs, 
                we have also observed delays in the adjudication of premium processing cases at the Nebraska Service Center, with some cases being processed well beyond the guaranteed 
                timeline. At this time, we cannot predict when this situation may improve or whether similar delays will occur at the Texas Service Center in the future.</p><p><br></p>
                <p>Given these concerns, we advise against requesting premium processing at this time.</p>
                <p>&nbsp;</p>                
                `;

                const ppWarningEB1ACINotCurrent = `
                <p>In addition, we noticed in your client record that you plan to file I-140 with request of premium processing at the 
                same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to  
                $2,805 starting February 26, 2024). However, we would like to update you regarding your plan to file your EB1A using 
                Premium Processing. We wanted to make you aware of the below points that could make Regular Processing a better option 
                for your case at this time.</p><p><br></p><p>1.&nbsp; <span style="text-decoration: underline;" data-mce-style="text-decoration: 
                underline;"><strong>If we do not consider other case-specific factors, EB1A cases filed with premium processing have a 
                lower approval rate and a higher RFE rate based on our most recent observation.</strong></span> Since USCIS must take 
                action on the EB1A case within 15 business days of receiving the premium processing request, it seems that they are more 
                likely to issue RFEs just to give them more time. As such, you should weigh the benefit of having your case adjudicated in 
                15 business days against the chance of receiving RFE/NOIDs. Our hope is that this is a temporary trend, and by waiting to 
                have your case adjudicated under regular processing you will avoid the tougher standard of adjudication.</p><p><br></p><p>
                2.&nbsp; EB-1 priority dates are retrogressed for ${finalDetails.countryOfBirth}, without a clear indication of precisely when priority 
                dates will again be current. As such, even if you receive an I-140 approval on the 15 business days premium processing 
                timeline, you would not be able to take action based on your I-140 approval${handlePortedPD.placeHolder2()}Whether or not you file using premium 
                processing, your priority date is set by your date of filing${handlePortedPD.placeHolder1()}not by your date of approval. As such, your priority date is 
                not impacted by your decision to use either Premium or Regular Processing.</p><p><br></p><p>You can choose to file using 
                Premium Processing at a later date should retrogression end before a decision has been reached on your I-140 petition. For 
                your information, without premium processing, the EB1A processing time at ${finalDetails.serviceCenter} is around ${finalDetails.processingTime} 
                months according to the USCIS processing time website.&nbsp;</p><p><br></p>${handleVisaStatus()}<p>Please confirm if you would like to 
                proceed with regular processing or premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before filing so that the actual filing plan we proceed with is consistent with your preference.</strong>
                </p>
                <p>&nbsp;</p>                
                `;

                const ppWarningEB1ACICurrentOrROW = `
                <p>In addition, we noticed in your client record that you plan to file I-140 with request of premium processing 
                at the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the 
                fee from $2,500 to $2,805 starting February 26, 2024). However, we would like to update you regarding your plan 
                to file your EB1A using Premium Processing. We wanted to make you aware of the below information that could make 
                Regular Processing a better option for your case at this time.</p><p><br></p><p><span style="text-decoration: 
                underline;" data-mce-style="text-decoration: underline;"><em><strong>If we do not consider other case-specific 
                factors, EB1A cases filed with premium processing have a lower approval rate and a higher RFE rate based on our 
                most recent observation.</strong></em></span> Since USCIS must take action on the EB1A case within 15 business days of 
                receiving the premium processing request, it seems that they are more likely to issue RFEs just to give them 
                more time. As such, you should weigh the benefit of having your case adjudicated in 15 business days against 
                the chance of receiving RFE/NOIDs. Our hope is that this is a temporary trend, and by waiting to have your 
                case adjudicated under regular processing you will avoid the tougher standard of adjudication.</p><p><br></p>
                <p>For your information, without premium processing, the EB1A processing time at ${finalDetails.serviceCenter} is 
                around ${finalDetails.processingTime} months according to the USCIS processing 
                time website.&nbsp;</p><p><br></p>${handleVisaStatus()}<p>Please confirm if you would like to proceed with regular processing or 
                premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">
                ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to 
                avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before 
                filing so that the actual filing plan we proceed with is consistent with your preference.</strong></p>
                <p>&nbsp;</p>
                `;
                
                //For info provided

                const ppWarningInfoProvided = `
                <P>Additionally, as you plan to file the I-140 with a request for premium processing at the same time, an additional 
                $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
                <p>&nbsp;</p>
                `;


                //if no pp indicated

                if(!finalDetails.isPp){
                    return "";
                }
                //if NIW
                else if(finalDetails.usersCase == "NIW"){
                    //info has not been provided
                    if(!finalDetails.ppInfoIsProvided){
                        return ppWarningNIW;
                    }
                    //info has been provided
                    else if(finalDetails.ppInfoIsProvided){
                        return ppWarningInfoProvided;
                    };
                }
                //if EB1A
                else if(finalDetails.usersCase == "EB1A"){
                    //if info provided
                    if(finalDetails.ppInfoIsProvided){
                        return ppWarningInfoProvided;
                    }
                    //if info not provided
                    else if((!finalDetails.ppInfoIsProvided)){
                        //if from ROW, does not matter their PD is current or not, canned msg does not address PD at all. 
                        if(finalDetails.countryOfBirth == "ROW"){
                            return ppWarningEB1ACICurrentOrROW;
                        }
                        //if PD Current, it DOES NOT matter which country they are from
                        else if(finalDetails.priorityDateIsCurrent){
                            return ppWarningEB1ACICurrentOrROW;
                        }
                        //If PD IS NOT CURRENT
                        else if((!finalDetails.priorityDateIsCurrent) && ["China", "India"].includes(finalDetails.countryOfBirth)){
                            return ppWarningEB1ACINotCurrent;
                        };
                    };
                    
                };
            },

            invoiceParagraph: function(){
                function handleInfoProvided(){
                    if (finalDetails.ppInfoIsProvided){
                        return "";
                    }

                    else if(finalDetails.usersCase == "EB1A"){
                        return ` <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Note if you will proceed with regular 
                        processing first, you do not need to pay the premium processing fee now.</span>`;
                    }

                    else if(finalDetails.usersCase == "NIW"){
                        return ` <strong>If you will proceed with regular processing first, you do not need to pay the 
                        premium processing fee now.</strong> 
                        <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Kindly ensure 
                        that your filing plan in regards to premium processing under section 1 of client record is up-to-date 
                        to avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan 
                        well before filing so that the actual filing plan we proceed with is consistent with your preference.
                        </strong>`;
                    }
                };

                function handleFFCredit(){
                    if((!finalDetails.isFilingFeeCredit)){
                        return "";
                    }
                    else{
                        return ` - $${addComma(finalDetails.filingFeeCredit)} ${finalDetails.filingFeeCreditType}`;
                    };
                };

                const noPPInvoice = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of $${addComma(totalFilingFees+finalDetails.remainingAttorneyFee-finalDetails.filingFeeCredit)} (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace()}$${filingFee} filing fee + $${asylumFee} asylum program fee${handleFFCredit()}). Please follow the instructions attached to the invoice email and make a payment at your earliest convenience.
                </p>
                <p>&nbsp;</p>
                `;

                const ppInvoice = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of $${addComma(totalFilingFees+finalDetails.remainingAttorneyFee-finalDetails.filingFeeCredit)} 
                (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace()}$${filingFee} filing fee + $${asylumFee} asylum program fee${handleFFCredit()}), 
                and a separate invoice email for 
                the premium processing fee of $${addComma(ppFee)}. We accept payments via Zelle, wire transfer, counter deposit, and credit card, etc. Please follow 
                the instructions attached to the invoice email and leave a message after you have initiated the payment(s).${handleInfoProvided()}
                </p>
                <p>&nbsp;</p>
                `;


                if (finalDetails.isPp){
                    return ppInvoice;
                }

                else{
                    return noPPInvoice;
                }
                
            }

        },

        handleFurtherInquiry: function(){
            const furtherInquiryText = `
            <p>Please note that we must receive the required fees before we can file the case.</p>
            <p>&nbsp;</p>
            <p>We will respond to you further as soon as possible. Thank you!</p>
            `;
            const noFurtherInquiry = "<p>Please note that we must receive the required fees before we can file the case. Thank you!</p>"
            if(finalDetails.isFurtherInquiry){
                if(finalDetails.hasComplained){
                  return noFurtherInquiry;
                }
                else{
                  return furtherInquiryText;
                }
                
            }
            else{
                return noFurtherInquiry;
            }
        },

        handleComplaints: function(){
            if(finalDetails.hasComplained){
                return `<p>Thank you for your message, we will respond further as soon as possible.</p>
                        <p>&nbsp;</p>`;
            }

            else{
                return "";
            };
        }
    };

    const customizedParagraphs = {
        part0:`
        ${handleCaseDetails.handleComplaints()}
        `,

        part1:`
        <p>Now that your${handleCaseDetails.handleCaseSpecific()}petition letter is finalized, the${handleCaseDetails.handleCaseSpecific()}I-140 filing 
        fee${handleCaseDetails.handleUnpaidAttyFee.firstPlace()}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
        transfer, counter deposit, e-check, Stripe, or PayPal, etc.</p>
        <p>&nbsp;</p>
        <p>We'd like to remind you that as shown in our announcements, the newly released final rule on USCIS fee increases has taken effect on April 1, 2024. Petitions 
        postmarked on or after April 1, 2024 will be subject to new fees. According to the final rule, the filing fee itself has increased from $700 to $715. Additionally, 
        as updated (on April 3rd) on the USCIS's Frequently Asked Questions on the USCIS Fee Rule page (accessible <a href="https://www.uscis.gov/forms/filing-fees/frequently-asked-questions-on-the-uscis-fee-rule" target="_blank" rel="noopener">here</a>), USCIS confirms that an individual self-petitioner filing Form I-140 EB-1A or EB-2 NIW would 
        pay the reduced Asylum Program Fee of $300.</p>
        <p>&nbsp;</p>
        <p><em>*Note the Asylum Program Fee is not a fee required because you are filing an asylum program application. Rather, USCIS requires this fee to be paid by I-140 
        petitioners to offset their costs for the asylum program they have, which currently does not require its own filing fee. It does not mean that your case is associated 
        with an asylum application in any way.</em></p>
        <p>&nbsp;</p>
        `,

        part2: `${handleCaseDetails.handlePP.ppWarnings()}`,
        
        part3: `${handleCaseDetails.handlePP.invoiceParagraph()}`,
        //CHANGE*
        part4: `
        <p>Please note that Stripe charges a <strong>2% service fee</strong> for all credit/debit card transactions, and PayPal charges a <strong>2.5% service fee</strong> for all 
        transactions. If you have a U.S. bank account, you may also send an Electronic Check (ACH) payment via Stripe without any service fee. However, please be reminded that 
        it takes <span style="text-decoration: underline;"><strong>at least 4 business days</strong> to process the payment if you send an Electronic Check (ACH) payment via 
        Stripe, which could lead to possible delays in case filing, as we need to receive the payment in order to file the case.</span></p>
        <p>&nbsp;</p>
        <p>As a reminder, please ensure to include your order ID #${orderID} in the memo/notes section if possible. After the payment is complete, please upload a receipt to 
        the "Additional Documents" section of your account for our verification purposes.</p>
        <p>&nbsp;</p>
        <p>After we receive your payment, we will issue the appropriate checks to U.S. Department of Homeland Security on your behalf and include them in your petition 
        package.&nbsp;</p>
        <p>&nbsp;</p>
        `,

        part5: `${handleCaseDetails.handleFurtherInquiry()}`
                              
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
    
}

const urlParams = new URLSearchParams(window.location.search);
const orderID = urlParams.get('orderID');
const taskType = urlParams.get('taskType');
const tabID = urlParams.get('tabID');

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
  const finalPayload = {taskType, orderID, message, messageInputs}
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
    const message = customizedMessage(formDataObject, orderID);
    const messageInputs = formDataObject;
    //send a message to the background to store it
    const finalPayload = {taskType, orderID, message, messageInputs, msgSent: true, action: actions.writeMessage, tabID:tabID};
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
  const message = customizedMessage(formDataObject, orderID);
  const messageInputs = formDataObject;
  //send a message to the background to store it
  const finalPayload = {taskType, 
                        orderID, 
                        message, 
                        messageInputs, 
                        msgSent: true, 
                        action: actions.runRemFeeTask, 
                        scriptingInProgress: true, 
                        tabID: tabID
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