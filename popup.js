document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkPage').addEventListener('click', () => {
        sendMessage('FIND_PROFS');
    })
});

function sendMessage(type) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type}, response => {
            //console.log(response)
            displayProfInformation(response.profNames)
        })
    })
}

async function displayProfInformation(response) {
    const uniqueNames = [];

    response.forEach(name => {
        if (!uniqueNames.includes(name.toLowerCase()))
            uniqueNames.push(name);
    });

    const profInfo = document.getElementById('professor_content');
    profInfo.innerHTML = "";

    uniqueNames.forEach(name => {
        const profContainer = document.createElement('div');
        profContainer.innerText = name;
        profInfo.appendChild(profContainer)
        getProfessorInformation(name).then(result => console.log(result))
    })
}