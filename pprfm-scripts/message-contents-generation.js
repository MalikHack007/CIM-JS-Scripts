
//IMPORT ADD COMMA UTILITY
import {addComma} from "../lib/UTILITIES/custom-utils.js";

export function generateFeeCollectionMessage(caseDetails, orderID){
    const filingFee = 715;

    const asylumFee = 300;

    const ppFee = 2805;

    const totalFilingFees = filingFee + asylumFee;

    const handleCaseDetails = {

        handleFFCredit: function(){
            if((!caseDetails.isFilingFeeCredit)){
                return "";
            }
            else{
                return ` - $${addComma(caseDetails.filingFeeCredit)} ${caseDetails.filingFeeCreditType}`;
            };
        },//KEEP

        handleCaseSpecific: function (){
            if (caseDetails.isCaseSpecific){
                return " "+caseDetails.usersCase+" "; 
            }
            else{
                return " ";
            }
        }, //KEEP
    
        handleUnpaidAttyFee: {
            firstPlace: function(){
                if(!caseDetails.hasPaid){
                    return " and the remaining attorney fee are both ";
                }
                else{
                    return " is ";
                }
            },
        
            secondPlace: function(){
                if(!caseDetails.hasPaid){
                    return `$${addComma(caseDetails.remainingAttorneyFee)} remaining attorney fee + `;
                }
                else{
                    return '';
                }
            } 
        }, //KEEP
    
        handlePP: {       
            handlePPInvoice: function(){
                const firstTimeDiscovering = ` we noticed in your client record that you plan to file the I-140 with a request for premium processing at 
                the same time. If so, `;
                const discussedAboutPPBefore = ` as you plan to file the I-140 with a request for premium processing at the same time, `;
                const ppFeeInvoiceMsg = `
                <P>Additionally,${caseDetails.ppInfoIsProvided ? discussedAboutPPBefore : firstTimeDiscovering}an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting 
                February 26, 2024).</p>
                <p>&nbsp;</p>
                `;
                if(caseDetails.isPp){
                    return ppFeeInvoiceMsg;
                }
                else{
                    return "";
                }
            }, //KEEP
    
            invoiceParagraph: function(){
                //#region DEFINITIONS    
    
                let ppInvoice = `, and a separate invoice email for the premium processing fee of $${addComma(ppFee)}. `;

                let ppInvoice2 = `<strong>If you will proceed with regular processing first, you do not need to pay the premium processing fee now.</strong>`;
                //#endregion

                //#region OPERATIONS
                if (caseDetails.isPp){
                    return {ppInvoice, ppInvoice2};
                }
    
                else{
                    ppInvoice = '. ';
                    ppInvoice2 = '';
                    return {ppInvoice, ppInvoice2};
                }
                //#endregion
            } //KEEP
    
        },
    
        handleFurtherInquiry: function(){
            const furtherInquiryText = `
            <p>&nbsp;</p>
            <p>We will respond to you further as soon as possible. Thank you!</p>
            `;

            const noFurtherInquiry = " Thank you!";

            const complaintText = `<p>Thank you for your message, we will respond further as soon as possible.</p><p>&nbsp;</p>`;

            let part1, part2, part3;

            //Unresolved inquiry and no pp
            if(caseDetails.isFurtherInquiry && !caseDetails.isPp){
                //complaint or no complaint?
                if(caseDetails.hasComplained){
                  part1 = complaintText;
                  part2 = noFurtherInquiry;
                  part3 = "";
                }
                else{
                  part1 = "";
                  part2 = "";  
                  part3 = furtherInquiryText;
                }
                
            }
            //Unresolved inquiry and PP
            else if (caseDetails.isFurtherInquiry && caseDetails.isPp){
                if(caseDetails.hasComplained){
                    part1 = complaintText;
                    part2 = noFurtherInquiry;
                    part3 = "";
                }
                else{
                    part1 = "";
                    part2 = noFurtherInquiry;
                    part3 = "";
                }
            }
            //Inquiries fully resolved
            else if(!caseDetails.isFurtherInquiry){
                part1 = "";
                part2 = noFurtherInquiry;
                part3 = "";
            }

            return {part1, part2, part3};
        } //KEEP
    };

    const customizedParagraphs = {
        part0:`
        ${handleCaseDetails.handleFurtherInquiry().part1}
        `, //UPDATED

        part1:`
        <p>Now that your${handleCaseDetails.handleCaseSpecific()}petition letter is finalized, the${handleCaseDetails.handleCaseSpecific()}I-140 filing 
        fee${handleCaseDetails.handleUnpaidAttyFee.firstPlace()}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
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

        part2: `${handleCaseDetails.handlePP.handlePPInvoice()}`,//UPDATED
        
        part3: `<p>For your convenience, we have sent you an invoice email with the combined amount of 
                $${addComma(totalFilingFees+caseDetails.remainingAttorneyFee-caseDetails.filingFeeCredit)} 
                (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace()}$${filingFee} filing fee + $${asylumFee} asylum program fee${handleCaseDetails.handleFFCredit()})${handleCaseDetails.handlePP.invoiceParagraph().ppInvoice}We accept payments via Zelle, wire transfer, counter deposit, 
                and credit card, etc. Please follow the instructions attached to the invoice email and make a payment 
                at your earliest convenience. ${handleCaseDetails.handlePP.invoiceParagraph().ppInvoice2}</P><p>&nbsp;</p>`,//UPDATED

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

        part5: `<p>Please note that we must receive the required fees before we can file the case.${handleCaseDetails.handleFurtherInquiry().part2}</p>${handleCaseDetails.handleFurtherInquiry().part3}` //UPDATED
                              
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
}

export function generatePPWarningMessage(caseDetails){
    //TODO: Add a new parameter to distinguish old from new.
    if(caseDetails.ppInfoIsProvided){
        return "";
    }
    const niwPT = 45;
    const eb1aPT = 15;
    const handleCaseDetails = {
        handlePT: function(){
            if(caseDetails.usersCase == "EB1A"){
                return eb1aPT;
            }
            else{
                return niwPT;
            }
        },
        ppStats: function(){
            const niwData = `:</p><p><br></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation">NIW premium processing increases the risk of an RFE or NOID by approximately 4–7%, and reduces the approval rate by about 4–5%.</p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation">83.3% of NIW denials we observed in early 2025 involved premium processing cases.</p></li></ul><p><br></p>`;
            const eb1aData = `, premium processing potentially reducing the EB1A approval rate by 5-10%.</p><p><br></p>`;
            if(caseDetails.usersCase == "EB1A"){
                return eb1aData;
            }
            else{
                return niwData;
            }
        },

        serviceCenterRelatedInfo: function(){
            const nscNIW = `<p>If you still decide to request premium processing for your NIW case after knowing the risk, we recommend filing to the Nebraska Service Center (NSC) under regular processing first. After you receive the receipt notice, you may upgrade to premium processing. Our data shows that for NIW cases filed to NSC, the strategy of upgrading to premium processing after the receipt notice yields higher approval rates compared to submitting an upfront premium processing request. Please note that we do not have a specific recommended timeframe for when to upgrade after receiving the receipt notice; the decision is entirely up to you.</p><p>&nbsp;</p>`;
            const tscNIW = `<p>If your NIW petition can only be filed to the Texas Service Center (TSC) and cannot be routed to Nebraska Service Center (NSC), and you still decide to proceed with premium processing after knowing the risk, then we recommend submitting the premium processing request directly. Our data shows that for NIW cases filed to TSC, those that include an upfront PP request have a higher approval rate than those that upgrade to PP at a later stage.</p><p>&nbsp;</p>`;
            if(caseDetails.usersCase == "NIW"){
                if(caseDetails.serviceCenter == "Texas Service Center"){
                    return tscNIW;
                }
                else{
                    return nscNIW;
                }
            }
            else{
                return "";
            }
        },

        pdAndCOBSpecificWarning: function(){
            const clientPacketInfo = `<p>For more information, you may also refer to the "Priority Date Information_How to know if your Priority Date is Current", "Q_A for Premium Processing Service Expansion of EB2-NIW_ I-765_ I-539", and the "Adjustment of Status I-485 v. Immigrant Visa Processing" under the Visa FAQ tab. You may also refer to our recent announcement about the Visa Bulletin. Please note that the FAQ documents provided in our system are intended for general informational purposes only and do not constitute legal advice. If you have any questions after reading the FAQs, please do not hesitate to reach out to your attorneys so that we can advise you accordingly based on your specific situations.</p><p>&nbsp;</p>`;
            const pdNotCurrentNIW = `<p dir="ltr">As a reminder, requesting Premium Processing Service can only shorten the processing time of your I-140 petition. It does not affect your priority date. Your priority date should be approximately the date USCIS received your I-140 petition. Your priority date is NOT the date USCIS approves your petition. Having the I-140 approval through Premium Processing Service will not expedite the wait time for your priority date to become current.&nbsp;</p><p><span id="docs-internal-guid-9eebe264-7fff-907c-add6-34bdce609692"><br>After your I-140 is approved, even with Premium Processing, you will still need to wait for your priority date to become current in order to proceed with the I-485 or the Immigrant Visa Processing. To check the priority date for people born in your country, please refer to the <a data-mce-href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener">Visa Bulletin</a>.&nbsp;</span><br data-mce-bogus="1"></p><p>&nbsp;</p>`;
            const pdNotCurrentEB1A = `<p>Also, EB-1 priority dates are not “Current” for applicants born in ${caseDetails.countryOfBirth}, without a clear indication of when the EB-1 priority dates will again become “Current”. If you do not have a priority date earlier than the cut-off date listed on the Visa Bulletin, then you would not be able to proceed with the next step of the green card application even if you receive an I-140 approval on the premium processing timeline. Whether or not you use premium processing, your priority date is set by your date of filing, not by your date of approval. As such, your priority date is not impacted by your decision to use either Premium or Regular Processing. </p><p>&nbsp;</p>`;
            if(caseDetails.usersCase == 'EB1A'){
                if(caseDetails.countryOfBirth == "China" || caseDetails.countryOfBirth == "India"){
                    return pdNotCurrentEB1A + clientPacketInfo;
                }
                else{
                    return "";
                }
            }
            else if(caseDetails.usersCase == 'NIW'){
                if(!caseDetails.priorityDateIsCurrent){
                    return pdNotCurrentNIW + clientPacketInfo;
                }
                else{
                    return "";
                }
            }
        },

        ptInfoAndNiv: function(){
            const ptNSC = 14;
            const ptTSC = 15;
            const eb1aNotCurrentAdd = `You can choose to file using Premium Processing at a later date should retrogression end before a decision has been reached on your I-140 petition. `;
            const ptInfo = `<p>${!caseDetails.priorityDateIsCurrent ? eb1aNotCurrentAdd : ""}For your information, without premium processing, the EB1A processing time at ${caseDetails.serviceCenter} is around ${caseDetails.serviceCenter=='Texas Service Center' ? ptTSC : ptNSC} months according to the USCIS processing time website.</p><p>&nbsp;</p>`;
            const h1bReminder = ` For instance, if you require an I-140 approval to extend your H-1B beyond the six-year cap and you do not have other I-140 pending/approved, you may still wish to request premium processing. If this applies, please update us as to your plans regarding your nonimmigrant status and we can advise accordingly.`;
            const nivReminder = `<p>Please note that it remains very important to maintain your non-immigrant status throughout the whole process.${caseDetails.h1bIsExpiring ? h1bReminder : ""}</p><p>&nbsp;</p>`
            if(caseDetails.usersCase == 'EB1A'){
                return ptInfo + nivReminder;
            }   
            else{
                return "";
            }
        },

        handleFurtherInquiry: function(){
            if(caseDetails.isFurtherInquiry){
                if(caseDetails.hasComplained){
                    return "<p>Thank you!</p>";
                }
                else{
                    return "<p>We will respond to you further as soon as possible. Thank you!</p>";
                }
            }
            else{
                return "<p>Thank you!</p>";
            }
        }
    };

    const customizedParagraphs = {
        part0: ` <p>We would like to update you regarding your plan to use premium processing service for your ${caseDetails.usersCase}.</p><p>&nbsp;</p><p><em><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;"><strong>If we do not consider other case-specific factors, our 2025 data shows that ${caseDetails.usersCase} cases filed with premium processing tend to receive more Requests for Evidence (RFEs) and have slightly lower approval rates compared to those filed under regular processing.</strong></span></em></p><p>&nbsp;</p>`,

        part1: `<p>Because USCIS is required to take action within ${handleCaseDetails.handlePT()} business days for ${caseDetails.usersCase} premium processing cases, officers may issue templated RFEs to buy time, rather than conducting a thorough initial review. Based on our internal observations${handleCaseDetails.ppStats()}`,
        
        part2: `<p dir="ltr">Moreover, we have increasingly seen USCIS issue RFEs containing serious factual errors, including:</p><p><br></p><p dir="ltr">-Incorrect field of expertise</p><p dir="ltr">-Wrong gender reference</p><p dir="ltr">-Misspelled or incorrect name</p><p dir="ltr">-Misstated or completely incorrect proposed endeavor</p><p><br></p><p dir="ltr">These issues likely result from template-driven RFEs generated under time pressure, especially in premium processing cases. While we will address and correct such mistakes in our response, it highlights the added risks associated with requesting premium processing.</p><p><br></p><p dir="ltr">Given these, we strongly advise against requesting premium processing at this time.</p><p>&nbsp;</p>`,

        part3: `${handleCaseDetails.serviceCenterRelatedInfo()}`,

        part4: `${handleCaseDetails.pdAndCOBSpecificWarning()}`,

        part5: `${handleCaseDetails.ptInfoAndNiv()}`,

        part6: `<p><span id="docs-internal-guid-a04b8627-7fff-0f62-5234-6db72f07f038">Please confirm if you would like to proceed with regular processing or premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before filing so that the actual filing plan we proceed with is consistent with your preference.</strong></span><br data-mce-bogus="1"></p><p>&nbsp;</p>`,

        part7: `${handleCaseDetails.handleFurtherInquiry()}`
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
}