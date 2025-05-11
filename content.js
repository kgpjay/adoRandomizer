// Check dropdown
function checkDropdown() {
    const listItems = document.querySelectorAll("li.bolt-list-box-multi-select-row");
    if (!listItems) return false;

    const listNames = [...listItems].map(item => {
        return item.querySelector("span.text-ellipsis").innerText;
    });
    if (listNames.includes('@Me') && listNames.includes('Unassigned')) return true;
    else return false;
}

// Example function to call on changes
async function myCustomFunction() {
    console.log('Detected change in body – running function.');

    // check whether to insert button
    if (!checkDropdown()) {
        console.log("Not proper dropdown");
        return;
    }
    const action_container = document.querySelector("div.bolt-actions-container");

    if (action_container) {
        if (!action_container.querySelector("#custom-random-button")) {
            const randomBtn = document.createElement('button');
            randomBtn.id = 'custom-random-button';
            randomBtn.textContent = '🎲  Random';
            randomBtn.className = 'bolt-button enabled subtle';

            // Align to right in a vertical flex container
            randomBtn.style.alignSelf = 'flex-end';

            action_container.insertBefore(randomBtn, action_container.firstChild);

            randomBtn.addEventListener('click', Random);
        }
    }
    else {
        console.log("Can't find action_container");
    }
}

async function Random() {
    // use map to choose and click, if empty the create new 

    //get li items and unselect all 
    const listItems = document.querySelectorAll("li.bolt-list-box-multi-select-row");
    if (!listItems) {
        console.log("Cant find li items");
        return;
    }
    unselectItems(listItems);

    await UpdateMap();

    //choose random index in map, click, and remove from map
    const keys = itemsMap.keys().toArray();
    const randomIndex = Math.floor(Math.random() * keys.length);

    clickItem(itemsMap.get(keys[randomIndex]));

    itemsMap.delete(keys[randomIndex]);
    await chrome.storage.local.remove(keys[randomIndex]).then( ()=>{});
    const sizeObj = await chrome.storage.local.get(["size"]);
    sizeObj.size--;
    chrome.storage.local.set({"size" : sizeObj.size}).then( ()=>{
        console.log("size updated", sizeObj);
    }); 
}


function unselectItems(listItems) {
    listItems.forEach((item) => {
        if (item.ariaSelected == 'true') clickItem(item);
    })
}

function clickItem(item) {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
    });
    return item.dispatchEvent(event);
}

async function UpdateMap(){
    let sizeObj = await chrome.storage.local.get(["size"]);
    const listItems = document.querySelectorAll("li.bolt-list-box-multi-select-row");
    if (!listItems) {
        console.log("Cant find li items");
        return;
    }

    if(sizeObj.size == 0){
        for(const item of listItems){
            const key = item.querySelector("span.text-ellipsis").innerText;
            const value = item;
            itemsMap.set(key, value);
            await chrome.storage.local.set({key: 1}).then( ()=>{}); 
            sizeObj.size++;
        }
        chrome.storage.local.set({"size" : sizeObj.size}).then( ()=>{
            console.log("size created", sizeObj);
        }); 
    }
    else if(sizeObj.size != itemsMap.size){
        const allItems = await chrome.storage.local.get(null); 
        const allKeys = Object.keys(allItems).filter(key => key !== "size");
        listItems.forEach(item => {
            const key = item.querySelector("span.text-ellipsis").innerText;
            const value = item;
            if(allKeys.includes(key)){
                itemsMap.set(key, value);
            }
        }); 
    }
}


const divobs = document.querySelector("div.bolt-portal-host");
const observer = new MutationObserver((mutationsList, observer) => {
    console.log('Body changed!', mutationsList);
    myCustomFunction();
});

if(divobs){
    observer.observe(divobs, {
        childList: true,       // Watch for added/removed child nodes
        // subtree: true,         // Watch the entire body subtree
        attributes: false,     // You can set this to true if you also want to track attribute changes
    });
}

chrome.storage.local.get(["size"]).then(result => {
    console.log(result); 
    if(result.size == undefined){
        chrome.storage.local.set({"size" : 0 }).then( ()=>{
            console.log("local storage initialized");
        } ); 
    }
    else{
        console.log("size already initialized", result.key, result.size);
    }
}) 
const itemsMap = new Map();


// ass_btn.addEventListener('click', clicked); 
  // ass_btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));