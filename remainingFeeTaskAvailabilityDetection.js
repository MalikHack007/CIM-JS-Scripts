const msgBoxBody = document.querySelector('#messageBoxBody');

const keyWord1 = "finalized version";

const keyword2 = "petition letter";

const pendingKeyWord = "pending";

let index = 0;

for (let i = 0; i < msgBoxBody.children.length; i++) {
    const child = msgBoxBody.children[i];
    index += 1;
    if (index < 5) {
        if (child.textContent.includes(keyWord1) && child.textContent.includes(keyword2)) {
            if (child.classList.contains(pendingKeyWord)) {
                alert("Pending");
            } else {
                alert("Approved");
            }
        }
    } else {
        break;
    }
};