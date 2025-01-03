function enterText(textMessage){
    let message_box = document.querySelector('#sendMessageBoxTitle');

    message_box.children[0].children[0].click();
    
    //Access the textbox
    
    let formDiv = document.querySelector('#sendMessageFormDiv');
    
    let iframe = formDiv.querySelector('iframe');
    
    let iframeDocument = iframe.contentDocument;
    
    let iframeTextBox = iframeDocument.querySelector('#tinymce');
    
    iframeTextBox.innerHTML = textMessage;
}

function getOrderID(){
    let orderForm = document.querySelector('#sideBarGoToOrderForm');
    let orderIDContainer = orderForm.querySelector('input');
    return orderIDContainer.value;
}

//ONLY HANDLE 4-DIGIT NUMBERS
function addComma(number){
    numString = number.toString();
    if (numString.length == 4){
        numString = numString[0]+','+numString[1]+numString[2]+numString[3];
    }
    return numString;
}

function userCaseCustomization(isCaseSpecific, usersCase){
    if (isCaseSpecific){
        return " "+usersCase+" "; 
    }
    else{
        return " ";
    }
}

let remainingAttyFeeCustomization = {
    customization1: function(hasPaid){
        if(!hasPaid){
            return " and the remaining attorney fee are both ";
        }
        else{
            return " is ";
        }
    },

    customization2: function(hasPaid, remainingAttorneyFee){
        if(!hasPaid){
            return `$${addComma(remainingAttorneyFee)} remaining attorney fee + `;
        }
        else{
            return '';
        }
    }
}

function furtherInquiryCustomization(isFurtherInquiry){
    let furtherInquiryText = `
    <p>Please note that we must receive the required fees before we can file the case.</p>
    <p>&nbsp;</p>
    <p>We will respond to you further as soon as possible. Thank you!</p>
    `;
    if(isFurtherInquiry){
        return furtherInquiryText;
    }
    else{
        return "<p>Please note that we must receive the required fees before we can file the case. Thank you!</p>";
    }
}

let niwPpTextCustomizations = {
    niwPpTxt1: function (isPp, usersCase){
        if(isPp && usersCase == "NIW"){
            return ppFIXEDTexts.NIW2;
        }
        else{
            return ". ";
        }
    },

    niwPpTxt2: function(isPp, usersCase){
        if(isPp && usersCase == "NIW"){
            return ppFIXEDTexts.NIW1;
        }
        else{
            return "";
        }
    }
}


/* pp consideration:
case type (NIW or EB1A)

if EB1A:
country of birth;
inside or outside the US?
if inside, what's their current visa?
    if H1B, is it about to expire?(Within 1.5 years)
if china/india:
    What's their PD(LOok at previously filed I-140/I-140 filed with us)?
        if PD is current:
        if PD is not current:
*/

let ppFIXEDTexts = {
    NIW1: `
    <P>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at the same time. If so, an additional 
    $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
    <p>&nbsp;</p>
    <P>Please be reminded that requesting Premium Processing Service can only shorten the processing time of your I-140 petition. It does not affect your priority date. 
    Your priority date should be approximately the date USCIS receives your I-140 petition, NOT the date USCIS approves your petition. Having the I-140 approval through 
    Premium Processing Service will not expedite the wait time for your priority date to become current. You will still need to wait for your priority date to become current 
    in order to proceed with the second step of the green card application. To check the cut-off date for people born in your country, please refer to: https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html
    </p>
    <p>&nbsp;</p>
    <P>For more information, you may also refer to the “Priority Date Information_How to know if your Priority Date is Current” and the “Adjustment of Status I-485 v. 
    Immigrant Visa Processing” under the Visa FAQ tab.</p>
    <p>&nbsp;</p>
    `,

    NIW2: `
    , and a separate invoice email for the premium processing fee of $2,805. <strong>If you will proceed with regular processing first, you do not need to pay the premium processing fee now.</strong> 
    <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Kindly ensure that your filing plan in regards to premium processing under section 
    1 of client record is up-to-date to avoid any confusion on our end</span>. <strong>We will have to be made clear about your filing plan well before filing so that the 
    actual filing plan we proceed with is consistent with your preference.</strong></p>
    <p>&nbsp;</p>
    `
}


console.log(addComma(1015));


