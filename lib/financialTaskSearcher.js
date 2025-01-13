function openTasks(taskKeyWord){

    const financialAisBox = document.querySelector('#aisBox7');
    const doneKeyword = "line-through";
    const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');
    
    let newWindow = null;
    let accumulator = 0
    
    allFinancialAISRows.forEach(row => {
        const fourthChild = row.children[3];
        if(fourthChild && fourthChild.textContent.includes(taskKeyWord) && (!fourthChild.children[0].children[0].classList.contains(doneKeyword))){
            const firstChild = row.children[0];
            const aTag = firstChild.querySelector('a');
            accumulator += 1;
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

    console.log(`total ${taskKeyWord} tasks: ${accumulator}.`);


}

openTasks("Enter task here");

