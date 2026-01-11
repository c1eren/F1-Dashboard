const debug = false;

// These properties could be attached to some sort 
// of grid dict per grid container if more than 1 exists
let gridContainer;
let gridRect;
let gridContainerWidth;
let gridContainerHeight; 

let colCount;
let rowCount;
let gridSize;
let gridWidth;
let gridHeight;
let cellSize;
let cellWidth;
let cellHeight;

// UI elements
let UICol;
let UIRow;
let cellSizeOption = document.getElementById('cellSizeOption');
// Buttons
let buttonsDiv;
let driverInfoButtonsDiv;
const elementRects = new Map();


// Action based
let action = null;
let currentWin = null;
let currentWinInitWidth = 0;
let currentWinInitHeight = 0;

// Position based
// let currentGrabber = null;
let grabOffsetX = 0;
let grabOffsetY = 0;
let shadowGrabOffsetX = 0;
let shadowGrabOffsetY = 0;
let mouseInitX = 0;
let mouseInitY = 0;

// Shallow clone
let shallowClone = null;

// Z-index standards
const zStackingArray = [];


if (document.readyState === 'loading') {
    console.log('loading...');
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    buttonsDiv = document.getElementById('buttons') || null;
    driverInfoButtonsDiv = document.getElementById('driverInfoButtons') || null;
    
    setDocumentListeners();
    
    initGridContainer();
        // Ensure DOM layout is done before sizing
    requestAnimationFrame(() => {
        designateWindows();
        setGridContainerSize();
    });

    const observer = new MutationObserver(() => designateWindows());
    observer.observe(gridContainer, { childList: true });
}

function updateZStackingArray(win) {
    const wIndex = zStackingArray.indexOf(win);

    // Add new windows
    if (wIndex === -1) {
      zStackingArray.push(win);
    } 
    // If window's already up top, return early
    else if (wIndex === zStackingArray.length - 1) {
      return;
    } 
    // Otherwise, rip it from it's spot and chuck it on the end
    else {
      zStackingArray.splice(wIndex, 1);
      zStackingArray.push(win);
    }
    // Iterate through and update the zIndex order
    zStackingArray.forEach((winZ, index) => {
      winZ.style.zIndex = index;
    });
}


