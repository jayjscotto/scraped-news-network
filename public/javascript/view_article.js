
// async function to send the article link to the server
// the server then scrapes the link at that route
// the server then returns the scraped article
// the object is turned into JSON, then pushed to the article array
const getArticle = async link => {
  const response = await fetch('/article?' + link);
  const data = await response.json();
  return data;
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
        const header = document.querySelector('.modal-header h2');
        const headerLink = document.querySelector('.modal-header a')
        headerLink.setAttribute('href', link);
        
        const paragraphArray = Object.values(data.paragraphs[0]);

        header.textContent = data.title;
      
        paragraphArray.forEach((paragraph, index) => {
          const newP = document.createElement('p');
          newP.id = index;
          newP.className = 'article-paragraph';
          newP.textContent = paragraph;

          modalBody.appendChild(newP);
          
        })
       

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
