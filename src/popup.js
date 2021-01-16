const defaultSettings = {
    showBanner: true,
    showNonGlobalArticles: true,
    showSidebar: true,
    togglePageFullWidth: true,
    articlesPerLine: 3
}

// Recover settings
let reinedesputes = false;
let settings = reinedesputes ? 'lavaleurrécupérée' : defaultSettings;

// Apply settings
let inputs = document.querySelectorAll('#app .switch input');

const updateSettingsView = () => {
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
updateSettingsView();

const saveSettings = (input) => {
    let setting = input.getAttribute('data-setting');

    if (input.type === "checkbox") {
        settings[setting] = input.checked;
    }
    else { 
        settings[setting] = input.value;
    }
    console.log(settings)
}

inputs.forEach(input => {
    input.addEventListener('change', () => saveSettings(input));
})


document.querySelector("#reset").onclick = e => {
    e.preventDefault();
    settings = defaultSettings;
    updateSettingsView();
    console.log(settings)
};

export const init = ()=> {}
