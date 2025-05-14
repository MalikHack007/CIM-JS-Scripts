let requiredSubModules = {};

async function dependenciesReady(){
    const pathToCustomUtilFuncs = chrome.runtime.getURL('lib/UTILITIES/custom-utils.js');
    const pathToBrowserActionFuncs = chrome.runtime.getURL('lib/UTILITIES/browser-actions.js');
    const customUtilFuncs = await import(pathToCustomUtilFuncs);
    const browserActionFuncs = await import(pathToBrowserActionFuncs);
    requiredSubModules = { customUtilFuncs, browserActionFuncs };
}


export async function billForAttyFeeAndFF(inputObject){
    await dependenciesReady();

    //#region essential definitions
    const asylumFee = 300;

    const filingFee = 715;

    const isCaseSpecific = inputObject.isCaseSpecific;

    const isRemainingAttyFee = !inputObject.hasPaid;

    const isFFCredit = inputObject.isFilingFeeCredit;

    //#endregion

    let caseType = "";
    let remainingAttyFee = 0;
    let ffCredit = 0;
    let comment;
    let amount;
    //handle comment

    if(isCaseSpecific && isRemainingAttyFee){
        caseType = inputObject.usersCase;
        comment = `Remaining I-140 ${caseType} Attorney Fee, I-140 ${caseType} Filing Fee and Asylum Program Fee`;
    }

    else if(isCaseSpecific && (!isRemainingAttyFee)){
        caseType = inputObject.usersCase;
        comment = `I-140 ${caseType} Filing Fee and Asylum Program Fee`;
    }

    else if ((!isCaseSpecific) && isRemainingAttyFee){
        comment = `Remaining I-140 Attorney Fee, I-140 Filing Fee and Asylum Program Fee`;
    }

    else{
        comment = "I-140 Filing Fee and Asylum Program Fee";
    };

    //handle amount to charge

    if(isRemainingAttyFee && isFFCredit){
        remainingAttyFee = Number(inputObject.remainingAttorneyFee);
        ffCredit = Number(inputObject.filingFeeCredit);
        amount = remainingAttyFee + filingFee + asylumFee - ffCredit;
    }
    else if(isRemainingAttyFee && !isFFCredit){
        remainingAttyFee = Number(inputObject.remainingAttorneyFee);
        amount = remainingAttyFee + filingFee + asylumFee - ffCredit;
    }

    else if(!isRemainingAttyFee && isFFCredit){
        ffCredit = Number(inputObject.filingFeeCredit);
        amount = filingFee + asylumFee - ffCredit;
    }
    else{
        amount = filingFee + asylumFee;
    }

    await requiredSubModules.browserActionFuncs.sendInvoice(amount, comment); 
}

export async function billForPP(inputObject){
    await dependenciesReady();
    
    const ppFee = 2805;
    const hasFiledAnotherPP = inputObject.ppSpecific;
    let ppCaseType = "";
    let comment;

    if(hasFiledAnotherPP){
        ppCaseType = inputObject.usersCase;
        comment = `I-140 ${ppCaseType} Premium Processing Fee`;
    }

    else{
        comment = `Premium Processing Fee`;
    };

    await requiredSubModules.browserActionFuncs.sendInvoice(ppFee, comment); 
}

export async function postPPWarning(caseType){
    await dependenciesReady();

    const {getTimeStampOfLastMessage, getDateISO8601} = requiredSubModules.customUtilFuncs;
    const { addSpecialNote } = requiredSubModules.browserActionFuncs;


    const latestMsgTimeStamp = getTimeStampOfLastMessage();
    const currentDate = getDateISO8601();

    await addSpecialNote(`<font color="red">${currentDate} New ${caseType} PP warning msg posted @ ${latestMsgTimeStamp}</font>`, 1);

}
