function loadRepos() {
   let xmlHttpRequest = new XMLHttpRequest();
   xmlHttpRequest.addEventListener('readystatechange', function () {
      if (this.readyState === 4 &&
         this.status === 200) {
         let resultDiv = document.querySelector('#res');

         console.log('HERE')
         resultDiv.textContent = this.response;
      }
   });

   xmlHttpRequest.open('GET', 'https://api.github.com/users/testnakov/repos');
   xmlHttpRequest.send();
}