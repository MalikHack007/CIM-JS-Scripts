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