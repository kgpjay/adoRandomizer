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

function getListItems() {
    const listItems = document.querySelectorAll("li.bolt-list-box-multi-select-row");
    if (!listItems) {
        console.log("Cant find li items");
        return undefined;
    }
    return listItems;
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
    console.log("Random clicked");

    //get li items and unselect all 
    const listItems = getListItems();
    if (!listItems) {
        console.log("Cant find li items");
        return;
    }
    unselectItems(listItems);

    // create map if empty 
    // if (itemsMap.size == 0) {
    //     listItems.forEach(item => {
    //         const key = item.querySelector("span.text-ellipsis").innerText;
    //         itemsMap.set(key, 1);
    //     });
    // }


    // //choose random index in map, click, and remove from map
    // const keys = itemsMap.keys().toArray();
    // const randomIndex = Math.floor(Math.random() * keys.length);
    // listItems.forEach(item => {
    //     const key = item.querySelector("span.text-ellipsis").innerText;
    //     if (key == keys[randomIndex]) {
    //         clickItem(item);
    //         console.log("Item clicked", item);
    //     }
    // })

    // itemsMap.delete(keys[randomIndex]);

    //using chrome storage 
    const sizeObj = await chrome.storage.local.get("size");
    if(sizeObj.size == 0){
        listItems.forEach(item => {
            const key = item.querySelector("span.text-ellipsis").innerText;
            chrome.storage.local.set({[key]: 1}).then(() => {
                sizeObj.size++;
            });
        })
        chrome.storage.local.set(sizeObj).then(()=>{});
    }

    const keyObjList = await chrome.storage.local.get(null);
    const keys = Object.keys(keyObjList).filter(key => key !== "size");
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    listItems.forEach(item => {
        const key = item.querySelector("span.text-ellipsis").innerText;
        if (key == randomKey) {
            clickItem(item);
            console.log("Item clicked", item);
        }
    }); 
    sizeObj.size--;
    chrome.storage.local.set(sizeObj).then(()=>{});
    chrome.storage.local.remove(randomKey).then(() => {
        console.log("Removed key", randomKey);
    });
    console.log("Size left", sizeObj.size);
}


function unselectItems(listItems) {
    listItems.forEach((item) => {
        if (item.ariaSelected == 'true') clickItem(item);
    })
}

function clickItem(item) {
    console.log("Clicking item", item);
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
    });
    return item.dispatchEvent(event);
}

async function resetCache(){
    console.log("Cache Reset Successfull");
    const  sizeObj = await chrome.storage.local.get("size");
    if(sizeObj.size == undefined) initCache(); 
    else{
        sizeObj.size = 0; 
        await chrome.storage.local.set(sizeObj);
    }
    return true; 
}

function initCache(){
    chrome.storage.local.get("size").then((result) => {
        if (result.size == undefined) {
            chrome.storage.local.set({ size: 0 }).then(() => {
                console.log("No size in storage, setting to 0");
            });
        }
    })
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.reset){
            resetCache();
            sendResponse("Cache Reset Successfull");
        }
        else if(request.alert){
            alert("This action can only be used on dev.azure.com pages.");
            sendResponse("Alert shown");
        }
    }
)

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

// const itemsMap = new Map();
initCache(); 

// ass_btn.addEventListener('click', clicked); 
  // ass_btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));