function setDocumentListeners() {
    document.addEventListener('mousedown', (e) => {
        if (currentWin = e.target.closest('.gridChild')) {
            updateZStackingArray(currentWin);
            const rect = currentWin.getBoundingClientRect();
        }

        // Grabbing
        if (e.target.classList.contains('grid-grabber')) {
            action = "grabbing";

            currentWin = e.target.closest('.gridChild');
            document.body.classList.add('grabbing');
            
            // Shallow clone
            shallowClone = currentWin.cloneNode(false);
            shallowClone.classList.add('shallowClone');
            if (shallowClone) {
                shallowClone.style.zIndex = zStackingArray.length - 2;
            }
            gridContainer.append(shallowClone);

            // Now that shallow clone takes form of full size gridChild, scale down and get offsets
            currentWin.classList.add('gridChild-grabbed');
            currentWin.style.position = 'absolute';
            getGridKidBounding(e);
        }
        
        
        // Resizing
        if (e.target.classList.contains('grid-resizer')) {
            action = "resizing";
            
            currentWin = e.target.closest('.gridChild');
            updateZStackingArray(currentWin);
            currentWinInitWidth  = currentWin.offsetWidth;
            currentWinInitHeight = currentWin.offsetHeight;

            document.body.classList.add('resizing');
            getMouseInit(e);
        }

        // Closing
        if (e.target.classList.contains('grid-closer')) {
            currentWin = e.target.closest('.gridChild');

            if (currentWin.dataset.buttonId) {
                const toggle = document.getElementById(currentWin.dataset.buttonId);
                toggleComponent(currentWin, toggle);
            }
        }
        
        logData();
    });

    document.addEventListener('mousemove', (e) => {
        if (action === "grabbing" && currentWin) {
            handleDragging(e);
        }
        if (action === "resizing" && currentWin) {
            handleResizing(e);
        }        
    });
    
    document.addEventListener('mouseup', () => {
        document.body.classList.remove('grabbing');
        document.body.classList.remove('resizing');

        if (currentWin) {

            if (action === "resizing") {
                // Gotta fix the z-index on the resizing element
                currentWin.classList.remove('gridChild-resizing');
            }

            if (action === "grabbing" && shallowClone) {

                const col = parseInt(shallowClone.style.gridColumnStart) || 1;
                const row = parseInt(shallowClone.style.gridRowStart) || 1;

                // Snap to the grid
                currentWin.dataset.colPos = col;
                currentWin.dataset.rowPos = row;

                genNewGridPos();

                // Reset positioning so the element participates in the grid again
                currentWin.classList.remove('gridChild-grabbed');
                currentWin.style.position = ''; // classList styles not applying properly, have to inline for some reason
                currentWin.style.left = '';
                currentWin.style.top = '';

                shallowClone.remove();
                shallowClone = null; 
            }
        }

        // Reset state
        action = null;
        currentWin = null;
        // currentGrabber = null;
        grabOffsetX = 0;
        grabOffsetY = 0;
        mouseInitX = 0;
        mouseInitY = 0;
        currentWinInitWidth = 0;
        currentWinInitHeight = 0;
    });

    window.addEventListener('resize', () => {
        const oldColCount = colCount;
        const oldRowCount = rowCount;
        
        setGridContainerSize();
        
        // colCount and rowCount will always change, but the check doesn't hurt performance
        if (colCount !== oldColCount || rowCount !== oldRowCount) {
            document.querySelectorAll('.gridChild').forEach(initSizeGridKid);
        }
    });
    if (cellSizeOption) {
        cellSizeOption.addEventListener('change', function() {
            console.log("Cell size changed to: ",cellSizeOption.value, "px");  
            cellSize = cellSizeOption.value;

            setGridContainerSize();
            document.querySelectorAll('.gridChild').forEach(initSizeGridKid);
        });
    }

    // componentToggles.forEach(toggle => {
    //     // Assign toggle to its component
    //     const w = document.getElementById(toggle.value);
    //     w.dataset.toggleButtonId = toggle.id;

    //      toggle.addEventListener('click', () => {
    //         // This is so convoluted and needs fixing
    //         const element = document.getElementById(toggle.value);
    //         toggleComponent(element, toggle);
    //     });
    // });

    /*
    for (let i = 0; i < componentToggles.length; i++) {
    let toggle = componentToggles[i];
    toggle.addEventListener('click', function() {
        toggleComponent(toggle.value);
    });
}
    */

}

function handleDragging(e) {
    // Keep aligned with cursor pos
    const winRect = currentWin.getBoundingClientRect();

        // Sets absolute to the body, fight me nerds
    currentWin.style.left  = (e.clientX - gridRect.left - grabOffsetX) + "px";
    currentWin.style.top   = (e.clientY - gridRect.top  - grabOffsetY) + "px";

    // const newLeft = e.clientX - containerRect.left - grabOffsetX;
    // const newTop  = e.clientY - containerRect.top  - grabOffsetY;
    
    const shadowLeft = e.clientX - gridRect.left - shadowGrabOffsetX;
    const shadowTop  = e.clientY - gridRect.top  - shadowGrabOffsetY;

    
    const closestCells = getClosestGridCell(shadowLeft, shadowTop);
    shallowClone.style.position = '';
    // updateZStackingArray(shallowClone);
    shallowClone.style.gridColumnStart = closestCells.col;
    shallowClone.style.gridRowStart    = closestCells.row;
}

