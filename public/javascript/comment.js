//script that processes user's name input and comment input
//sends to backend to be entered into the db

// async function to save article to db
// the server then writes article link to the database
const saveComment = async (user, comment) => {
  const response = await fetch('/save-comment', {
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
  console.log(responseContent);
};

document.addEventListener('DOMContentLoaded', () => {
  //submit comment
  const commentButton = document.querySelector('#submit-comment');
  commentButton.addEventListener('click', e => {
    e.preventDefault();
    const user = document.querySelector('#comment-user').value;
    const comment = document.querySelector('#comment-body').value;

    saveComment(user, comment);
  });
});
