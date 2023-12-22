document.addEventListener('DOMContentLoaded', function () {
    const paragraphs = document.querySelectorAll('.journal-content p');
  
    window.addEventListener('scroll', function () {
      paragraphs.forEach((paragraph) => {
        if (isElementInViewport(paragraph)) {
          paragraph.classList.add('faded-in');
        }
      });
    });
  });
  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= 
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  