//script for users to navigate and click through different articles
// Get the modal

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  

  // Get the button that opens the modal
  const btns = document.querySelectorAll('.modal-open').forEach(btn => {
    // When the user clicks on the link button, open the modal
    
    btn.addEventListener('click', e => {
      const link = e.target.getAttribute('data-link');
      modal.style.display = 'block';
      console.log('hello')
      const request = new XMLHttpRequest();
      request.open('GET', '/article?' + link, true);
      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          // Success!
        
        
        } else {
          // We reached our target server, but it returned an error
        }
      };
      request.onerror = function() {
        // There was a connection error of some sort
      };
      request.send();
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
