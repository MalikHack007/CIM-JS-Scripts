chrome.runtime.sendMessage({event: "remFeeFetchingTask?"}, (answer)=>{
    console.log(`remainingTaskFetchingPermission: ${answer}`);
    if(answer){
        //code goes here
        const fluidAISContainer = document.querySelector('.container-fluid');

        let contentLoaded = false;
        
        function openTasks(taskKeyWord){
            const taskInfoLookUp = "collectRemFeeMsgTasks";
        
            const financialAisBox = document.querySelector('#aisBox7');
            const doneKeyword = "line-through";
            const allFinancialAISRows = financialAisBox.querySelectorAll('.ais-row');
            const CSPAKeyword = "badge";
            
            let newWindow = null;
            let accumulator = 0;
        
            const openInNewTab = (row)=>{
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
                const orderIDContainer = row.children[0];
                const cleanedID = String(Number(orderIDContainer.textContent));
                const fourthChild = row.children[3];
                const AISSection = fourthChild.children[0].children[0];
                if(fourthChild && fourthChild.textContent.includes(taskKeyWord)){
                    //skip this whole thing if order ID is already in my local storage.
                    chrome.storage.local.get([taskInfoLookUp], (result)=>{
                        if(!result[taskInfoLookUp]){
                            if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                openInNewTab(row);
                            }

                        }


                        //if it's not empty
                        else{
                            const storedData = result[taskInfoLookUp];
                            console.log(`currently opened: ${JSON.stringify(storedData.taskOpened)}`);
                            if(!(cleanedID in storedData.taskOpened)){
                                if((!AISSection.classList.contains(doneKeyword)) && (!AISSection.classList.contains(CSPAKeyword))){
                                    openInNewTab(row);
                                }
                            else{
                                console.log(`Order opened: ${cleanedID}`);
                            }
                        }

                        } 

                    })
                }
            });
        
            console.log(`total ${taskKeyWord} tasks: ${accumulator}.`);
        
        
        }  
        
        const aisObserver = new MutationObserver((mutationsList, observer) => {
        
            for(const mutation of mutationsList){
                if(mutation.type === "childList"){
                    const financialAisBox = document.querySelector('#aisBox7');
                    if(financialAisBox){
                        contentLoaded = true;
                        observer.disconnect()
                    }
                }
            }
            if(contentLoaded){
                //code goes here
                openTasks("Please post remaining fee message");
            }
        })
        
        //start observing
        aisObserver.observe(fluidAISContainer, { childList: true, subtree: true });
    }
})


