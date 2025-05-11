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

function Random() {
    // use map to choose and click, if empty the create new 

    //get li items and unselect all 
    const listItems = document.querySelectorAll("li.bolt-list-box-multi-select-row");
    if (!listItems) {
        console.log("Cant find li items");
        return;
    }
    unselectItems(listItems);

    // create map if empty 
    if (itemsMap.size == 0) {
        listItems.forEach(item => {
            const key = item.querySelector("span.text-ellipsis").innerText;
            const value = item;
            itemsMap.set(key, value);
        });
    }


    //choose random index in map, click, and remove from map
    const keys = itemsMap.keys().toArray();
    const randomIndex = Math.floor(Math.random() * keys.length);

    clickItem(itemsMap.get(keys[randomIndex]));

    itemsMap.delete(keys[randomIndex]);
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

const itemsMap = new Map();

// ass_btn.addEventListener('click', clicked); 
  // ass_btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));