export function addComma(number){
    numString = number.toString();
    if (numString.length == 4){
        numString = numString[0]+','+numString[1]+numString[2]+numString[3];
    }
    return numString;
}