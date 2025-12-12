document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".scroll-container");
  const pages = document.querySelectorAll(".page");
  const scrollBtn = document.querySelector(".scroll-down");

  const SCROLL_DURATION = 900;

  let isScrolling = false;
  let currentPageIndex = 0;

  function smoothScroll(targetPosition, duration) {
    const startPosition = scrollContainer.scrollTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      scrollContainer.scrollTop = run;

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        isScrolling = false;
      }
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  function goToPage(index) {
    if (index < 0 || index >= pages.length) return;
    isScrolling = true;
    currentPageIndex = index;
    const targetPosition = pages[index].offsetTop;
    smoothScroll(targetPosition, SCROLL_DURATION);
  }

  scrollContainer.addEventListener(
    "wheel",
    function (e) {
      const contentDiv = e.target.closest(".history-content");

      if (contentDiv) {
        const atBottom =
          Math.abs(
            contentDiv.scrollHeight -
              contentDiv.scrollTop -
              contentDiv.clientHeight
          ) < 1;
        const atTop = contentDiv.scrollTop === 0;

        if (e.deltaY > 0 && !atBottom) {
          return;
        }

        if (e.deltaY < 0 && !atTop) {
          return;
        }
      }

      e.preventDefault();

      if (isScrolling) return;

      if (e.deltaY > 0) {
        if (currentPageIndex < pages.length - 1) {
          goToPage(currentPageIndex + 1);
        }
      } else {
        if (currentPageIndex > 0) {
          goToPage(currentPageIndex - 1);
        }
      }
    },
    { passive: false }
  );

  if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
      if (!isScrolling && currentPageIndex < pages.length - 1) {
        goToPage(currentPageIndex + 1);
      }
    });
  }

  window.addEventListener("resize", function () {
    scrollContainer.scrollTop = pages[currentPageIndex].offsetTop;
  });
});
