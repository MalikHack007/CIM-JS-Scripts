function openTasks(taskKeyWord){

    const financialAisBox = document.querySelector('#aisBox7');
    const doneKeyword = "line-through";
    const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');
    const CSPAKeyword = "badge";
    
    let newWindow = null;
    let accumulator = 0;

    const openInNewTab = (row){
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
    
    allFinancialAISRows.forEach(row => {
        const fourthChild = row.children[3];
        const AISSection = fourthChild.children[0].children[0];
        if(fourthChild && fourthChild.textContent.includes(taskKeyWord)){
            if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                openInNewTab(row);
            }
        }
    });

    console.log(`total ${taskKeyWord} tasks: ${accumulator}.`);


}

openTasks("Enter task here");

