const defaultSettings = {
    showAside: true,
    asideInjection: false,
    showNonGlobalArticles: true,
    showBanner: true,
    showSettings: true,
    togglePageFullWidth: true,
    articlesPerLine: 5
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
            if(input?.getAttribute('data-role') === 'parent') {
                let inputs = input.parentElement.parentElement.querySelectorAll('input[data-role="child"]');
                inputs.forEach(input => {
                    if(input.type === "checkbox") {
                        if(setting) {
                            input.parentElement.classList.remove('switch--disabled');
                        } else {
                            input.parentElement.classList.add('switch--disabled');
                        }
                        input.disabled = !setting;

                    }
                })
            }
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
        updateSettingsView(settings);
    });
}

document.querySelector("#reset").onclick = e => {
    e.preventDefault();
    let settings = defaultSettings;
    chrome.storage.local.set({'settings': settings});
    updateSettingsView(settings);
};

init(); //🚀
