const audio = new Audio(chrome.runtime.getURL('notification.mp3'));

function checkForResultStreamingClass() {
  return Array.from(document.querySelectorAll('.result-streaming'));
}

function observeClassChanges(elements) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const oldClassList = mutation.oldValue.split(' ');
        const newClassList = mutation.target.className.split(' ');

        if (oldClassList.includes('result-streaming') && !newClassList.includes('result-streaming')) {
          let text = ""
          try {
            const multiple = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light')
            text = multiple[multiple.length - 1].innerText
          } catch (e) {

          } finally {
            chrome.runtime.sendMessage({message: text.slice(0, 300)+"..."});
            audio.play()
          }
        }
      }
    });
  });

  elements.forEach((element) => {
    observer.observe(element, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
  });
}

function observeDOMChanges() {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const newResultStreamingElements = checkForResultStreamingClass();
        if (newResultStreamingElements.length > 0) {
          observeClassChanges(newResultStreamingElements);
        }
      }
    });
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

const resultStreamingElements = checkForResultStreamingClass();

if (resultStreamingElements.length > 0) {
  observeClassChanges(resultStreamingElements);
}

observeDOMChanges();
