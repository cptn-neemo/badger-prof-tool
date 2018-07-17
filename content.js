chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
         if (request.type == 'FIND_PROFS')
            sendResponse({profNames: findProfs()})
        sendResponse({worked: true})
    }
)


function findProfs() {
    const divArray = [].slice.call(document.getElementsByClassName('section-info__instructor'));
    const tagArray = divArray.map(instructorDiv => {return instructorDiv.children[0]});
    const instructorNames = tagArray.map(profElem => {return profElem.innerText.trim()});

    return instructorNames;
}