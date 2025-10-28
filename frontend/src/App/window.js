function designateWindows() {
  console.log("here");
  
  const windows = document.querySelectorAll('.windowAble');
  windows.forEach(win => {
    if (!win.dataset.windowProcessed) {
      win.dataset.windowProcessed = 'true'; 
      win.classList.add('text-blue-300');
      const grabber = document.createElement('div');
      grabber.classList.add('w-[10px]', 'h-[10px]', 'absolute', 'bottom-0', 'right-0', 'bg-red-500');
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