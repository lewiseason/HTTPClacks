document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage(tabs[0].id, function(response) {
      var status = document.getElementById('status');

      if (response.headers.length > 0) {

        status.innerHTML = '';

        for (i=0; i < response.headers.length; i++) {
          item = document.createElement("li");
          item.innerHTML = response.headers[i].value;

          status.appendChild(item);
        }

      }

    });
  });
});

