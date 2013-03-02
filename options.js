function save_options() {
  var field = document.getElementById("api_key");
  localStorage["api_key"] = field.value;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function restore_options() {
  var key = localStorage["api_key"];
  if (!key) {
    return;
  }

  var field = document.getElementById("api_key");
  field.value = key;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
