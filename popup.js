console.log('This is a popup!');

const resetButton = document.getElementById("resetButton"); 
resetButton.addEventListener('click', resetCache); 

async function resetCache(){
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, {
        reset: true
    });
    console.log(response);
}