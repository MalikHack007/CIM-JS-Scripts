async function billForAttyFeeAndFF(inputObject){
    //#region essential definitions
    const asylumFee = 300;

    const filingFee = 715;

    const addDelay = (delay=1000)=>{
        return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve();
          }, delay);
        })
    };
    const invoiceConfirmationDialogBox = document.querySelector('#chargeCustomerConfirmation');
    const sendEmailBtn = invoiceConfirmationDialogBox.querySelector('span.btn.btn-primary');

    let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
    chargeCustomerInput.classList.add("show");
   
    let chargeCommentInput = document.querySelector('#chargeCustomerComment');

    const isCaseSpecific = inputObject.isCaseSpecific;

    const isRemainingAttyFee = inputObject.hasPaid;

    const isFFCredit = inputObject.isFilingFeeCredit;

    //#endregion


    //#region Manual Prompting

    // const isCaseSpecificInput = prompt("Is it case specific? (Y/N)").toLowerCase();
    // const isRemainingAttyFeeInput = prompt("Is there remaining attorney fee to be collected? (Y/N)").toLowerCase();
    // const isFFCreditInput = prompt("Is there a discount on the filing fee?(Y/N)").toLowerCase();

    // const isCaseSpecific = isCaseSpecificInput === "y";
    // const isRemainingAttyFee = isRemainingAttyFeeInput === "y";
    // const isFFCredit = isFFCreditInput === "y";

    //#endregion


    let caseType = "";
    let remainingAttyFee = 0;
    let ffCredit = 0;

    //handle comment

    if(isCaseSpecific && isRemainingAttyFee){
        caseType = inputObject.usersCase;
        chargeCommentInput.value = `Remaining I-140 ${caseType} Attorney Fee, I-140 ${caseType} Filing Fee and Asylum Program Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else if(isCaseSpecific && (!isRemainingAttyFee)){
        caseType = inputObject.usersCase;
        chargeCommentInput.value = `I-140 ${caseType} Filing Fee and Asylum Program Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else if ((!isCaseSpecific) && isRemainingAttyFee){
        chargeCommentInput.value = `Remaining I-140 Attorney Fee, I-140 Filing Fee and Asylum Program Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else{
        chargeCommentInput.value = "I-140 Filing Fee and Asylum Program Fee";
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    //handle amount to charge

    if(isRemainingAttyFee && isFFCredit){
        remainingAttyFee = Number(inputObject.remainingAttorneyFee);
        ffCredit = Number(inputObject.filingFeeCredit);
        const amountToCharge = remainingAttyFee + filingFee + asylumFee - ffCredit;
        const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
        amountToChargeInput.value = String(amountToCharge);
        amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
        amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    else if(isRemainingAttyFee && !isFFCredit){
        remainingAttyFee = Number(inputObject.remainingAttorneyFee);
        const amountToCharge = remainingAttyFee + filingFee + asylumFee - ffCredit;
        const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
        amountToChargeInput.value = String(amountToCharge);
        amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
        amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else if(!isRemainingAttyFee && isFFCredit){
        ffCredit = Number(inputObject.filingFeeCredit);
        const amountToCharge = filingFee + asylumFee - ffCredit;
        const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
        amountToChargeInput.value = String(amountToCharge);
        amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
        amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    else{
        const amountToCharge = filingFee + asylumFee;
        const amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
        amountToChargeInput.value = String(amountToCharge);
        amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
        amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    //click charge button
    let chargeButton = document.querySelector('[data-v-38146dfa][type="button"]');
    chargeButton.click();
    await addDelay(800);
    window.alert = function() {}; 
    window.confirm = function() { return true; }; 
    window.prompt = function() { return ""; };
    sendEmailBtn.click();
}

billForAttyFeeAndFF();