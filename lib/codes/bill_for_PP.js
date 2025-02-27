async function billForPP(inputObject){
    const ppFee = 2805;

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
   
    let amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
    amountToChargeInput.value = String(ppFee);
    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
   
    let chargeCommentInput = document.querySelector('#chargeCustomerComment');
    // const hasFiledPPWithUsInput = prompt("Have they filed PP with us on another case before?(Y/N)").toLowerCase();
    const hasFiledAnotherPP = inputObject.ppSpecific
    let ppCaseType = "";
    if(hasFiledAnotherPP){
        ppCaseType = inputObject.usersCase;
        chargeCommentInput.value = `I-140 ${ppCaseType} Premium Processing Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else{
        chargeCommentInput.value = `Premium Processing Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    let chargeButton = document.querySelector('[data-v-38146dfa][type="button"]');
    chargeButton.click();

    await addDelay(800);
    window.alert = function() {}; 
    window.confirm = function() { return true; }; 
    window.prompt = function() { return ""; };
    sendEmailBtn.click();

}

billForPP();