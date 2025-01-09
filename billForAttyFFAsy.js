javascript:(function(){

    const asylumFee = 300;

    const filingFee = 715;

    let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
    chargeCustomerInput.classList.add("show");
   
    let chargeCommentInput = document.querySelector('#chargeCustomerComment');

    const isCaseSpecificInput = prompt("Is it case specific? (Y/N)").toLowerCase();
    const isRemainingAttyFeeInput = prompt("Is there remaining attorney fee to be collected? (Y/N)").toLowerCase();
    const isCaseSpecific = isCaseSpecificInput === "y";
    const isRemainingAttyFee = isRemainingAttyFeeInput === "y";
    let caseType = "";
    let remainingAttyFee = 0;

    //handle comment

    if(isCaseSpecific && isRemainingAttyFee){
        caseType = prompt("What's the case type? (EB1A or NIW)").toUpperCase();
        chargeCommentInput.value = `Remaining I-140 Attorney Fee, I-140 ${caseType} Filing Fee and Asylum Program Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else if(isCaseSpecific && (!isRemainingAttyFee)){
        caseType = prompt("What's the case type? (EB1A or NIW)").toUpperCase();
        chargeCommentInput.value = `I-140 ${caseType} Filing Fee and Asylum Program Fee`;
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    else{
        chargeCommentInput.value = "I-140 Filing Fee and Asylum Program Fee";
        chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
        chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));
    };

    //handle amount to charge

    if(isRemainingAttyFee){
        remainingAttyFee = Number(prompt("Enter the remaining attorney fee to be collected:"));
        const amountToCharge = remainingAttyFee + filingFee + asylumFee;
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


})();