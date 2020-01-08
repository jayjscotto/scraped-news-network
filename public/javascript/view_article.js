//script for users to navigate and click through different articles
// Get the modal

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');

  // Get the button that opens the modal
  const btns = document.querySelectorAll('.modal-open').forEach(btn => {
    // When the user clicks on the link button, open the modal

    btn.addEventListener('click', e => {
      const link = e.target.getAttribute('data-link');
     
      console.log('hello');

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      fetch('/article?' + link)
        .then(response => {
        modal.style.display = 'block';
          return response.json()
          
        })
        .then(response => {
          console.log(typeof response[0].paragraphs);
            const p = document.createElement('p')
            const modalBody = document.querySelector('modal-body');
            console.log(modalBody.textContent);
            // p.textContent = response[0].title;
            // //p.textContent = response[0].paragraphs, 
            // modalBody.appendChild(p)
          
     
            p.textContent = response[0].paragraphs
            modalBody.appendChild(p)
          

        });
 

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
