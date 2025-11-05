const debug = true;

// These properties could be attached to some sort 
// of grid dict per grid container if more than 1 exists
let gridContainer;
let gridRect;
let colCount;
let rowCount;
let gridSize;
let gridWidth;
let gridHeight;
let cellWidth;
let cellHeight;

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
    initGridContainer();
    setDocumentListeners();
    designateWindows();

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

}

function handleDragging(e) {
    // Keep aligned with cursor pos
    const winRect    = currentWin.getBoundingClientRect();

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
    const wid = Math.max(currentWinInitWidth + changeX, cellWidth);
    const hei = Math.max(currentWinInitHeight + changeY, cellHeight);
    // Then col is that change in width divided by the cell width and rounded to nearest integer
    const col = Math.round(wid / cellWidth);
    const row = Math.round(hei / cellHeight);
    
    // After that we set the new width to the rounded column spanning number * cell width 
    const newWidth  = col * cellWidth;
    const newHeight = row * cellHeight;

    // currentWin.classList.add('gridChild-resizing'); // Currently redundant, could add effects later or something

    currentWin.style.width  = newWidth + "px";
    currentWin.style.height = newHeight + "px";
    
    currentWin.dataset.columns = col;
    currentWin.dataset.rows = row;
    genNewGridPos();
}

function initSizeGridKid(win) {
    const winWidth  = Math.max(win.offsetWidth, cellWidth);
    const winHeight = Math.max(win.offsetHeight, cellHeight);

    win.style.width  = winWidth + "px";
    win.style.height = winHeight + "px";

    const rect = win.getBoundingClientRect();
    gridRect   = gridContainer.getBoundingClientRect();

    const relativeLeft = rect.left - gridRect.left;
    const relativeTop  = rect.top  - gridRect.top;

    const columns = Math.round(winWidth / cellWidth);
    const rows    = Math.round(winHeight / cellHeight);
    
    // Set the spans
    win.dataset.columns = columns;
    win.dataset.rows= rows;

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
    const grabber = document.createElement('div');
    const resizer = document.createElement('div');
    grabber.classList.add('grid-grabber');
    resizer.classList.add('grid-resizer');
    win.appendChild(grabber);
    win.appendChild(resizer);
}

function getGridKidBounding(e) {
    const winRect = currentWin.getBoundingClientRect();
    gridRect      = gridContainer.getBoundingClientRect();

    // Cursor offset **inside the window**
    grabOffsetX = e.clientX - gridRect.left;
    grabOffsetY = e.clientY - gridRect.top;

    // Shadow clone offset (optional)
    shadowGrabOffsetX = grabOffsetX - winRect.left;
    shadowGrabOffsetY = grabOffsetY - winRect.top;
}

function getMouseInit(e) {
    mouseInitX = e.clientX;
    mouseInitY = e.clientY;
}

function getClosestGridCell(left, top) {
    const fractionalCol = left / cellWidth;
    const fractionalRow = top / cellHeight;

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

// function genNewGridPosLoop() {
//     gridWindows.forEach((win) => {
//         const colSpan = Math.round(Math.max(win.offsetWidth, cellWidth) / cellwidth) || 1; // I see the redundancy here lol
//         const rowSpan = Math.round(Math.max(win.offsetHeight, cellHeight) / cellHeight) || 1;

//     win.style.gridColumn = `${currentWinCol} / span ${colSpan}`;
//     win.style.gridRow    = `${currentWinRow} / span ${rowSpan}`;

//     });            
// }

function initGridContainer() {
    gridContainer = document.querySelector('.gridContainer');
    const computedStyle = window.getComputedStyle(gridContainer);

    const templateCol   = computedStyle.getPropertyValue('grid-template-columns').split(' ');
    const templateRow   = computedStyle.getPropertyValue('grid-template-rows').split(' ');
    colCount            = templateCol.length;
    rowCount            = templateRow.length;
    cellWidth           = parseFloat(templateCol[0].match(/\d+(\.\d+)?/g)); // Matches integers and decimals
    cellHeight          = parseFloat(templateRow[0].match(/\d+(\.\d+)?/g)); // Matches integers and decimals

    gridRect      = gridContainer.getBoundingClientRect();
    gridWidth     = colCount * cellWidth;
    gridHeight    = rowCount * cellHeight;
    gridSize      = gridWidth * gridHeight;
}

function designateWindows() {
    gridRect = gridContainer.getBoundingClientRect();
    const gridWindows = document.querySelectorAll('.gridChild');
    gridWindows.forEach((win) => {

        // resizeGridChildToContent(win);
        // 
        // win.firstElementChild.style.width = '100%'; 
        // win.firstElementChild.style.height = '100%';

        if (!win.dataset.windowProcessed) {
            win.dataset.windowProcessed = 'true';
            // Init
            initGridCompanions(win);        
            initSizeGridKid(win);
            updateZStackingArray(win);
            console.log("windows re-designated");
        }
    });
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

// Keep an eye on this, might be better to observe something less busy
gridContainer = document.querySelector('.gridContainer');