//get whether user has further inquiry
let furtherInquiryInput = prompt("Unresolved inquiries?(Y or N)").toLowerCase();
let isFurtherInquiry = furtherInquiryInput === "y";

//get whether user has combo case
let caseSpecificInput = prompt("caseSpecific?(Y or N)").toLowerCase();
let isCaseSpecific = caseSpecificInput === "y";
let usersCase = "";
if(isCaseSpecific){
    usersCase = prompt("Please enter the case(NIW or EB1A)");
}

//get whether user has unpaid attorney fee
let attyFeePaidInput = prompt("Remaining fee paid? (Y or N)").toLowerCase();
let hasPaid = attyFeePaidInput === "y";
let remainingAttorneyFee = 0;
if(!hasPaid){
    remainingAttorneyFee = Number(prompt("How much?"));
}

//get whether user has opted for premium processing
let ppInput = prompt("Premium Processing? (Y or N)").toLowerCase();
let isPp = ppInput === "y";
if(isPp && usersCase == ""){
    usersCase = prompt('Please enter the case(NIW or EB1A)');
}


let customizedHTML = `
    <p>Now that your${userCaseCustomization(isCaseSpecific, usersCase)}petition letter is finalized, the${userCaseCustomization(isCaseSpecific, usersCase)}I-140 filing 
    fee${remainingAttyFeeCustomization.customization1(hasPaid)}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
    transfer, counter deposit, e-check, Stripe, or PayPal, etc.</p>
    <p>&nbsp;</p>
    <p>We'd like to remind you that as shown in our announcements, the newly released final rule on USCIS fee increases has taken effect on April 1, 2024. Petitions 
    postmarked on or after April 1, 2024 will be subject to new fees. According to the final rule, the filing fee itself has increased from $700 to $715. Additionally, 
    as updated (on April 3rd) on the USCIS's Frequently Asked Questions on the USCIS Fee Rule page (accessible <a href="https://www.uscis.gov/forms/filing-fees/frequently-
    asked-questions-on-the-uscis-fee-rule" target="_blank" rel="noopener">here</a>), USCIS confirms that an individual self-petitioner filing Form I-140 EB-1A or EB-2 NIW would 
    pay the reduced Asylum Program Fee of $300.</p>
    <p>&nbsp;</p>
    <p><em>*Note the Asylum Program Fee is not a fee required because you are filing an asylum program application. Rather, USCIS requires this fee to be paid by I-140 
    petitioners to offset their costs for the asylum program they have, which currently does not require its own filing fee. It does not mean that your case is associated 
    with an asylum application in any way.</em></p>
    <p>&nbsp;</p>
    ${niwPpTextCustomizations.niwPpTxt2(isPp, usersCase)}
    <p>For your convenience, we have sent you an invoice email with the combined amount of $${addComma(1015+remainingAttorneyFee)} (=${remainingAttyFeeCustomization.customization2(hasPaid,remainingAttorneyFee)}$715 filing fee + $300 asylum program fee)${niwPpTextCustomizations.niwPpTxt1(isPp, usersCase)}Please follow the instructions 
    attached to the invoice email and make a payment at your earliest convenience.</p>
    <p>&nbsp;</p>
    <p>Please note that Stripe charges a <strong>2% service fee</strong> for all credit/debit card transactions, and PayPal charges a <strong>2.5% service fee</strong> for all 
    transactions. If you have a U.S. bank account, you may also send an Electronic Check (ACH) payment via Stripe without any service fee. However, please be reminded that 
    it takes <span style="text-decoration: underline;"><strong>at least 4 business days</strong> to process the payment if you send an Electronic Check (ACH) payment via 
    Stripe, which could lead to possible delays in case filing, as we need to receive the payment in order to file the case.</span></p>
    <p>&nbsp;</p>
    <p>As a reminder, please ensure to include your order ID #${getOrderID()} in the memo/notes section if possible. After the payment is complete, please upload a receipt to 
    the "Additional Documents" section of your account for our verification purposes.</p>
    <p>&nbsp;</p>
    <p>After we receive your payment, we will issue the appropriate checks to U.S. Department of Homeland Security on your behalf and include them in your petition 
    package.&nbsp;</p>
    <p>&nbsp;</p>
    ${furtherInquiryCustomization(isFurtherInquiry)}

`
enterText(customizedHTML);