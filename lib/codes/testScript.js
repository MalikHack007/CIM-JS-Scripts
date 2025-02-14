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

//#region update case status to prefiling
// const addDelay = (delay=1000)=>{
//   return new Promise((resolve)=>{
//     setTimeout(()=>{
//       resolve();
//     }, delay);
//   })
// };

const updateCaseToPreFiling = async (caseType, delay)=>{

  const caseBoxes = document.querySelectorAll('div.hover-show-icon.hover-show-icon-right.hover-light.hover-show-box.orderCaseBox');

  let targetCaseBox;

  caseBoxes.forEach((caseBox)=>{
    if(caseBox.textContent.includes(caseType)){
      targetCaseBox = caseBox;
    }
  });

  // console.log(targetCaseBox);

  const editBtn = targetCaseBox.querySelector('span.mr-1.img-icon.iicon-edit');

  // console.log(editBtn);
  
  editBtn.click();
  
  // console.log(caseStatusSelectMenu);

  await addDelay(delay);

  const caseStatusSelectMenu = document.querySelector('select[name="case_status"]');
  caseStatusSelectMenu.selectedIndex = 2;

  await addDelay(delay);

  const caseUpdateForm = document.querySelector('form[action="https://northcms.wenzo.com/order/add-update-order-case"]');
  
  // console.log(caseUpdateForm);
  
  caseUpdateForm.submit();

};

const updateNIWToPrefile = ()=>{
  updateCaseToPreFiling("NIW", 1);
};

const updateEB1AToPrefile = ()=>{
  updateCaseToPreFiling("EB1A", 1);
};

// updateNIWToPrefile();
updateEB1AToPrefile();

//#endregion

//addDelay function
const addDelay = (delay=1000)=>{
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    }, delay);
  })
};

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
};

//produce date in the format of yyyy-mm-dd

const getDateISO8601 = ()=>{
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth()+1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const ISO8601Date = `${year}-${month}-${day}`;

  return ISO8601Date;
};

const postNIWPPWarning = ()=>{
  const currentDate = getDateISO8601();
  addSpecialNote(`<font color="red">${currentDate} NIW PP warning msg posted</font>`, 1);
};

const postEB1APPWarning = ()=>{
  const currentDate = getDateISO8601();
  addSpecialNote(`<font color="red">${currentDate} EB1A PP warning msg posted</font>`, 1);
};

// postEB1APPWarning();
postNIWPPWarning();

//#endregion

//#region approve the message 

const targetMsgBox = document.querySelector("#messageBox0");

const msgButtons = targetMsgBox.querySelectorAll("button.btn.btn-primary.btn-sm.mr-1.mb-1");

let approvalBtn;

msgButtons.forEach((btn)=>{
  if(btn.textContent.includes("Approve")){
    approvalBtn = btn;
  }
})

// console.log(approvalBtn);

approvalBtn.click();

//#endregion

//#region check off AIS

const AISTable = document.querySelector("table.table.table-xs.table-borderless.table-hover");

const AISRows = AISTable.querySelectorAll("tr");

let remFeeRow;

AISRows.forEach((tr)=>{
  if(tr.textContent.includes("Please post remaining fee")){
    remFeeRow = tr;
  }
});

// console.log(remFeeRow);

const AISActionBox = remFeeRow.querySelector("td.text-nowrap.text-right");

// console.log(AISActionBox);

const checkBox = AISActionBox.querySelector("span.img-icon.iicon-checkbox");

// console.log(checkBox);

checkBox.click();

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