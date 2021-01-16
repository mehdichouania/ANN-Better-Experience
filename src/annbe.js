chrome.storage.local.get(['settings'], (data) => {
    console.log(data.settings);
});