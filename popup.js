console.log('This is a popup!');

const resetButton = document.getElementById("resetButton"); 
resetButton.addEventListener('click', resetCache); 

async function resetCache() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tab && tab.url && tab.url.startsWith("https://dev.azure.com/")) {
        const response = await chrome.tabs.sendMessage(tab.id, {
            reset: true
        });
        console.log(response);
    } else {
        alert("This action can only be used on dev.azure.com pages.");
    }
}