const getSavedArticles = async () => {
    const response = await fetch ('/saved-articles');
    const responseContent = await response.json();
    console.log(responseContent);
}

document.addEventListener('DOMContentLoaded', () => {
    //submit comment
    const getSavedBtn = document.querySelector('#view-saved');
    getSavedBtn.addEventListener('click', e => {
        e.preventDefault();
        getSavedArticles();
    })
  });
  