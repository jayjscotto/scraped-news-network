// array that will contain specific article
const article = [];

// async function to send the article link to the server
// the server then scrapes the link at that route
// the server then returns the scraped article
// the object is turned into JSON, then pushed to the article array
const getArticle = async link => {
  article.splice(0, article.length);
  const response = await fetch('/article?' + link);
  const data = await response.json();
  return article.push(data[0]);
};

document.addEventListener('DOMContentLoaded', () => {
  // grabbing article modal
  const modal = document.getElementById('modal');

  // Grab the button that opens the modal
  const btns = document.querySelectorAll('.modal-open').forEach(btn => {
    
    btn.addEventListener('click', e => {
      const link = e.target.getAttribute('data-link');

      console.log('hello');

      getArticle(link).then(data => {
        // after the article object is returned, show the modal
        modal.style.display = 'block';
        
        const modalBody = document.querySelector('.modal-body');
        const header = document.querySelector('.modal-header h1');
        const p = document.createElement('p');
        
        header.textContent = article[0].title;
        p.textContent = article[0].paragraphs;
        modalBody.appendChild(p);
        
        console.log(article[0].paragraphs);
      });
    });

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName('close')[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  });
});
