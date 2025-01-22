document.addEventListener('DOMContentLoaded', () => {
  //#region messages
  const caseSpecificRadioBtns = document.querySelectorAll('input[name="isCaseSpecific"]');

  const usersCaseField1 = document.querySelector('#userCase1')
  const usersCaseSlectField1 = document.querySelector('#usersCase1');

  const furtherInquiryRadios = document.querySelectorAll('input[name="isFurtherInquiry"]');

  const hasComplainedRadios = document.querySelectorAll('input[name ="hasComplained"]');

  const ppInfoPvdedRadios = document.querySelectorAll('input[name="ppInfoIsProvided"]')
  //#endregion

  //#region Client Record
  const directPPRadios = document.querySelectorAll('input[name="isPp"]');
  const usersCaseField2 = document.querySelector('#userCase2');
  const selectUsersCase2 = document.querySelectorAll('select[name="usersCase"]');
  const usersCaseSlectField2 = document.querySelector('#usersCase2')
  const countryOfBirthField = document.querySelector('#countryOBirth');
  const countryOfBirthSelect = document.querySelector('select[name="countryOfBirth"]');
  const insideUSField = document.querySelector('#inTheUS'); 
  const h1BField = document.querySelector('#isH1BExp'); 
  const isInUSRadios = document.querySelectorAll('input[name="isInsideUS"]');
  //#endregion

  //#region Additional PP Info

  const additionalPPFormField = document.querySelector('#additPPInfo');

  //#endregion

  const findCheckedRadioBtn = (radioBtnPair)=>{
    let checkedRadioBtn
    radioBtnPair.forEach((radio)=>{
      if(radio.checked){
        checkedRadioBtn = radio;
      }
    })
    console.log(checkedRadioBtn);
    return checkedRadioBtn;
  }

  const showSelectMenu = (selectField, selectMenu)=>{
      selectField.classList.remove('is-hidden');
      selectMenu.disabled = false;
  }

  const hideSelectMenu =(selectField, selectMenu)=>{
    selectField.classList.add('is-hidden');
    selectMenu.disabled = true;
  }

  const showField = (formField)=>{
    formField.classList.remove("is-hidden");
  }

  const hideField = (formField)=>{
    formField.classList.add("is-hidden");
  }

  const findTheEnabledCaseSelect = ()=>{
    const bothCaseSelect = document.querySelectorAll('select[name="usersCase"]');
    let enabledSelect;
    bothCaseSelect.forEach((selectMenu)=>{
      if(selectMenu.disabled == false){
        enabledSelect = selectMenu;
      }
    })
    return enabledSelect;
  }

  caseSpecificRadioBtns.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedDirectPPRadio = findCheckedRadioBtn(directPPRadios);
      if (radio.value === 'y' && radio.checked && selectedDirectPPRadio.value == 'no') {
        // console.log(`${selectedDirectPPRadio.value}`);
        showSelectMenu(usersCaseField1, usersCaseSlectField1);
        hideSelectMenu(usersCaseField2, usersCaseSlectField2);
      }
      else if(radio.value === 'y' && radio.checked && selectedDirectPPRadio.value == 'y'){
        showSelectMenu(usersCaseField1, usersCaseSlectField1);
        hideSelectMenu(usersCaseField2, usersCaseSlectField2);
      }
      else if (radio.value === 'no' && radio.checked && selectedDirectPPRadio.value == 'y') {
        hideSelectMenu(usersCaseField1, usersCaseSlectField1);
        showSelectMenu(usersCaseField2, usersCaseSlectField2);
      }
      else{
        hideSelectMenu(usersCaseField1, usersCaseSlectField1);
        usersCaseField2.classList.add("is-hidden");
        usersCaseSlectField2.disabled = false;
      }
    });
  });

  directPPRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const radioSlectedForCS = findCheckedRadioBtn(caseSpecificRadioBtns);
      if (radio.value === 'y' && radio.checked && radioSlectedForCS.value == "no") {
        showSelectMenu(usersCaseField2, usersCaseSlectField2);
        hideSelectMenu(usersCaseField1, usersCaseSlectField1);
        showField(countryOfBirthField);
      } 
      else if(radio.value === 'y' && radio.checked && radioSlectedForCS.value == "y"){
        hideSelectMenu(usersCaseField2, usersCaseSlectField2);
        showSelectMenu(usersCaseField1, usersCaseSlectField1);
        showField(countryOfBirthField);
      }
      else if(radio.value === 'no' && radio.checked && radioSlectedForCS.value == "no"){
        hideSelectMenu(usersCaseField2, usersCaseSlectField2);
        usersCaseField1.classList.add("is-hidden");
        usersCaseSlectField1.disabled = false;
        hideField(countryOfBirthField);
      }
      else{
        showSelectMenu(usersCaseField1, usersCaseSlectField1);
        hideSelectMenu(usersCaseField2, usersCaseSlectField2);
        hideField(countryOfBirthField);
      }
    });
  });

  countryOfBirthSelect.addEventListener('change', ()=>{
    const enabledCaseSelect = findTheEnabledCaseSelect();
    console.log(enabledCaseSelect);
    const eitherChinaOrIndia = (countryOfBirthSelect.value == "China"||countryOfBirthSelect.value == "India")
    const valueIsNA = countryOfBirthSelect.value == "N/A";
    if(eitherChinaOrIndia && enabledCaseSelect.value == "EB1A"){
      showField(insideUSField);
      showField(additionalPPFormField);
    }

    else if(eitherChinaOrIndia && enabledCaseSelect.value == "NIW"){
      hideField(insideUSField);
      hideField(h1BField);
      hideField(additionalPPFormField);
    }

    else if(eitherChinaOrIndia && enabledCaseSelect.value == "N/A"){

    }

    else if((!eitherChinaOrIndia) && enabledCaseSelect.value == "EB1A"){
      showField(insideUSField);
      hideField(additionalPPFormField);
    }
    else if((!eitherChinaOrIndia) && enabledCaseSelect.value == "NIW"){
      hideField(insideUSField);
      hideField(h1BField);
      hideField(additionalPPFormField);
    }

    else if((!eitherChinaOrIndia) && enabledCaseSelect.value == "N/A"){
      //add warning message to the case select menu
    }
    else if(valueIsNA && (enabledCaseSelect.value == "EB1A" || enabledCaseSelect.value == "NIW")){

    }
    else if(valueIsNA && enabledCaseSelect.value == "N/A"){

    }
  })

  const testBtn = document.getElementById('Test');
  
  const remFeeMsgForm = document.getElementById('remFeeMsgInputForm');

  testBtn.onclick = ()=>{
    const formData = new FormData(remFeeMsgForm);
    const formDataObject = {};
    for (const [name, value] of formData.entries()) {
      formDataObject[name] = value;
    }
    Object.keys(formDataObject).forEach((key)=>{
      if(formDataObject[key] == "no"){
        formDataObject[key] = false;
      }
      else if(formDataObject[key] == "y"){
        formDataObject[key] = true;
      }
    })
    console.log(`${JSON.stringify(formDataObject)}`);
  }

  //#endregion
});