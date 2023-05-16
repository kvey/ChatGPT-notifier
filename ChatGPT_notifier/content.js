const audio = new Audio(chrome.runtime.getURL('notification.mp3'));

// audio.play();
function observeDOMChanges() {
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.children.length > 0) {
        if (mutation.target.children[0].tagName === "svg") {
          let text = "..."
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

  bodyObserver.observe(document.body, { childList: true, subtree: true });
}

observeDOMChanges();