function handleResizing(e) {
    const changeX = e.clientX - mouseInitX;
    const changeY = e.clientY - mouseInitY;

    // Think about setting a Math.min() here too 
    // Okay so wid is the currentwidth + how far the mouse has moved from it's initial position, and won't go smaller than 1 cell width
    // So basically the width delta
    const wid = Math.max(currentWinInitWidth + changeX,  cellSize);
    const hei = Math.max(currentWinInitHeight + changeY, cellSize);
    // Then col is that change in width divided by the cell width and rounded to nearest integer
    const col = Math.round(wid / cellSize);
    const row = Math.round(hei / cellSize);
    
    // After that we set the new width to the rounded column spanning number * cell width 
    const newWidth  = col * cellSize;
    const newHeight = row * cellSize;

    // currentWin.classList.add('gridChild-resizing'); // Currently redundant, could add effects later or something

    currentWin.style.width  = newWidth + "px";
    currentWin.style.height = newHeight + "px";
    
    currentWin.dataset.columns = col;
    currentWin.dataset.rows = row;
    genNewGridPos();
}

function initSizeGridKid(win) {
    const winWidth  = Math.max(win.offsetWidth,  cellSize);
    const winHeight = Math.max(win.offsetHeight, cellSize);

    win.style.width  = winWidth +  "px";
    win.style.height = winHeight + "px";

    gridRect   = gridContainer.getBoundingClientRect();
    const rect = win.getBoundingClientRect();

    const relativeLeft = rect.left - gridRect.left;
    const relativeTop  = rect.top  - gridRect.top;
    // const relativeLeft = gridRect.left - rect.left;
    // const relativeTop  = gridRect.top  - rect.top ;

    const columns = Math.round(winWidth  / cellSize);
    const rows    = Math.round(winHeight / cellSize);
    
    // Set the spans
    win.dataset.columns = columns;
    win.dataset.rows    = rows;

    const closestCells = getClosestGridCell(relativeLeft, relativeTop);
    // console.log(win + "\nclosestCells: ", closestCells);

    // Set the pos'
    win.dataset.colPos = closestCells.col;
    win.dataset.rowPos = closestCells.row;

    // This is gonna bite me in the ass eventually
    currentWin = win;

    genNewGridPos();
    // console.log("item " + win.innerText + ":\n    offsetWidth: " + winWidth + "\n   offsetHeight: " + winHeight + "\n        columns: " + columns + "\n           rows: " + rows);
}

function initGridCompanions(win) {
    const ASS = getComputedStyle(win).height;
    // console.log(win.id, ": ",ASS);
    const grabber     = document.createElement('div');
    const resizer     = document.createElement('div');
    const toolbar     = document.createElement('div');
    grabber.classList.add('grid-grabber');
    resizer.classList.add('grid-resizer');
    toolbar.classList.add('toolbar');
    win.append(resizer);
    toolbar.append(grabber);
    // if (win.dataset.type !== 'driverInfo') {
        const closeButton = document.createElement('div'); 
        closeButton.classList.add('grid-closer');
        closeButton.innerText = "✕";
        toolbar.append(closeButton);
    // }

    win.prepend(toolbar);
    const FUCK = win.offsetHeight;
    // console.log(win.id, ": ",FUCK);

    // win.style.height = 'auto';

}

function getGridKidBounding(e) {
    const winRect = currentWin.getBoundingClientRect();
    gridRect      = gridContainer.getBoundingClientRect();

    // Cursor offset **inside the window**
    grabOffsetX = e.clientX - gridRect.left;
    grabOffsetY = e.clientY - gridRect.top;

    // Shadow clone offset (optional)
    // shadowGrabOffsetX = grabOffsetX - winRect.left;
    // shadowGrabOffsetY = grabOffsetY - winRect.top;
    shadowGrabOffsetX = e.clientX - winRect.left;
    shadowGrabOffsetY = e.clientY - winRect.top;
}

function getMouseInit(e) {
    mouseInitX = e.clientX;
    mouseInitY = e.clientY;
}

function getClosestGridCell(left, top) {
    const fractionalCol = left / cellSize; // If deciding to have non square grid cells later
    const fractionalRow = top  / cellSize; // can change these back to width & height

    const closestCol = Math.max(1, Math.round(fractionalCol) + 1); 
    const closestRow = Math.max(1, Math.round(fractionalRow) + 1);

    return { col: closestCol, row: closestRow };
}

