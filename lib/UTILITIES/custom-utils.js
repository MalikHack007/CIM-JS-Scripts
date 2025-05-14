export function addComma(number){
    let numString = number.toString();
    if (numString.length == 4){
        numString = numString[0]+','+numString[1]+numString[2]+numString[3];
    }
    return numString;
}


export const getDateISO8601 = ()=>{
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const ISO8601Date = `${year}-${month}-${day}`;
    
    return ISO8601Date;
};

export function getTimeStampOfLatestMessage(){
    const latestMsgTimeStampArr = Array.from(msgBoxBody.children[0].children[0].children[0].children[1].childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.nodeValue.trim());

    return latestMsgTimeStampArr[0];
}

export const addDelay = (delay=2000)=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, delay);
    })
}

export const getMsgSender = (msgBox, taskersObject)=>{
    if(msgBox.children[0].textContent.includes(taskersObject.taskMaster)){
        return  taskersObject.taskMaster;
    }
    else{
        return taskersObject.nonTaskMaster;
    }
}