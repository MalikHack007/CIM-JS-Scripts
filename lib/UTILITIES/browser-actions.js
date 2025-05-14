let requiredSubModules = {};

const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
});

//I PROMISE I WILL GIVE YOU THE MODULES YOU NEED, JUST WAIT!!!!!
async function modulesReady(){
    const pathToCustomUtilFuncs = chrome.runtime.getURL('lib/UTILITIES/custom-utils.js');
    const pathToSharedObjects = chrome.runtime.getURL('lib/shared-objects.js');
    customUtilFuncs = await import(pathToCustomUtilFuncs);
    const sharedObjects = await import(pathToSharedObjects);
    requiredSubModules = { customUtilFuncs, sharedObjects };
}


export async function addSpecialNote (note, delay=1000){
    await modulesReady();

    const editSpecialNoteBtn = document.querySelector("button.btn.btn-sm.ml-1.p-0.border-0[type='button']");

    editSpecialNoteBtn.click();

    await requiredSubModules.customUtilFuncs.addDelay(delay);

    const textAreaForm = document.querySelector('textarea[name="note_special"]');
    textAreaForm.value += `\n\n${note}`;
    textAreaForm.dispatchEvent(new Event("input", { bubbles: true }));
    // console.log(textAreaForm.value);
    // specialNoteForm.submit();

    await requiredSubModules.customUtilFuncs.addDelay(delay);

    const updateSpecialNoteBtn = document.querySelector("button[type='submit']");
    // console.log(updateSpecialNoteBtn);
    updateSpecialNoteBtn.click();
};

export async function sendInvoice(amount, comment){
    await modulesReady();
    //#region essential definitions

    const invoiceConfirmationDialogBox = document.querySelector('#chargeCustomerConfirmation');
    const sendEmailBtn = invoiceConfirmationDialogBox.querySelector('span.btn.btn-primary');

    let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");

    let chargeCommentInput = document.querySelector('#chargeCustomerComment');

    const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');

    const chargeButton = document.querySelector('[type="button"][value="Charge"]');

    //#endregion
    //new
    //show input fields
    chargeCustomerInput.classList.add("show");
    //input comment
    chargeCommentInput.value = comment;
    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    //input amount
    amountToChargeInput.value = String(amount);
    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
    //click charge
    chargeButton.click();
    await requiredSubModules.customUtilFuncs.addDelay(800);
    sendEmailBtn.click();
}

export async function approveMostRecentMsg(){

    const targetMsgBox = document.querySelector("#messageBox0");
    
    const msgButtons = targetMsgBox.querySelectorAll("button.btn.btn-primary.btn-sm.mr-1.mb-1");
    
    let approvalBtn;
    
    msgButtons.forEach((btn)=>{
        if(btn.textContent.includes("Approve")){
            approvalBtn = btn;
        }
    });

    if(approvalBtn){
        approvalBtn.dispatchEvent(event);
    }
    else{
        console.log("CANNOT GET APPROVAL BUTTON.");
    }
}

export async function markOffAIS(aisName){
    //#region DOM references
    const AISTable = document.querySelector("table.table.table-xs.table-borderless.table-hover");

    const AISRows = AISTable.querySelectorAll("tr");
    //#endregion
    
    let aisRow;
    
    AISRows.forEach((tr)=>{
        if(tr.textContent.toLowerCase().includes(aisName.toLowerCase())){
            aisRow = tr;
        }
    });
    
    // console.log(remFeeRow);
    if(aisRow){
        const AISActionBox = aisRow.querySelector("td.text-nowrap.text-right");
        
        const checkBox = AISActionBox.querySelector("span.img-icon.iicon-checkbox");
        
        checkBox.click();
    }

    else{
        console.log("CANNOT LOCATE AIS ROW IN DOM");
    }
}

export const updateCaseStage = async (caseType, delay, stage)=>{
    await modulesReady();

    const caseBoxes = document.querySelectorAll('div.hover-show-icon.hover-show-icon-right.hover-light.hover-show-box.orderCaseBox');

    let targetCaseBox;

    caseBoxes.forEach((caseBox)=>{
        if(caseBox.textContent.includes(caseType)){
            targetCaseBox = caseBox;
        }
    });

    // console.log(targetCaseBox);
    if(targetCaseBox){
        const editBtn = targetCaseBox.querySelector('span.mr-1.img-icon.iicon-edit');
        
        editBtn.click();
        
        await requiredSubModules.customUtilFuncs.addDelay(delay);

        const caseStatusSelectMenu = document.querySelector('select[name="case_status"]');

        caseStatusSelectMenu.selectedIndex = requiredSubModules.sharedObjects.caseStatusToSelectedIndex[stage];

        await requiredSubModules.customUtilFuncs.addDelay(delay);

        const caseUpdateForm = document.querySelector('form[action="https://northcms.wenzo.com/order/add-update-order-case"]');
        
        // console.log(caseUpdateForm);
        
        caseUpdateForm.submit();
    }

    else{
        console.log("CANNOT FIND THE TARGET CASE BOX.")
    }

};

export function enterText(textMessage){
    let message_box = document.querySelector('#sendMessageBoxTitle');

    message_box.children[0].children[0].click();
    
    //Access the textbox
    
    let formDiv = document.querySelector('#sendMessageFormDiv');
    
    let iframe = formDiv.querySelector('iframe');
    
    let iframeDocument = iframe.contentDocument;
    
    let iframeTextBox = iframeDocument.querySelector('#tinymce');
    
    iframeTextBox.innerHTML = textMessage;
}