function genNewGridPos() {
    const colSpan = currentWin.dataset.columns || 1;
    const rowSpan = currentWin.dataset.rows || 1;
    currentWin.style.gridColumn = `${currentWin.dataset.colPos} / span ${colSpan}`;
    currentWin.style.gridRow    = `${currentWin.dataset.rowPos} / span ${rowSpan}`;            
}

function logData() {
    if (debug) {
        console.log("Z_INDEX: \nzStackingArray:", zStackingArray);
        console.log("\n------------------------------\n");
        
        if (currentWin) {
            console.log(
                "CURRENT WINDOW:\nwinCol:                     ", currentWin.style.gridColumn,
                "               \ncurrentWin.width:           ", currentWin.style.width,
                "               \ncurrentWin.dataset.columns: ", currentWin.dataset.columns,
                "               \ncurrentWin.dataset.rows:    ", currentWin.dataset.rows,
                "               \ncurrentWin.dataset.colPos:  " , currentWin.dataset.colPos,
                "               \ncurrentWin.dataset.rowPos:  " , currentWin.dataset.rowPos,
            );
            console.log("\n------------------------------\n");

            console.log(
                "OFFSETS:       \ngridBoundingRect.left: ", gridRect.left,
                "               \ngridBoundingRect.top:  ", gridRect.top,
                "               \ncurrentWinRect.left:   ", currentWin.getBoundingClientRect().left,
                "               \ncurrentWinRect.top:    ", currentWin.getBoundingClientRect().top,
                "               \ngrabOffsetX:           ", grabOffsetX,
                "               \ngrabOffsetY:           ", grabOffsetY,
                "               \nshadowGrabOffsetX:     ", shadowGrabOffsetX,
                "               \nshadowGrabOffsetY:     ", shadowGrabOffsetY,
                "               \nmouseInitX:            ", mouseInitX,
                "               \nmouseInitY:            ", mouseInitY,
            );
            console.log("\n------------------------------\n");
        }
    }
}

function setGridContainerSize() {
    // Low overhead, should only run on init and viewport resize
    const viewportWidth  = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    UICol = document.querySelector('.UICol');
    UIRow = document.querySelector('.UIRow');
    if (UICol) {
        // console.log("UICol: ", UICol);
        const UIColWidth = UICol.offsetWidth;
        gridContainerWidth = viewportWidth - UIColWidth;
    }
    else {
        gridContainerWidth = viewportWidth;
    }

    if (UIRow) {
        // console.log("UIRow: ", UIRow);
        const UIRowHeight = UIRow.offsetHeight;
        gridContainerHeight = viewportHeight - UIRowHeight;
    }
    else {
        gridContainerHeight = viewportHeight;
    }

    gridContainer.style.width  = gridContainerWidth   + "px";
    gridContainer.style.height = gridContainerHeight  + "px"; 

    colCount = Math.floor(gridContainerWidth  / cellSize);
    rowCount = Math.floor(gridContainerHeight / cellSize); 

    gridContainer.style.gridTemplateColumns = `repeat(${colCount}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows    = `repeat(${rowCount}, ${cellSize}px)`;
    
    // Maybe, will see
    gridContainer.style.gridAutoColumns = `${cellSize}px`;
    gridContainer.style.gridAutoRows    = `${cellSize}px`;
    
}

function initGridContainer() {
    gridContainer = document.querySelector('.gridContainer');
    cellSize = gridContainer.dataset.cellsize || 25;
    setGridContainerSize();
    gridRect = gridContainer.getBoundingClientRect();

    // gridContainer.style.gridAutoFlow = "column dense";


    
    // gridWidth     = colCount * cellWidth;
    // gridHeight    = rowCount * cellHeight;
    // gridSize      = gridWidth * gridHeight;

    // Dynamically building grid container from remaining viewport space now, keeping this just in case
    
    // const templateCol   = computedStyle.getPropertyValue('grid-template-columns').split(' ');
    // const templateRow   = computedStyle.getPropertyValue('grid-template-rows').split(' ');
    // colCount            = templateCol.length;
    // rowCount            = templateRow.length;
    // cellWidth           = parseFloat(templateCol[0].match(/\d+(\.\d+)?/g)); // Matches integers and decimals
    // cellHeight          = parseFloat(templateRow[0].match(/\d+(\.\d+)?/g)); // Matches integers and decimals
    
}

function designateWindows() {
    gridRect = gridContainer.getBoundingClientRect();
    const gridWindows = document.querySelectorAll('.gridChild');
    gridWindows.forEach((win) => {
        if (!win.dataset.windowProcessed) {
            win.dataset.windowProcessed = 'true';
            // Init
            initGridCompanions(win);
            initButtonForChild(win);        
            initSizeGridKid(win);
            updateZStackingArray(win);
            console.log("windows re-designated");
        }
    });
    // updateButtons();
}

// Unused function currently
function resizeGridChildToContent(win) {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const child of win.children) {
        const rect = child.getBoundingClientRect();
        maxWidth  = Math.max(maxWidth, rect.width);
        maxHeight = Math.max(maxHeight, rect.height);
    }

    win.style.width  = maxWidth + "px";
    win.style.height = maxHeight + "px";
    // win.style.columnCount = 1;
}

export function toggleComponent(element, toggle) {
    if(!toggle || !element) return;
    const toggleRect = toggle.getBoundingClientRect();

    if (!element) return;

    if (!element.dataset.out) {
        element.dataset.out = "true"; // initial state
    }

    const rect = element.getBoundingClientRect();

    // Apply smooth transitions
    element.style.transition = "transform 0.2s ease, opacity 0.2s ease";

    if (element.dataset.out === "true") {
        // Bake em away toys
        const offsetX = toggleRect.left - rect.left + (toggleRect.width / 2 - rect.width / 2);
        const offsetY = toggleRect.top  - rect.top  + (toggleRect.height / 2 - rect.height / 2);

        element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.1)`;
        element.style.opacity = "0";
        element.dataset.out = "false";
    } 
    else {
        // Bring it back
        element.style.transform = "translate(0, 0) scale(1)";
        element.style.opacity = "1";
        element.dataset.out = "true";
        updateZStackingArray(element);
    }
}

