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

let action = null;
let currentWin = null;
let lastWin = null;
let currentWinInitWidth = 0;
let currentWinInitHeight = 0;
let currentWinCol = 0;
let currentWinRow = 0;
let currentWinColSpan = 0;
let currentWinRowSpan = 0;

// let currentGrabber = null;
let grabOffsetX = 0;
let grabOffsetY = 0;
let shadowGrabOffsetX = 0;
let shadowGrabOffsetY = 0;
let mouseInitX = 0;
let mouseInitY = 0;

let shallowClone = null;

if (document.readyState === 'loading') {
    console.log('loading...');
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log("HERE");
    initGridContainer();
    setDocumentListeners();
    designateWindows();

    const observer = new MutationObserver(() => designateWindows());
    observer.observe(gridContainer, { childList: true });
}

function setDocumentListeners() {
    document.addEventListener('mousedown', (e) => {

        // Grabbing
        if (e.target.classList.contains('grid-grabber')) {
            action = "grabbing";

            currentWin = e.target.closest('.gridChild');
            document.body.classList.add('grabbing');
            document.body.append(currentWin);
            currentWin.style.zIndex = 5;
            gridContainer.append(currentWin);
            // currentGrabber = e.target;

            getGridKidBounding(e);
            // Shallow clone
            shallowClone = currentWin.cloneNode(false);
            shallowClone.classList.add('shallowClone');
            gridContainer.append(shallowClone);
        }

        // Resizing
        if (e.target.classList.contains('grid-resizer')) {
            action = "resizing";

            currentWin = e.target.closest('.gridChild');
            currentWinInitWidth  = currentWin.offsetWidth;
            currentWinInitHeight = currentWin.offsetHeight;

            console.log("winCol: ", currentWin.style.gridColumn);
            document.body.classList.add('resizing');
            getMouseInit(e);
        }

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

        // Give top z-index to last window used
        if (currentWin) {

            currentWin.style.zIndex = 2;
            lastWin = currentWin;

            if (action === "resizing") {
                // Gotta fix the z-index on the resizing element
                currentWin.classList.remove('gridChild-resizing');
            }

            if (action === "grabbing" && shallowClone) {

                const col = parseInt(shallowClone.style.gridColumnStart) || 1;
                const row = parseInt(shallowClone.style.gridRowStart) || 1;

                // Snap to the grid
                currentWinCol = col;
                currentWinRow = row;

                genNewGridPos();
                // currentWin.style.gridColumn = `${col} / span ${currentWinColSpan || 1}`;
                // currentWin.style.gridRow    = `${row} / span ${currentWinRowSpan || 1}`;

                // Reset positioning so the element participates in the grid again
                currentWin.classList.remove('gridChild-grabbed');
                currentWin.style.left = '';
                currentWin.style.top = '';

                shallowClone.remove();
                shallowClone = null; 
                console.log("removed");
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
        currentWinCol = 0;
        currentWinRow = 0;
        currentWinColSpan = 0;
        currentWinRowSpan = 0;
    });
}

function handleDragging(e) {
    // Keep aligned with cursor pos
    let gridRect  = gridContainer.getBoundingClientRect();
    const newLeft = e.clientX - gridRect.left - grabOffsetX;
    const newTop  = e.clientY - gridRect.top  - grabOffsetY;
    const shadowLeft = e.clientX - gridRect.left - shadowGrabOffsetX;
    const shadowTop  = e.clientY - gridRect.top  - shadowGrabOffsetY;

    // Sets absolute to the body, fight me nerds
    currentWin.classList.add('gridChild-grabbed');
    currentWin.style.left  = newLeft + "px";
    currentWin.style.top   = newTop + "px"
    
    const closestCells = getClosestGridCell(shadowLeft, shadowTop);
    shallowClone.style.position = '';
    shallowClone.style.zIndex = 3;
    shallowClone.style.gridColumnStart = closestCells.col;
    shallowClone.style.gridRowStart    = closestCells.row;
}

function handleResizing(e) {
    const changeX = e.clientX - mouseInitX;
    const changeY = e.clientY - mouseInitY;

    // Think about setting a Math.min() here too 
    const wid = Math.max(currentWinInitWidth + changeX, cellWidth);
    const hei = Math.max(currentWinInitHeight + changeY, cellHeight)
    const col = Math.round(wid / cellWidth);
    const row = Math.round(hei / cellHeight);

    const newWidth  = col * cellWidth;
    const newHeight = row * cellHeight;

    currentWin.classList.add('gridChild-resizing');

    currentWin.style.width  = newWidth + "px";
    currentWin.style.height = newHeight + "px";

    // console.log("changeX: ", changeX, "\nchangeY: ", changeY);
    currentWinColSpan = col;
    currentWinRowSpan = row;
    genNewGridPos();
}

function initSizeGridKid(win) {
    const winHeight = Math.max(win.offsetHeight, cellHeight);
    const winWidth  = Math.max(win.offsetWidth, cellWidth);
    win.style.height = winHeight + "px";
    win.style.width  = winWidth + "px";

    const rect = win.getBoundingClientRect();
    gridRect   = gridContainer.getBoundingClientRect();

    const relativeLeft = rect.left - gridRect.left;
    const relativeTop  = rect.top  - gridRect.top;

    const columns = Math.round(winWidth / cellWidth);
    const rows    = Math.round(winHeight / cellHeight);
    const closestCells = getClosestGridCell(relativeLeft, relativeTop);
    console.log(win + "\nclosestCells: ", closestCells);

    win.style.gridColumn = closestCells.col + "/ span " + columns;
    win.style.gridRow    = closestCells.row + "/ span " + rows;
    
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
    // Happens on click
    const rect = currentWin.getBoundingClientRect();
    const gridRect = gridContainer.getBoundingClientRect();

    // Offset of mouse inside the element (relative to the grid)
    shadowGrabOffsetX = e.clientX - rect.left;
    shadowGrabOffsetY = e.clientY - rect.top;
    grabOffsetX = e.clientX - rect.left + (rect.left - gridRect.left);
    grabOffsetY = e.clientY - rect.top  + (rect.top  - gridRect.top);
    // grabOffsetX = e.clientX - rect.left;  // Cursor X inside the element
    // grabOffsetY = e.clientY - rect.top;   // Cursor Y inside the element
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
    const colSpan = currentWinColSpan || 1;
    const rowSpan = currentWinRowSpan || 1;
    currentWin.style.gridColumn = `${currentWinCol} / span ${colSpan}`;
    currentWin.style.gridRow    = `${currentWinRow} / span ${rowSpan}`;            
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
    cellWidth           = templateCol[0].match(/\d+(\.\d+)?/g); // Matches integers and decimals
    cellHeight          = templateRow[0].match(/\d+(\.\d+)?/g); // Matches integers and decimals

    gridRect      = gridContainer.getBoundingClientRect();
    gridWidth     = colCount * cellWidth;
    gridHeight    = rowCount * cellHeight;
    gridSize      = gridWidth * gridHeight;
}

function designateWindows() {
    const gridWindows = document.querySelectorAll('.gridChild');
    gridWindows.forEach((win) => {

        // resizeGridChildToContent(win);
        // 
        // win.firstElementChild.style.width = '100%'; 
        // win.firstElementChild.style.height = '100%';

        console.log("windows re-designated");
        if (!win.dataset.windowProcessed) {
            win.dataset.windowProcessed = 'true';
            // Init
            initGridCompanions(win);        
            initSizeGridKid(win);
        }
    });
}

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
