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

enterText(`
    <p>Now that your petition letter is finalized, the I-140 filing fee is due at this time. Instead of mailing a check, please make your payment to us online using Zelle, wire transfer, counter deposit, e-check, Stripe, or PayPal, etc.</p>
    
    <p><br></p>
    
    <p>We'd like to remind you that as shown in our announcements, the newly released final rule on USCIS fee increases has taken effect on April 1, 2024. Petitions postmarked on or after April 1, 2024 will be subject to new fees. According to the final rule, the filing fee itself has increased from $700 to $715. Additionally, as updated (on April 3rd) on the USCIS's Frequently Asked Questions on the USCIS Fee Rule page (accessible <a data-mce-href="https://www.uscis.gov/forms/filing-fees/frequently-asked-questions-on-the-uscis-fee-rule" href="https://www.uscis.gov/forms/filing-fees/frequently-asked-questions-on-the-uscis-fee-rule" target="_blank" rel="noopener">here</a>), USCIS confirms that an individual self-petitioner filing Form I-140 EB-1A or EB-2 NIW would pay the reduced Asylum Program Fee of $300.</p>
    
    <p><br></p>
    
    <p><em>*Note the Asylum Program Fee is not a fee required because you are filing an asylum program application. Rather, USCIS requires this fee to be paid by I-140 petitioners to offset their costs for the asylum program they have, which currently does not require its own filing fee. It does not mean that your case is associated with an asylum application in any way.</em></p>
    
    <p><br></p>
    
    <p>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
    
    <p>&nbsp;</p>
    
    <p>Please be reminded that requesting Premium Processing Service can only shorten the processing time of your I-140 petition. It does not affect your priority date. Your priority date should be approximately the date USCIS receives your I-140 petition, NOT the date USCIS approves your petition. Having the I-140 approval through Premium Processing Service will not expedite the wait time for your priority date to become current. You will still need to wait for your priority date to become current in order to proceed with the second step of the green card application. To check the cut-off date for people born in your country, please refer to: <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank">Visa Bulletin</a></p>
    
    <p>&nbsp;</p>
    
    <p>For more information, you may also refer to the “Priority Date Information_How to know if your Priority Date is Current” and the “Adjustment of Status I-485 v. Immigrant Visa Processing” under the Visa FAQ tab.</p>
    
    <p>&nbsp;</p>
    
    <p>For your convenience, we have sent you an invoice email for the combined amount of $1,015 (=$715 filing fee + $300 asylum program fee), and a separate invoice email for the premium processing fee of $2,805. <strong>If you will proceed with regular processing first, you do not need to pay the premium processing fee now.</strong> <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Kindly ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to avoid any confusion on our end</span>. <strong>We will have to be made clear about your filing plan well before filing so that the actual filing plan we proceed with is consistent with your preference.</strong></p>
    
    <p><br></p>
    
    <p>Please note that Stripe charges a <strong>2% service fee</strong> for all credit/debit card transactions, and PayPal charges a <strong>2.5% service fee</strong> for all transactions. If you have a U.S. bank account, you may also send an Electronic Check (ACH) payment via Stripe without any service fee. However, please be reminded that it takes <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;"><strong>at least 4 business days</strong> to process the payment if you send an Electronic Check (ACH) payment via Stripe, which could lead to possible delays in case filing, as we need to receive the payment in order to file the case.</span></p>
    
    <p>&nbsp;</p>
    
    <p>As a reminder, please ensure to include your order ID #_____ in the memo/notes section if possible, and after the payment is complete, please upload a receipt to the "Additional Documents" section of your account for our verification purposes.</p>
    
    <p><br data-mce-bogus="1"></p>
    
    <p>After we receive your payment, we will issue the appropriate checks to U.S. Department of Homeland Security on your behalf and include them in your petition package.&nbsp;</p>
    
    <p>&nbsp;</p>
    
    <p>Please note that we must receive the required fees before we can file the case. Thank you.</p>
  `);
  


