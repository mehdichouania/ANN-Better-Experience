let style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('annbe.css');
(document.head||document.documentElement).appendChild(style);

chrome.storage.local.get(['settings'], (data) => {
    let settings = data.settings;
    updateView(settings);
});

chrome.storage.onChanged.addListener(function(changes, local) {
    updateView(changes.settings.newValue);
});

const updateView = (settings) => {
    // showAside
    let aside = document.querySelector('#aside') ? document.querySelector('#aside') : document.querySelector('#mainfeed div[data-id="aside"]');
    aside.style.display = settings.showAside ? 'block' : 'none';

    // showBanner
    document.querySelector('#marquee').setAttribute('class', settings.showBanner ? '' : 'marquee--hidden');

    // showSettings
    document.querySelector('.controls').style.display = settings.showSettings ? 'block' : 'none';

    // asideInjection
    // let clone = aside.cloneNode();
    if(settings.asideInjection) {
        if(!document.querySelector('#mainfeed div[data-id="aside"]')) {
            aside.classList.add('mainfeed-day');
            aside.setAttribute('data-id', 'aside');
            document.querySelector('#mainfeed div[data-id="aside"]').removeAttribute('id');

            let div = document.createElement('div');
            div.classList.add('mainfeed-section');
            div.classList.add('herald-boxes');
            while (aside.firstChild) {
                div.appendChild(aside.removeChild(aside.firstChild).cloneNode(true));
            }
            aside.appendChild(div);
            aside.querySelector('.mainfeed-section').querySelectorAll('.herald.box').forEach(node => {
                node.classList.remove('aside');
                document.querySelectorAll('.thumbnail.lazyload').forEach(node => {
                    node.style.backgroundImage= `url(${node.getAttribute('data-src')})`
                })
            }) 
        }
    } else {
        if(document.querySelector('#mainfeed div[data-id="aside"]')) {
            aside = document.querySelector('#mainfeed div[data-id="aside"]');

            let divdemorts = aside.querySelector('.mainfeed-section');
            while (divdemorts.firstChild) {
                aside.appendChild(divdemorts.removeChild(divdemorts.firstChild).cloneNode(true));
            }
            divdemorts.parentElement.removeChild(divdemorts);
            
            aside.setAttribute('id', 'aside');
            aside = document.querySelector('#aside');
            aside.querySelectorAll('.herald.box').forEach(node => {
                node.classList.add('aside');
            }) 

            aside.removeAttribute('data-id');
            aside.classList.remove('mainfeed-day');
        }
    }

    // articlePerLines && togglePageFullWidth
    document.querySelectorAll('.mainfeed-day .mainfeed-section').forEach(e => {
        e.style.display='grid';
        e.style.gridTemplateColumns= `repeat(${settings.articlesPerLine}, ${ settings.togglePageFullWidth ? '1fr' : '380px'})`;
        e.querySelectorAll('.herald.box').forEach(e => {
            e.style.width='auto';
        })
    })

    // togglePageFullWidth
    let sectionMain = document.querySelector('#main');
    let sectionMainStyle = {
        width: main.style.width,
        maxWidth: main.style.maxWidth,
    }
    main.style.width = settings.togglePageFullWidth ? "auto" : sectionMainStyle.width;
    main.style.maxWidth = settings.togglePageFullWidth ? "none" : sectionMainStyle.maxWidth;

    // showNonGlobalArticles
    document.querySelectorAll('.mainfeed-day .herald.box').forEach(node => {
        if(node.getAttribute('data-topics').includes('local')) {
            node.style.display = settings.showNonGlobalArticles ? 'block' : 'none';
        }
    })
}
