chrome.extension.onMessage.addListener(function(msg, s, c) {
  if (msg == "getApiKey")
    c(localStorage["api_key"]);
  else
    c({});
});
