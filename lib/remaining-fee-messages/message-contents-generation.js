//TODO needs order ID


export function generateFeeCollectionMessage(caseDetailHandler){
    const customizedParagraphs = {
        part0:`
        ${caseDetailHandler.handleComplaints()}
        `, //UPDATED

        part1:`
        <p>Now that your${caseDetailHandler.handleCaseSpecific()}petition letter is finalized, the${caseDetailHandler.handleCaseSpecific()}I-140 filing 
        fee${caseDetailHandler.handleUnpaidAttyFee.firstPlace()}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
        transfer, counter deposit, e-check, Stripe, or PayPal, etc.</p>

        <p>&nbsp;</p>

        <p>We'd like to remind you that as shown in our announcements, the newly released final rule on USCIS fee increases has taken effect on April 1, 2024. Petitions 
        postmarked on or after April 1, 2024 will be subject to new fees. According to the final rule, the filing fee itself has increased from $700 to $715. Additionally, 
        as updated on the USCIS's Frequently Asked Questions on the USCIS Fee Rule page (accessible <a href="https://www.uscis.gov/forms/filing-fees/frequently-asked-questions-on-the-uscis-fee-rule" target="_blank" rel="noopener">here</a>), USCIS confirms that an individual self-petitioner filing Form I-140 EB-1A or EB-2 NIW would 
        pay the reduced Asylum Program Fee of $300.</p>

        <p>&nbsp;</p>

        <p><em>*Note the Asylum Program Fee is not a fee required because you are filing an asylum program application. Rather, USCIS requires this fee to be paid by I-140 
        petitioners to offset their costs for the asylum program they have, which currently does not require its own filing fee. It does not mean that your case is associated 
        with an asylum application in any way.</em></p>

        <p>&nbsp;</p>
        `, //UPDATED

        part2: `${caseDetailHandler.handlePP.handlePPInvoice()}`,//UPDATED
        
        part3: `${caseDetailHandler.handlePP.invoiceParagraph()}`,//UPDATED

        part4: `
        <p>Please note that Stripe charges a <strong>2% service fee</strong> for all credit/debit card transactions, and PayPal charges a <strong>2.5% service fee</strong> for all 
        transactions. If you have a U.S. bank account, you may also send an Electronic Check (ACH) payment via Stripe without any service fee; however, please be reminded that 
        it takes <span style="text-decoration: underline;"><strong>at least 4 business days</strong> to process e-check payments, which could lead to possible delays in case filing, 
        as we need to receive the payment in order to file the case.
        </span></p>
        <p>&nbsp;</p>
        <p>As a reminder, please ensure to include your order ID #${orderID} in the memo/notes section if possible. After the payment is complete, please upload a receipt to 
        the "Additional Documents" section of your account for our verification purposes.</p>
        <p>&nbsp;</p>
        <p>After we receive your payment, we will issue the appropriate checks to U.S. Department of Homeland Security on your behalf and include them in your petition 
        package.</p>
        <p>&nbsp;</p>
        `, //UPDATED

        part5: `${caseDetailHandler.handleFurtherInquiry()}` //UPDATED
                              
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
}

export function generatePPWarningMessage(caseDetailHandler){
    const customizedParagraphs = {
        part0:`
        ${caseDetailHandler.handleComplaints()}
        `,

        part1:`
        <p>Now that your${caseDetailHandler.handleCaseSpecific()}petition letter is finalized, the${caseDetailHandler.handleCaseSpecific()}I-140 filing 
        fee${caseDetailHandler.handleUnpaidAttyFee.firstPlace()}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
        transfer, counter deposit, e-check, Stripe, or PayPal, etc.</p>
        <p>&nbsp;</p>
        <p>We'd like to remind you that as shown in our announcements, the newly released final rule on USCIS fee increases has taken effect on April 1, 2024. Petitions 
        postmarked on or after April 1, 2024 will be subject to new fees. According to the final rule, the filing fee itself has increased from $700 to $715. Additionally, 
        as updated (on April 3rd) on the USCIS's Frequently Asked Questions on the USCIS Fee Rule page (accessible <a href="https://www.uscis.gov/forms/filing-fees/frequently-asked-questions-on-the-uscis-fee-rule" target="_blank" rel="noopener">here</a>), USCIS confirms that an individual self-petitioner filing Form I-140 EB-1A or EB-2 NIW would 
        pay the reduced Asylum Program Fee of $300.</p>
        <p>&nbsp;</p>
        <p><em>*Note the Asylum Program Fee is not a fee required because you are filing an asylum program application. Rather, USCIS requires this fee to be paid by I-140 
        petitioners to offset their costs for the asylum program they have, which currently does not require its own filing fee. It does not mean that your case is associated 
        with an asylum application in any way.</em></p>
        <p>&nbsp;</p>
        `,

        part2: `${caseDetailHandler.handlePP.ppWarnings()}`,
        
        part3: `${caseDetailHandler.handlePP.invoiceParagraph()}`,
        //CHANGE*
        part4: `
        <p>Please note that Stripe charges a <strong>2% service fee</strong> for all credit/debit card transactions, and PayPal charges a <strong>2.5% service fee</strong> for all 
        transactions. If you have a U.S. bank account, you may also send an Electronic Check (ACH) payment via Stripe without any service fee. However, please be reminded that 
        it takes <span style="text-decoration: underline;"><strong>at least 4 business days</strong> to process the payment if you send an Electronic Check (ACH) payment via 
        Stripe, which could lead to possible delays in case filing, as we need to receive the payment in order to file the case.</span></p>
        <p>&nbsp;</p>
        <p>As a reminder, please ensure to include your order ID #${orderID} in the memo/notes section if possible. After the payment is complete, please upload a receipt to 
        the "Additional Documents" section of your account for our verification purposes.</p>
        <p>&nbsp;</p>
        <p>After we receive your payment, we will issue the appropriate checks to U.S. Department of Homeland Security on your behalf and include them in your petition 
        package.&nbsp;</p>
        <p>&nbsp;</p>
        `,

        part5: `${caseDetailHandler.handleFurtherInquiry()}`
                              
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
}