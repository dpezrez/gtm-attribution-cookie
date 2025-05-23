/*
Built by Daniel Perry-Reed @ Data to Value
https://datatovalue.com/
*/

const log = require('logToConsole');
const getQueryParam = require('getQueryParameters');
const setCookie = require('setCookie');
const getCookieValues = require('getCookieValues');
const encodeUriComponent = require('encodeUriComponent');
const decodeUriComponent = require('decodeUriComponent');
const JSON = require('JSON');
const localStorage = require('localStorage');

// === Config from template fields ===
const cookieDomain = data.cookieDomain || 'auto';
const cookieName = data.cookieName || 'gtm_attr';
const cookieHours = data.cookieHours * 1 || 720;
const encodeValues = data.encodeValues === true;
const logToConsole = data.logMessages === true;
const enableLocalStorage = data.enableLocalStorage === true;

const extraClickIds = data.extraClickIds ? data.extraClickIds.split(',').map(function (id) { return id.trim(); }) : [];

const maxAge = cookieHours * 60 * 60; // in seconds

// === Sync localStorage and cookie if either exists ===
let existingCookie = getCookieValues(cookieName)[0];
let existingLocalStorage = localStorage.getItem('gtm_attr');

if (!existingCookie && existingLocalStorage) {
  // Sync from localStorage to cookie
  setCookie(cookieName, existingLocalStorage, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false);
  if (logToConsole) {
    log('🔄 Synced from local storage (gtm_attr) to cookie (' + cookieName + '):', existingLocalStorage);
  }
} else if (!existingLocalStorage && existingCookie && enableLocalStorage) {
  // Sync from cookie to localStorage
  localStorage.setItem('gtm_attr', existingCookie);
  if (logToConsole) {
    log('🔄 Synced from cookie (' + cookieName + ') to local storage (gtm_attr):', existingCookie);
  }
}

// === Gather attribution parameters from URL ===
const attribution = {
  utm_source: getQueryParam('utm_source') || '',
  utm_medium: getQueryParam('utm_medium') || '',
  utm_campaign: getQueryParam('utm_campaign') || '',
  utm_content: getQueryParam('utm_content') || '',
  utm_term: getQueryParam('utm_term') || ''
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
var hasData =
  attribution.utm_source ||
  attribution.utm_medium ||
  attribution.utm_campaign ||
  attribution.utm_content ||
  attribution.utm_term ||
  (attribution.click_id && attribution.click_id.value);

// === Store data in cookie and localStorage if present ===
if (hasData) {
  setCookie(cookieName, storageValue, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false);

  if (enableLocalStorage) {
    localStorage.setItem('gtm_attr', storageValue);
    if (logToConsole) {
      log('📦 Set localStorage gtm_attr:', storageValue);
    }
  }

  if (logToConsole) {
    log('🍪 Set cookie', cookieName + ':', storageValue);
  }
}

// === Notify GTM of tag success ===
data.gtmOnSuccess();
