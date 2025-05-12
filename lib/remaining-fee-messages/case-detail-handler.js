//NEED TO IMPORT ADD COMMA UTILITY HERE.


export function caseDetailsHandler(caseDetails){
    const handleCaseDetails = {
        handleCaseSpecific: function (){
            if (caseDetails.isCaseSpecific){
                return " "+caseDetails.usersCase+" "; 
            }
            else{
                return " ";
            }
        },
    
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
        },
    
        handlePP: {       
            handlePPInvoice: function(){
                const ppFeeInvoiceMsg = `
                <P>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at 
                the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting 
                February 26, 2024).</p>
                <p>&nbsp;</p>
                `;
                if(caseDetails.isPp){
                    return ppFeeInvoiceMsg;
                }
                else{
                    return "";
                }
            },

            //addressing the PP Warning Part
            ppWarnings: function(){

                //#region DEFINITIONS
                const handlePortedPD = {
                    placeHolder1: function (){
                        if(!caseDetails.anotherPriorityDate){
                            return ", ";
                        }
    
                        else{
                            if(caseDetails.isOtherPDApproved){
                                return ` (in your case, your priority date will be the one ported through your approved ${caseDetails.earlierCaseType}, which is ${caseDetails.exactPriorityDate}), `;
                            }
    
                            else{
                                return ` (in your case, your priority date will be the one ported through your ${caseDetails.earlierCaseType} once approved, which is ${caseDetails.exactPriorityDate}), `;
                            }
                        };
                    },
    
                    placeHolder2: function(){
                        if(!caseDetails.anotherPriorityDate){
                            return ". ";
                        }
    
                        else{
                            return " until your priority date becomes current. ";
                        };
                    }
                };
                
                function handleVisaStatus(){
                    if(caseDetails.isInsideUS && caseDetails.h1bIsExpiring){
                        return `<p>Please note that it remains very important to maintain your non-immigrant status throughout the whole process. For instance, if you require an I-140 approval to extend your H-1B beyond the six-year cap and you do not have other I-140 pending/approved, you may still wish to request premium processing. If this applies, please update us as to your plans regarding your nonimmigrant status and we can advise accordingly.
                                </p><p><br></p>`;
                    }
                    else if (caseDetails.isInsideUS && (!caseDetails.h1bIsExpiring)){
                        return `<p>Please note that it remains very important to maintain your non-immigrant status throughout the whole process.</p><p><br></p>`;
                    }
                    else if ((!caseDetails.isInsideUS)){
                        return "";
                    };
                };
    
                //For info not provided
                const ppWarningNIW = `
                  <p>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
                  <p>&nbsp;</p>
                  <p>We would like to update you regarding your plan to use premium processing service for your NIW. </p>
                  <p>&nbsp;</p>
                  <p>If we do not consider other case-specific factors, NIW cases that requested premium processing have a lower approval rate and a higher RFE rate based on our most recent observation. It appears that more USCIS officers are rushing through case adjudications and issuing templated RFE/NOIDs to meet the premium processing deadlines.</p>
                  <p>&nbsp;</p>
                  <p>Given this, we strongly advise against requesting premium processing at this time.</p>
                  <p>&nbsp;</p>
                  <p>While filing without premium processing may extend the adjudication timeline, the data consistently shows that non-PP filings have better outcomes. We strongly suggest that you prioritize approval strength over speed, particularly if your case does not face an urgent timing issue. </p>
                  <p>&nbsp;</p>
                  <p>Please also be reminded that requesting Premium Processing Service can only shorten the processing time of your I-140 petition. It does not affect your priority date. Your priority date should be approximately the date USCIS receives your I-140 petition, NOT the date USCIS approves your petition. Having the I-140 approval through Premium Processing Service will not expedite the wait time for your priority date to become current. You will still need to wait for your priority date to become current in order to proceed with the second step of the green card application. To check the cut-off date for people born in your country, please refer to: <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html">https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html</a></p>
                  <p>&nbsp;</p>
                  <p>For more information, you may also refer to the “Priority Date Information_How to know if your Priority Date is Current” and the “Adjustment of Status I-485 v. Immigrant Visa Processing” under the Visa FAQ tab.</p>
                  <p>&nbsp;</p>                
                `;
    
                const ppWarningEB1ACINotCurrent = `
                <p>In addition, we noticed in your client record that you plan to file I-140 with request of premium processing at the 
                same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to  
                $2,805 starting February 26, 2024). However, we would like to update you regarding your plan to file your EB1A using 
                Premium Processing. We wanted to make you aware of the below points that could make Regular Processing a better option 
                for your case at this time.</p><p><br></p><p>1.&nbsp; <span style="text-decoration: underline;" data-mce-style="text-decoration: 
                underline;"><strong>If we do not consider other case-specific factors, EB1A cases filed with premium processing have a 
                lower approval rate and a higher RFE rate based on our most recent observation.</strong></span> Since USCIS must take 
                action on the EB1A case within 15 business days of receiving the premium processing request, it seems that they are more 
                likely to issue RFEs just to give them more time. As such, you should weigh the benefit of having your case adjudicated in 
                15 business days against the chance of receiving RFE/NOIDs. Our hope is that this is a temporary trend, and by waiting to 
                have your case adjudicated under regular processing you will avoid the tougher standard of adjudication.</p><p><br></p><p>
                2.&nbsp; EB-1 priority dates are retrogressed for ${caseDetails.countryOfBirth}, without a clear indication of precisely when priority 
                dates will again be current. As such, even if you receive an I-140 approval on the 15 business days premium processing 
                timeline, you would not be able to take action based on your I-140 approval${handlePortedPD.placeHolder2()}Whether or not you file using premium 
                processing, your priority date is set by your date of filing${handlePortedPD.placeHolder1()}not by your date of approval. As such, your priority date is 
                not impacted by your decision to use either Premium or Regular Processing.</p><p><br></p><p>You can choose to file using 
                Premium Processing at a later date should retrogression end before a decision has been reached on your I-140 petition. For 
                your information, without premium processing, the EB1A processing time at ${caseDetails.serviceCenter} is around ${caseDetails.processingTime} 
                months according to the USCIS processing time website.&nbsp;</p><p><br></p>${handleVisaStatus()}<p>Please confirm if you would like to 
                proceed with regular processing or premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before filing so that the actual filing plan we proceed with is consistent with your preference.</strong>
                </p>
                <p>&nbsp;</p>                
                `;
    
                const ppWarningEB1ACICurrentOrROW = `
                <p>In addition, we noticed in your client record that you plan to file I-140 with request of premium processing 
                at the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the 
                fee from $2,500 to $2,805 starting February 26, 2024). However, we would like to update you regarding your plan 
                to file your EB1A using Premium Processing. We wanted to make you aware of the below information that could make 
                Regular Processing a better option for your case at this time.</p><p><br></p><p><span style="text-decoration: 
                underline;" data-mce-style="text-decoration: underline;"><em><strong>If we do not consider other case-specific 
                factors, EB1A cases filed with premium processing have a lower approval rate and a higher RFE rate based on our 
                most recent observation.</strong></em></span> Since USCIS must take action on the EB1A case within 15 business days of 
                receiving the premium processing request, it seems that they are more likely to issue RFEs just to give them 
                more time. As such, you should weigh the benefit of having your case adjudicated in 15 business days against 
                the chance of receiving RFE/NOIDs. Our hope is that this is a temporary trend, and by waiting to have your 
                case adjudicated under regular processing you will avoid the tougher standard of adjudication.</p><p><br></p>
                <p>For your information, without premium processing, the EB1A processing time at ${caseDetails.serviceCenter} is 
                around ${caseDetails.processingTime} months according to the USCIS processing 
                time website.&nbsp;</p><p><br></p>${handleVisaStatus()}<p>Please confirm if you would like to proceed with regular processing or 
                premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">
                ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to 
                avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before 
                filing so that the actual filing plan we proceed with is consistent with your preference.</strong></p>
                <p>&nbsp;</p>
                `;
    
                const ppWarningInfoProvided = `
                <P>Additionally, we noticed in your client record that you plan to file the I-140 with a request for premium processing at 
                the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting 
                February 26, 2024).</p>
                <p>&nbsp;</p>
                `;
    
                //#endregion


                //#region OPERATIONS
                if(!caseDetails.isPp){
                    return "";
                }
                //if NIW
                else if(caseDetails.usersCase == "NIW"){
                    //info has not been provided
                    if(!caseDetails.ppInfoIsProvided){
                        return ppWarningNIW;
                    }
                    //info has been provided
                    else if(caseDetails.ppInfoIsProvided){
                        return ppWarningInfoProvided;
                    };
                }
                //if EB1A
                else if(caseDetails.usersCase == "EB1A"){
                    //if info provided
                    if(caseDetails.ppInfoIsProvided){
                        return ppWarningInfoProvided;
                    }
                    //if info not provided
                    else if((!caseDetails.ppInfoIsProvided)){
                        //if from ROW, does not matter their PD is current or not, canned msg does not address PD at all. 
                        if(caseDetails.countryOfBirth == "ROW"){
                            return ppWarningEB1ACICurrentOrROW;
                        }
                        //if PD Current, it DOES NOT matter which country they are from
                        else if(caseDetails.priorityDateIsCurrent){
                            return ppWarningEB1ACICurrentOrROW;
                        }
                        //If PD IS NOT CURRENT
                        else if((!caseDetails.priorityDateIsCurrent) && ["China", "India"].includes(caseDetails.countryOfBirth)){
                            return ppWarningEB1ACINotCurrent;
                        };
                    };
                    
                };
                //#endregion
            },
    
            invoiceParagraph: function(){
                //#region DEFINITIONS    
                function handleFFCredit(){
                    if((!caseDetails.isFilingFeeCredit)){
                        return "";
                    }
                    else{
                        return ` - $${addComma(caseDetails.filingFeeCredit)} ${caseDetails.filingFeeCreditType}`;
                    };
                };
    
                const noPPInvoice = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of 
                $${addComma(totalFilingFees+caseDetails.remainingAttorneyFee-caseDetails.filingFeeCredit)} 
                (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace()}$${filingFee} filing fee + $${asylumFee} 
                asylum program fee${handleFFCredit()}). We accept payments via Zelle, wire transfer, counter deposit, 
                and credit card, etc. Please follow the instructions attached to the invoice email and make a payment 
                at your earliest convenience.
                </p>
                <p>&nbsp;</p>
                `;
    
                const ppInvoice = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of 
                $${addComma(totalFilingFees+caseDetails.remainingAttorneyFee-caseDetails.filingFeeCredit)} 
                (=${this.handleUnpaidAttyFee.secondPlace()}$${filingFee} filing fee + $${asylumFee} asylum program fee${handleFFCredit()}), 
                and a separate invoice email for the premium processing fee of $${addComma(ppFee)}. We accept payments via Zelle, 
                wire transfer, counter deposit, and credit card, etc. Please follow the instructions attached to the invoice email and 
                leave a message after you have initiated the payment(s).<strong>If you will proceed with regular processing first, you do not need to pay the 
                premium processing fee now.</strong>
                </p>

                <p>&nbsp;</p>
                `;
                //#endregion

                //#region OPERATIONS
                if (caseDetails.isPp){
                    return ppInvoice;
                }
    
                else{
                    return noPPInvoice;
                }
                //#endregion
            }
    
        },
    
        handleFurtherInquiry: function(){
            const furtherInquiryText = `
            <p>Please note that we must receive the required fees before we can file the case.</p>
            <p>&nbsp;</p>
            <p>We will respond to you further as soon as possible. Thank you!</p>
            `;
            const noFurtherInquiry = "<p>Please note that we must receive the required fees before we can file the case. Thank you!</p>"
            if(caseDetails.isFurtherInquiry){
                if(caseDetails.hasComplained){
                  return noFurtherInquiry;
                }
                else{
                  return furtherInquiryText;
                }
                
            }
            else{
                return noFurtherInquiry;
            }
        },
    
        handleComplaints: function(){
            if(caseDetails.hasComplained){
                return `<p>Thank you for your message, we will respond further as soon as possible.</p>
                        <p>&nbsp;</p>`;
            }
    
            else{
                return "";
            };
        }
    };

    return handleCaseDetails;
}

