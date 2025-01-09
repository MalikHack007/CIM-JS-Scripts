const financialAisBox = document.querySelector('#aisBox7');

const remainingFeeKeyWord = "Please post remaining fee message";

const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');

const allFinancialTasks = financialAisBox.querySelectorAll('.ais-summary');

let newWindow = null;
/*

let accumulator = 0;


allFinancialTasks.forEach(financialTaskDiv => {
    if(financialTaskDiv.textContent.includes(remainingFeeKeyWord)){
        accumulator += 1;
    }
});

*/

allFinancialAISRows.forEach(row => {
    const fourthChild = row.children[3];
    if(fourthChild && fourthChild.textContent.includes(remainingFeeKeyWord)){
        const firstChild = row.children[0];
        const aTag = firstChild.querySelector('a');
        if(aTag){
            if(!newWindow){
                newWindow = window.open(aTag.href, "_blank");
            }
            else{
                newWindow.open(aTag.href, '_blank');
            }
        }
    }


});

/*
console.log(`total remaining fee tasks: ${accumulator}.`);
*/