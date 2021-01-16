const defaultSettings = {
    showBanner: true,
    showNonGlobalArticles: true,
    showSidebar: true,
    togglePageFullWidth: true,
    articlesPerLine: 3
}

let inputs = document.querySelectorAll('#app .switch input');

inputs.forEach(input => {
    input.addEventListener('change', () => saveSettings(input.getAttribute('data-setting')));
})

const init = () => {
    chrome.storage.local.get(['settings'], (data)=> {
        let settings = data.settings ? data.settings : defaultSettings;
        if(!data.length) {
            chrome.storage.local.set({'settings': settings});
        }
        updateSettingsView(settings);
    });
}

const updateSettingsView = (settings) => {
    inputs.forEach((input, key) => {
        let setting = settings[input.getAttribute('data-setting')];
        if (input.type === "checkbox") {
            input.checked = setting;
        }
        else {
            input.value = setting;
        }
    })
}

const saveSettings = (setting) => {
    let input = document.querySelector(`input[data-setting='${setting}']`);
    chrome.storage.local.get(['settings'], (data)=> {
        let settings = data.settings ? data.settings : defaultSettings;
        settings[setting] = (input.type === "checkbox") ? input.checked : parseInt(input.value);
        chrome.storage.local.set({'settings': settings})
    });
}

document.querySelector("#reset").onclick = e => {
    e.preventDefault();
    let settings = defaultSettings;
    chrome.storage.local.set({'settings': settings});
    updateSettingsView(settings);
};

init(); //🚀
