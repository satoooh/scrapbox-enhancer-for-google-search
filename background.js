chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  fetch(message.endpoint, {
    headers: {
      cookie: `connect.sid=${message.sid}`,
    },
  })
    .then((response) => {
      if (response && response.ok) {
        return response.json();
      }
    })
    .then((json) => {
      sendResponse(json);
    })
    .catch((error) => {
      sendResponse({
        status: false,
        reason: "failed to fetch",
      });
    });

  return true;
});
