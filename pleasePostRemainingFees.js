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

//CAN ONLY HANDLE 4-DIGIT NUMBERS
function addComma(number){
    numString = number.toString();
    if (numString.length == 4){
        numString = numString[0]+','+numString[1]+numString[2]+numString[3];
    }
    return numString;
}

function customizedMessage(){
    let finalDetails = {
        isCaseSpecific: false,
        usersCase: "", 
        hasPaid: false, 
        remainingAttorneyFee: 0, 
        isPp: false, 
        ppInfoIsProvided: false, 
        isInsideUS: false, 
        anotherPriorityDate: false, 
        exactPriorityDate: "N/A",
        countryOfBirth: "N/A", 
        priorityDateIsCurrent: false, 
        h1bIsExpiring: false, 
        serviceCenter: "N/A", 
        processingTime: "N/A", 
        isFurtherInquiry: false
    };
    
    function updateAllCaseDetails(){
        //unpack all the details
        let {isCaseSpecific,
            usersCase, 
            hasPaid, 
            remainingAttorneyFee, 
            isPp, 
            ppInfoIsProvided, 
            isInsideUS, 
            anotherPriorityDate, 
            exactPriorityDate,
            countryOfBirth, 
            priorityDateIsCurrent, 
            h1bIsExpiring, 
            serviceCenter, 
            processingTime, 
            isFurtherInquiry} = finalDetails; 
        //case specific

        function updateCSDetails(){
            const caseSpecificInput = prompt("caseSpecific?(Y or N)").toLowerCase();
            isCaseSpecific = caseSpecificInput === "y";
            if(isCaseSpecific){
                usersCase = prompt("Please enter the case(NIW or EB1A)");
            }
        };

        updateCSDetails();

        //remaining atty fee
        function updateAttyFeeDetails(){
            const attyFeePaidInput = prompt("Remaining fee paid? (Y or N)").toLowerCase();
            hasPaid = attyFeePaidInput === "y";
            if(!hasPaid){
                remainingAttorneyFee = Number(prompt("How much?"));
            }
        };

        updateAttyFeeDetails();

        //further inquiry
        function updateFurtherInquiryDetails(){
            const furtherInquiryInput = prompt("Unresolved inquiries?(Y or N)").toLowerCase();
            isFurtherInquiry = furtherInquiryInput === "y";
        };

        updateFurtherInquiryDetails();

        //Premium Processing
        function updatePPDetails(){
            const ppInput = prompt("Premium Processing? (Y or N)").toLowerCase();
            isPp = ppInput === "y";

            // let finalRelevantPPDetails = {isPp, ppInfoIsProvided, isInsideUS, anotherPriorityDate, exactPriorityDate, countryOfBirth, priorityDateIsCurrent, h1bIsExpiring, serviceCenter, processingTime};
            
            function updateEB1APPWarningDetails (){
                //all the info we need for posting EB1A warning msg
                countryOfBirth = prompt('Please enter country of birth(China, India, or ROW)');
                const isInsideUSInput = prompt('Is the client inside the US? (y/n)').toLowerCase();
                isInsideUS = isInsideUSInput == "y";
                //if the client is inside the US, ask for their current visa status
                if(isInsideUS){
                    let h1bIsExpiringInput = prompt('Is h1b? If so is it expiring within 1.5 years? (y/n)').toLowerCase();
                    h1bIsExpiring = h1bIsExpiringInput == "y";
                }
                serviceCenter = prompt("Which service center? (Texas Service Center or Nebraska Service Center)");
                processingTime = prompt("How many months?");
                if(countryOfBirth == "China" || countryOfBirth == "India"){
                    let priorityDateInput = prompt("Is there a current PD?(y/n)").toLowerCase();
                    priorityDateIsCurrent = priorityDateInput == "y";
                    //if it's not current, ask for if there is another PD
                    if(!priorityDateIsCurrent){
                        const anotherPriorityDateInput = prompt("Another PD?(Y or N)").toLowerCase();
                        anotherPriorityDate = anotherPriorityDateInput == "y";
                        //if there is another PD, ask for the date and return all details collected so far.
                        if(anotherPriorityDate){
                            exactPriorityDate = prompt("Please enter the PD(yyyy-mm-dd)");
                        }
                        //if there isn't another PD, update is finished.
                    }
                    //if it's current, update is finished.
                }
                //if the client is not from China or India, update is finished.
            };

            if(isPp){
                if(usersCase == ""){
                    usersCase = prompt('Please enter the case(NIW or EB1A)');
                    //if the case is EB1A, get details.
                    if(usersCase == "EB1A"){
                        //see if pp info has already been provided
                        const ppInfoProvidedInput = prompt("PP info provided? (Y or N)").toLowerCase();
                        ppInfoIsProvided = ppInfoProvidedInput == "y";
                        //dictate whether further updates are needed.
                        if(!ppInfoIsProvided){
                            updateEB1APPWarningDetails();
                        }
                        //else the update is finished

                    };                
                }

                else{
                    if(usersCase == "EB1A"){
                        //see if pp info has already been provided
                        const ppInfoProvidedInput = prompt("PP info provided? (Y or N)").toLowerCase();
                        ppInfoIsProvided = ppInfoProvidedInput == "y";
                        //dictate whether the next questions are asked
                        if(!ppInfoIsProvided){
                            updateEB1APPWarningDetails();
                        }
                        //else the update is finished
                    }
                };
            };
            //else the update is finished
        };

        updatePPDetails();

        //re-assign all the details back to final details
        finalDetails = {isCaseSpecific, usersCase, hasPaid, remainingAttorneyFee, isPp, ppInfoIsProvided, isInsideUS, anotherPriorityDate, exactPriorityDate, countryOfBirth, priorityDateIsCurrent, h1bIsExpiring, serviceCenter, processingTime, isFurtherInquiry};
    };

    updateAllCaseDetails();

    const handleCaseDetails = {
        handleCaseSpecific: function (isCaseSpecific, usersCase){
            if (isCaseSpecific){
                return " "+usersCase+" "; 
            }
            else{
                return " ";
            }
        },

        handleUnpaidAttyFee: {
            firstPlace: function(hasPaid){
                if(!hasPaid){
                    return " and the remaining attorney fee are both ";
                }
                else{
                    return " is ";
                }
            },
        
            secondPlace: function(hasPaid, remainingAttorneyFee){
                if(!hasPaid){
                    return `$${addComma(remainingAttorneyFee)} remaining attorney fee + `;
                }
                else{
                    return '';
                }
            } 
        },

        handlePP: {
            firstPlace: function(isPp, usersCase, countryOfBirth, priorityDateIsCurrent, h1bIsExpiring, serviceCenter, processingTime){
                const firstPlaceNIWPP = `
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
                `;

                const firstPlaceNIWandEB1APPInfoProvided = `
                <P>Additionally, as you plan to file the I-140 with a request for premium processing at the same time, an additional 
                $2,805 for the premium processing fee is also due (USCIS increased the fee from $2,500 to $2,805 starting February 26, 2024).</p>
                <p>&nbsp;</p>
                `;

                // const firstPlaceEB1A

                const firstPlaceEB1APPCNNotCurrent = `
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
                2.&nbsp; EB-1 priority dates are retrogressed for ${countryOfBirth}, without a clear indication of precisely when priority 
                dates will again be current. As such, even if you receive an I-140 approval on the 15 business days premium processing 
                timeline, you would not be able to take action based on your I-140 approval. Whether or not you file using premium 
                processing, your priority date is set by your date of filing, not by your date of approval. As such, your priority date is 
                not impacted by your decision to use either Premium or Regular Processing.</p><p><br></p><p>You can choose to file using 
                Premium Processing at a later date should retrogression end before a decision has been reached on your I-140 petition. For 
                your information, without premium processing, the EB1A processing time at ${serviceCenter} is around ${processingTime} 
                months according to the USCIS processing time website.&nbsp;</p><p><br></p><p>Please note that it remains very important to 
                maintain your non-immigrant status throughout the whole process.${handleH1bExpiration(h1bIsExpiring)}</p><p><br></p><p>Please confirm if you would like to 
                proceed with regular processing or premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before filing so that the actual filing plan we proceed with is consistent with your preference.</strong>
                </p>
                <p>&nbsp;</p>                
                `;

                const firstPlaceRoWandCNCurrent = `
                <p>In addition, we noticed in your client record that you plan to file I-140 with request of premium processing 
                at the same time. If so, an additional $2,805 for the premium processing fee is also due (USCIS increased the 
                fee from $2,500 to $2,805 starting February 26, 2024). However, we would like to update you regarding your plan 
                to file your EB1A using Premium Processing. We wanted to make you aware of the below information that could make 
                Regular Processing a better option for your case at this time.</p><p><br></p><p><span style="text-decoration: 
                underline;" data-mce-style="text-decoration: underline;"><em><strong>If we do not consider other case-specific 
                factors, EB1A cases filed with premium processing have a lower approval rate and a higher RFE rate based on our 
                most recent observation.</strong></em></span> Since USCIS must take action on the EB1A case within 15 days of 
                receiving the premium processing request, it seems that they are more likely to issue RFEs just to give them 
                more time. As such, you should weigh the benefit of having your case adjudicated in 15 business days against 
                the chance of receiving RFE/NOIDs. Our hope is that this is a temporary trend, and by waiting to have your 
                case adjudicated under regular processing you will avoid the tougher standard of adjudication.</p><p><br></p>
                <p>For your information, without premium processing, the EB1A processing time at ${serviceCenter} is 
                around ${processingTime} according to the USCIS processing 
                time website.&nbsp;</p><p><br></p><p>Please note that it remains very important to maintain your non-immigrant 
                status throughout the whole process. ${handleH1bExpiration(h1bIsExpiring)}</p><p><br></p><p>Please confirm if you would like to proceed with regular processing or 
                premium processing, and <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">
                ensure that your filing plan in regards to premium processing under section 1 of client record is up-to-date to 
                avoid any confusion on our end.</span> <strong>We will have to be made clear about your filing plan well before 
                filing so that the actual filing plan we proceed with is consistent with your preference.</strong></p>
                <p>&nbsp;</p>
                `;

                

                function handleH1bExpiration(h1bIsExpiring){
                    if (h1bIsExpiring){
                        return `&nbsp; For instance, if you require an I-140 approval to extend your H-1B beyond the six-year cap and 
                        you do not have other I-140 pending/approved, you may still wish to request premium processing. If this 
                        applies, please update us as to your plans regarding your nonimmigrant status and we can advise 
                        accordingly.`;
                    }
                    else{
                        return "";
                    }
                }

                if(!isPp){
                    return "";
                }

                else if(usersCase == "NIW"){
                    if(!ppInfoIsProvided){
                        return firstPlaceNIWPP;
                    }
                    else if(ppInfoIsProvided){
                        return firstPlaceNIWandEB1APPInfoProvided;
                    }
                }

                else if(usersCase == "EB1A"){
                    if(ppInfoIsProvided){
                        return firstPlaceNIWandEB1APPInfoProvided;
                    }

                    else if((!ppInfoIsProvided)){
                        //code here
                    }
                    
                }
/*
                else if (isPp && usersCase == "EB1A" && ["China", "India"].includes(countryOfBirth) && (!priorityDateIsCurrent)){
                    return firstPlaceEB1APPCNNotCurrent;
                }

                else if (isPp && usersCase == "EB1A"){
                    return firstPlaceRoWandCNCurrent;
                }

                else if(!isPp){
                    return "";
                }
*/
            },

            secondPlace: function(isPp){
                const secondPlaceNoPP = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of $${addComma(1015+remainingAttorneyFee)} (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace(hasPaid,remainingAttorneyFee)}$715 filing fee + $300 asylum program fee). Please follow the instructions attached to the invoice email and make a payment at your earliest convenience.
                </p>
                <p>&nbsp;</p>
                `;
                const secondPlacePP = `
                <p>For your convenience, we have sent you an invoice email with the combined amount of $${addComma(1015+remainingAttorneyFee)} (=${handleCaseDetails.handleUnpaidAttyFee.secondPlace(hasPaid,remainingAttorneyFee)}$715 filing fee + $300 asylum program fee), and a separate invoice email for the premium processing fee of $2,805. We accept payments via Zelle, wire transfer, counter deposit, and credit card, etc. Please follow the instructions attached to the invoice email and leave a message after you have initiated the payment(s). <span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">Note if you will proceed with regular processing first, you do not need to pay the premium processing fee now.</span>
                </p>
                <p>&nbsp;</p>
                `;
                if (isPp){
                    return secondPlacePP;
                }

                else{
                    return secondPlaceNoPP;
                }
                
            }

        },

        handleFurtherInquiry: function(isFurtherInquiry){
            const furtherInquiryText = `
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
    };

    const customizedParagraphs = {
        part1:`
        <p>Now that your${handleCaseDetails.handleCaseSpecific(finalDetails.isCaseSpecific, finalDetails.usersCase)}petition letter is finalized, the${handleCaseDetails.handleCaseSpecific(finalDetails.isCaseSpecific, finalDetails.usersCase)}I-140 filing 
        fee${handleCaseDetails.handleUnpaidAttyFee.firstPlace(finalDetails.hasPaid)}required. Instead of mailing a check, please make your payment online using options such as Zelle, wire 
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
        `,

        part2: `${handleCaseDetails.handlePP.firstPlace(finalDetails.isPp, finalDetails.usersCase, finalDetails.countryOfBirth, finalDetails.priorityDateIsCurrent, 
            finalDetails.h1bIsExpiring, finalDetails.serviceCenter, finalDetails.processingTime)}`,
        
        part3: `${handleCaseDetails.handlePP.secondPlace(finalDetails.isPp)}`,

        part4: `
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
        `,

        part5: `${handleCaseDetails.handleFurtherInquiry(finalDetails.isFurtherInquiry)}`
                              
    };

    //Final Assembly of the Message

    let customizedMessage = "";

    for(let key in customizedParagraphs){
        customizedMessage += customizedParagraphs[key];
    };

    return customizedMessage;
    
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

const customizedHTML = customizedMessage();

enterText(customizedHTML);