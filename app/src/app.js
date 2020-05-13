import i18next from 'i18next'
import resources from '../locales'
import _ from 'lodash';
import './style.scss'

i18next.init({
    lng: 'en',
    debug: true,
    fallbackLng: 'en',
    resources: resources
}, function (err, t) {
    if (err) return console.log('something went wrong with i18next', err);
    renderLang();
});

i18next.on('languageChanged', () => {
    renderLang();
});

function renderHelper(sourceSelector, targetSelector, key) {
    let compiled = _.template(document.querySelector(sourceSelector).textContent);
    document.querySelector(targetSelector).innerHTML = compiled(i18next.t(key, {
        returnObjects: true
    }));
}

function renderLang() {

    document.querySelector('title').innerHTML = i18next.t('site.title');

    renderHelper('#section1-template', '.section1', 'section1');
    renderHelper('#section2-template', '.section2', 'section2');
    renderHelper('#section3-template', '.section3', 'section3');
    renderHelper('#section4-template', '.section4', 'section4');
    renderHelper('#section5-template', '.section5', 'section5');

}

import './script.js'