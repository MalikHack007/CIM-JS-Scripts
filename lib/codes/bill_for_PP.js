javascript:(function(){
    const ppFee = 2805;

    let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
    chargeCustomerInput.classList.add("show");
   
    let amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
    amountToChargeInput.value = String(ppFee);
    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
   
    let chargeCommentInput = document.querySelector('#chargeCustomerComment');
    const hasFiledPPWithUsInput = prompt("Have they filed PP with us on another case before?(Y/N)").toLowerCase();
    const hasFiledAnotherPP = hasFiledPPWithUsInput === "y";
    let ppCaseType = "";
    if(hasFiledAnotherPP){
        ppCaseType = prompt("What's the case type? (EB1A or NIW)").toUpperCase();
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


})();