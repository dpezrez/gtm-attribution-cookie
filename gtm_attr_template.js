/*
Built by Daniel Perry-Reed @ Data to Value
https://datatovalue.com/
v0.2
*/

const log = require('logToConsole');
const getQueryParam = require('getQueryParameters');
const setCookie = require('setCookie');
const getCookieValues = require('getCookieValues');
const encodeUriComponent = require('encodeUriComponent');
const JSON = require('JSON');
const localStorage = require('localStorage');
const createQueue = require('createQueue');

// === Config from template fields ===
const cookieDomain = data.cookieDomain || 'auto';
const cookieName = data.cookieName || 'gtm_attr';
const cookieHours = data.cookieHours * 1 || 720;
const encodeValues = data.encodeValues === true;
const logToConsole = data.logMessages === true;
const enableLocalStorage = data.enableLocalStorage === true;
const pushToDataLayer = data.pushToDataLayer === true;
const dataLayerEventName = data.dataLayerEventName || 'gtm_attr';

const extraClickIds = data.extraClickIds ? data.extraClickIds.split(',').map(function (id) { return id.trim(); }) : [];

const maxAge = cookieHours * 60 * 60; // in seconds

// Create safe dataLayer push function
const dataLayerPush = createQueue('dataLayer');

// === Sync localStorage and cookie if either exists ===
let existingCookie = getCookieValues(cookieName)[0];
let existingLocalStorage = localStorage.getItem('gtm_attr');

if (!existingCookie && existingLocalStorage) {
  setCookie(cookieName, existingLocalStorage, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false);
  if (logToConsole) log('🔄 Synced from localStorage to cookie:', existingLocalStorage);
} else if (!existingLocalStorage && existingCookie && enableLocalStorage) {
  localStorage.setItem('gtm_attr', existingCookie);
  if (logToConsole) log('🔄 Synced from cookie to localStorage:', existingCookie);
}

// === Gather attribution parameters from URL ===
const attribution = {
  utm_source: getQueryParam('utm_source') || '',
  utm_medium: getQueryParam('utm_medium') || '',
  utm_campaign: getQueryParam('utm_campaign') || '',
  utm_content: getQueryParam('utm_content') || '',
  utm_term: getQueryParam('utm_term') || '',
  utm_id: getQueryParam('utm_id') || '',
  utm_source_platform: getQueryParam('utm_source_platform') || '',
  utm_creative_format: getQueryParam('utm_creative_format') || '',
  utm_marketing_tactic: getQueryParam('utm_marketing_tactic') || ''
};

// === Detect and store known or custom click IDs ===
let clickIdKey = '';
let clickIdValue = '';

if (getQueryParam('gclid')) {
  clickIdKey = 'gclid';
  clickIdValue = getQueryParam('gclid');
} else if (getQueryParam('fbclid')) {
  clickIdKey = 'fbclid';
  clickIdValue = getQueryParam('fbclid');
} else if (getQueryParam('msclkid')) {
  clickIdKey = 'msclkid';
  clickIdValue = getQueryParam('msclkid');
} else {
  for (var i = 0; i < extraClickIds.length; i++) {
    var key = extraClickIds[i];
    var val = getQueryParam(key);
    if (val) {
      clickIdKey = key;
      clickIdValue = val;
      break;
    }
  }
}

if (clickIdKey && clickIdValue) {
  attribution.click_id = {
    type: clickIdKey,
    value: clickIdValue
  };
}

// === Optionally encode individual attribution values ===
if (encodeValues) {
  for (var key in attribution) {
    if (typeof attribution[key] === 'string') {
      attribution[key] = encodeUriComponent(attribution[key]);
    } else if (typeof attribution[key] === 'object' && attribution[key] !== null) {
      for (var subKey in attribution[key]) {
        if (typeof attribution[key][subKey] === 'string') {
          attribution[key][subKey] = encodeUriComponent(attribution[key][subKey]);
        }
      }
    }
  }
}

// === Serialize attribution data to JSON string ===
var storageValue = JSON.stringify(attribution);

// === Determine if there is data worth storing ===
var hasData = false;
for (var key in attribution) {
  if (typeof attribution[key] === 'string' && attribution[key]) {
    hasData = true;
    break;
  } else if (typeof attribution[key] === 'object' && attribution[key] !== null && attribution[key].value) {
    hasData = true;
    break;
  }
}

// === Store data in cookie and localStorage if present ===
if (hasData) {
  setCookie(cookieName, storageValue, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false);
  if (logToConsole) log('🍪 Set cookie "' + cookieName + '":', storageValue);

  if (enableLocalStorage) {
    localStorage.setItem('gtm_attr', storageValue);
    if (logToConsole) log('📦 Set localStorage key "gtm_attr":', storageValue);
  }
}

// === Push to dataLayer if enabled ===
if (pushToDataLayer) {
  const dlData = {
    event: dataLayerEventName,
    attribution: attribution
  };
  dataLayerPush(dlData);
  if (logToConsole) log('📤 Pushed to dataLayer:', dlData);
}

// === Notify GTM of tag success ===
data.gtmOnSuccess();
