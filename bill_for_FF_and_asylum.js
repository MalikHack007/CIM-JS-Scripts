javascript:(function(){
    let chargeCustomerInput = document.querySelector("#leftmenuChargeCustomer");
    chargeCustomerInput.classList.add("show");
   
    let amountToChargeInput = document.querySelector('input.form-control[data-v-38146dfa][type="number"]');
    amountToChargeInput.value = "1015";
    amountToChargeInput.dispatchEvent(new Event('input', { bubbles: true }));
    amountToChargeInput.dispatchEvent(new Event('change', { bubbles: true }));
   
    let chargeCommentInput = document.querySelector('#chargeCustomerComment');
    chargeCommentInput.value = "I-140 Filing Fee and Asylum Program Fee";
    chargeCommentInput.dispatchEvent(new Event('input', { bubbles: true }));
    chargeCommentInput.dispatchEvent(new Event('change', { bubbles: true }));

    let chargeButton = document.querySelector('[data-v-38146dfa][type="button"]');
    chargeButton.click();


})();