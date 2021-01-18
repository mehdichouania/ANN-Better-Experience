const defaultSettings = {
    showAside: true,
    asideInjection: false,
    showNonGlobalArticles: true,
    showBanner: true,
    showSettings: true,
    showMenu: true,
    togglePageFullWidth: true,
    articlesPerLine: 5
}

let inputs = document.querySelectorAll('#app .switch input');

inputs.forEach(input => {
    let setting = input.getAttribute('data-setting');
    input.addEventListener('change', () => saveSettings(setting));
    if(input.type === 'number') {
        input.parentElement.querySelectorAll('div').forEach((node, key) => {
            node.addEventListener('click', ()=> dispatchNumericChange(setting, key === 1))
        })
    }
})

const updateView = (settings) => {
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
    });
}

const dispatchNumericChange = (setting, add) => {
    chrome.storage.local.get(['settings'], (data)=> {
        let settings = data.settings;
        settings[setting] = add ? settings[setting] + 1 : settings[setting] - 1;
        let input = document.querySelector(`input[data-setting='${setting}']`);
        if(parseInt(input.getAttribute('min')) <= settings[setting] && settings[setting] <= parseInt(input.getAttribute('max'))) {
            chrome.storage.local.set({'settings': settings});
        }
    });
}

document.querySelector("#reset").onclick = e => {
    e.preventDefault();
    let settings = defaultSettings;
    chrome.storage.local.set({'settings': settings});
};

chrome.storage.local.get(['settings'], (data)=> {
    let settings = data.settings ? data.settings : defaultSettings;
    if(!data.length) {
        chrome.storage.local.set({'settings': settings});
    }
    updateView(settings);
});

chrome.storage.onChanged.addListener(function(changes, local) {
    updateView(changes.settings.newValue);
});