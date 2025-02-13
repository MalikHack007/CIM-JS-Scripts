// <span class="mr-1 img-icon iicon-edit"></span>


const modal = document.querySelector('#orderCaseFormModal');

console.log(modal);

//tab navigation

const removeSpaces = (str) => str.replace(/\s+/g, "");

const navigateToTab = (tabName)=>{
  tabName = removeSpaces(tabName);

  const allTabs = document.querySelectorAll('a.list-group-item');

  let targetTab;
  
  allTabs.forEach((elem)=>{
    if(removeSpaces(elem.textContent).toLowerCase() == tabName.toLowerCase()){
      targetTab = elem;
    }
  })
  
  targetTab.click();
}

navigateToTab();
//end


const updateCaseToPreFiling = (delay)=>{
  const editBtn = document.querySelector('span.mr-1.img-icon.iicon-edit');

  // console.log(editBtn);
  
  editBtn.click();
  
  // console.log(caseStatusSelectMenu);
  setTimeout(()=>{
    const caseStatusSelectMenu = document.querySelector('select[name="case_status"]');
    caseStatusSelectMenu.selectedIndex = 1;
    setTimeout(()=>{
      const caseUpdateForm = document.querySelector('form[action="https://northcms.wenzo.com/order/add-update-order-case"]');
  
      // console.log(caseUpdateForm);
      
      caseUpdateForm.submit();
    }, delay);
  }, delay);
}

updateCaseToPreFiling(100);

//addDelay function
const addDelay = (delay=1000)=>{
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    }, delay);
  })
}

//#region Add special note:

const addSpecialNote = async (note, delay=1000)=>{
  
  const editSpecialNoteBtn = document.querySelector("button.btn.btn-sm.ml-1.p-0.border-0[data-v-74e046d8][type='button']");
  editSpecialNoteBtn.click();

  await addDelay(delay);

  const textAreaForm = document.querySelector('textarea[name="note_special"]');
  textAreaForm.value += `\n\n${note}`;
  textAreaForm.dispatchEvent(new Event("input", { bubbles: true }));
  // console.log(textAreaForm.value);
  // specialNoteForm.submit();

  await addDelay(delay);

  const updateSpecialNoteBtn = document.querySelector("button[data-v-74e046d8][type='submit']");
  // console.log(updateSpecialNoteBtn);
  updateSpecialNoteBtn.click();
}

//produce date in the format of yyyy-mm-dd

const getDateISO8601 = ()=>{
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth()+1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const ISO8601Date = `${year}-${month}-${day}`;

  return ISO8601Date;
}

const postNIWPPWarning = ()=>{
  const currentDate = getDateISO8601();
  addSpecialNote(`<font color="red">${currentDate} NIW PP warning msg posted</font>`);
}

const postEB1APPWarning = ()=>{
  const currentDate = getDateISO8601();
  addSpecialNote(`<font color="red">${currentDate} EB1A PP warning msg posted</font>`);
}

postEB1APPWarning();

//#endregion








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
// 