function initButtonForChild(win) {
    // Nothing to do if neither exists
    if (!buttonsDiv && !driverInfoButtonsDiv) return; 

    let button;
    button = document.getElementById(win.id + 'Button');
    // console.log(button);
    win.dataset.buttonId = button.id; 

    button.addEventListener('click', () => {
        toggleComponent(win, button);
    });
}

gridContainer = document.querySelector('.gridContainer');


// function updateButtons() {
//     if (!driverInfoButtonsDiv) return;
//     const infoButtons = Array.from(driverInfoButtonsDiv.children); // Selects all div elements on the page
    
//     if (!infoButtons.empty) {
//         infoButtons.forEach((button) => {
//             const win = document.getElementById(button.innerText);
//             if (!win) {
//                 button.remove();
//             }
            
//         });
//     }

// }


// function toggleComponent(componentId, toggleRect) {
//     console.log(componentId);
//     const element = document.getElementById(componentId);
    
//     if (!element) return;
//     if (!element.dataset.out) {
//         element.dataset.out = "true"; // Default
//     }

//     if (element) {
//         if (element.dataset.out === "true") {
//             const elementRect = element.getBoundingClientRect()
//             elementRects.set(element, elementRect);
//             // To remember element position (will probably break on resize or cell change)
//             const offsetX = toggleRect.left - elementRect.left
//             const offsetY = toggleRect.top  - elementRect.top
//             element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//             element.dataset.out = "false";
//         }
//         else {
//             const rect = elementRects.get(element);
//             if (rect) {
//                 const hiddenElementRect = element.getBoundingClientRect();
//                 const offsetX = rect.left - hiddenElementRect.left;
//                 const offsetY = rect.top - hiddenElementRect.top;

//                 element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
//                 element.dataset.out = "true";
//             }
//         }
//     }
//     else {
//         console.log(componentId," not found");
//     }
//     console.log("element.dataset.out: ", element.dataset.out);
//     // console.log("offsetX: ", offsetX); 
//     // console.log("offsetY: ", offsetY);    
// }

// Keep an eye on this, might be better to observe something less busy


