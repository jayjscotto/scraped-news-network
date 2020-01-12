// async function to send the article link to the server
// the server then scrapes the link at that route
// the server then returns the scraped article
// the object is turned into JSON, then pushed to the article array
const getArticle = async link => {
  const response = await fetch('/article?' + link);
  const data = await response.json();
  return data;
};

const saveArticle = async (link, title, callback) => {
  const response = await fetch('/save-article', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      link: link,
      title: title
    })
  });
  const responseContent = await response.json();
  console.log(responseContent);
};


document.addEventListener('DOMContentLoaded', () => {
  // grabbing article modal
  const modal = document.getElementById('modal');

  //save article button listener
  const saveBtns = document.querySelectorAll('.save-article').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const link = e.target.getAttribute('data-link');
      const titleDiv = e.target.parentElement.parentElement.querySelector('.title');
      const title = titleDiv.children[0].textContent
      saveArticle(link, title);
    });
  });

  // Grab the button that opens the modal
  const btns = document.querySelectorAll('.modal-open').forEach(btn => {
    if(btn) {
      btn.addEventListener('click', e => {
        e.preventDefault();
 
        // get article link and ID from DB
        const link = e.target.getAttribute('data-link');
        const articleId = e.target.getAttribute('data-id');

  
        getArticle(link).then(data => {
          // after the article object is returned, show the modal
          modal.style.display = 'block';

          // set submit button data attribute equal to article id for comment storing
          const commentSubmit = document.querySelector('#submit-comment');
          commentSubmit.setAttribute('data-id', articleId);
          
          // grab DOM nodes to dynamically print the article
          const modalBody = document.querySelector('.modal-body');
          const header = document.querySelector('.modal-header h2');
          const headerLink = document.querySelector('.modal-header a');
          headerLink.setAttribute('href', link);
  
          const paragraphArray = Object.values(data.paragraphs[0]);
  
          header.textContent = data.title;
  
          paragraphArray.forEach((paragraph, index) => {
            const newP = document.createElement('p');
            newP.id = index;
            newP.className = 'article-paragraph';
            newP.textContent = paragraph;
  
            modalBody.appendChild(newP);
          });
        });
    });
  }

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName('close')[0];

    // When the user clicks on <span> (x), close the modal
    if (span) {
      span.onclick = function() {
        modal.style.display = 'none';
      };
    }
    

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

  });

  const getSavedBtn = document.querySelector('#view-saved');
  getSavedBtn.addEventListener('click', e => {
      e.preventDefault();
      window.location.pathname = '/saved-articles'
  })
});
