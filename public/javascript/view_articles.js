// async function to send the article link to the server
// the server then scrapes the link at that route
// the server then returns the scraped article
// the object is turned into JSON, then pushed to the article array

document.addEventListener('DOMContentLoaded', () => {
  // grabbing article modal
  const modal = document.getElementById('modal');

  //modal comments area
  const modalCommentArea = document.querySelector('.modal-comments');

  const getArticle = async articleId => {
    const response = await fetch('/article/' + articleId);
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
  };

  // async function to save article to db
  // the server then writes article link to the database
  const saveComment = async (user, comment, id) => {
    const response = await fetch('/add-comment/' + id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user,
        body: comment
      })
    });
    const responseContent = await response.json();
   
  };

  const deleteArticle = async (articleId) => {
    const response = await fetch('/article/' + articleId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const responseContent = await response.json();
  }

  const deleteComment = async (commentId) => {
    const response = await fetch('/comment/' + commentId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const responseContent = await response.json();
  }

  // function to print the comments to the modal
  const printComments = array => {
    modalCommentArea.textContent = '';
    array.forEach((comment, index) => {
      console.log(comment);
      const commentDiv = document.createElement('div');
      commentDiv.id = index;
      commentDiv.setAttribute('class', 'comment');

      const commentText = document.createElement('p');
      commentText.id = index;
      commentText.textContent = comment.body;

      const commentUser = document.createElement('h4');
      commentUser.id = index;
      commentUser.textContent = comment.user;

      const deleteCommentBtn = document.createElement('a')
      deleteCommentBtn.setAttribute('class', '.delete-comment');

      const newHr = document.createElement('hr');

      commentDiv.append(commentUser, commentText, deleteCommentBtn);
      modalCommentArea.append(newHr, commentDiv);
    });
  };


  //save article button listener
  const saveBtns = document.querySelectorAll('.save-article').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const link = e.target.getAttribute('data-link');
      const titleDiv = e.target.parentElement.parentElement.querySelector(
        '.title'
      );
      const title = titleDiv.children[0].textContent;
      saveArticle(link, title);
      e.target.textContent = 'Article Saved!'

    });
  });

  // Grab the button that opens the modal
  const btns = document.querySelectorAll('.modal-open').forEach(btn => {
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault();

        // get article link and ID
        const link = e.target.getAttribute('data-link');
        const articleId = e.target.getAttribute('data-id');

        getArticle(articleId).then(data => {
          // after the article object is returned, show the modal
          modal.style.display = 'block';

          // set submit button data attribute equal to article id for comment storing
          const commentSubmit = document.querySelector('.submit-comment');
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
          // print comments to modal

          const commentArray = data.comments;

          printComments(commentArray)
        });
      });
    }

    //submit comment
    const commentButton = document.querySelector('.submit-comment');
    if (commentButton) {
      commentButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const user = document.querySelector('#comment-user').value;
        const comment = document.querySelector('#comment-body').value;
        const articleId = commentButton.getAttribute('data-id');

        saveComment(user, comment, articleId);
        document.querySelector('.comment-form').reset()
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
    window.location.pathname = '/saved-articles';
  });


  const deleteArticleBtn = document.querySelector('.delete-article');
  if (deleteArticleBtn) {
    deleteArticleBtn.addEventListener('click', e => {
      e.preventDefault();
      const articleId = e.target.getAttribute('data-id');
      deleteArticle(articleId);
      document.getElementById(articleId).remove();
      window.location.reload();
    })
  }


  const deleteCommentBtn = document.querySelector('.delete-comment');
  if (deleteCommentBtn) {
    deleteArticleBtn.addEventListener('click', e => {
      e.preventDefault();
      const commentId = e.target.getAttribute('data-id');
      deleteComment(commentId);
      document.getElementById(commentId).remove();
    })
  }

});
