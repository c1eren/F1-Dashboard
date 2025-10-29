//TODO: Offsets

const dragStates = new Map();
let isDragging = false;
let draggedWindow = null;

document.addEventListener('mouseup', () => {
  dragStates.forEach((_, win) => {
    dragStates.set(win, false);
  });
  isDragging = false;
  draggedWindow = null;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !draggedWindow) return;

  // Move the window or do whatever with mouse position
  draggedWindow.style.top   = e.clientY + 'px';
  draggedWindow.style.left  = e.clientX + 'px';
});

function designateWindows() {  
  const windows = document.querySelectorAll('.windowAble');

  windows.forEach(win => {

    if (!win.dataset.windowProcessed) {

      win.dataset.windowProcessed = 'true'; 
      win.classList.add('text-blue-300');

      const grabber = document.createElement('div');
      grabber.classList.add('w-[10px]', 'h-[10px]', 'absolute', 'top-0', 'right-0', 'bg-red-500');

      grabber.addEventListener('mousedown', (e) => {
        dragStates.set(win, true); // This window is dragging
        isDragging = true;
        draggedWindow = win;
      });

      win.append(grabber);
    }

  });
}

// Init pass
designateWindows();

const bentoContainer = document.querySelector('.bentoContainer');

// Keep an eye on this, might be better to observe something less busy
const observer = new MutationObserver(() => designateWindows());
observer.observe(bentoContainer, { childList: true });