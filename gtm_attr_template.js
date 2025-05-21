/*
Built by Daniel Perry-Reed @ Data to Value
https://datatovalue.com/
*/

const log = require('logToConsole');
const getQueryParam = require('getQueryParameters');
const setCookie = require('setCookie');
const encodeUriComponent = require('encodeUriComponent');
const JSON = require('JSON');

// === Config from template fields ===
const cookieDomain = data.cookieDomain || 'auto';
const cookieName = data.cookieName || 'gtm_attr';
const cookieHours = data.cookieHours * 1 || 720;
const encodeValues = data.encodeValues === true;
const logToConsole = data.logMessages === true;

const extraClickIds = data.extraClickIds ? data.extraClickIds.split(',').map(function (id) { return id.trim(); }) : [];

const maxAge = cookieHours * 60 * 60; // in seconds

// === UTM parameters ===
const attribution = {
  utm_source: getQueryParam('utm_source') || '',
  utm_medium: getQueryParam('utm_medium') || '',
  utm_campaign: getQueryParam('utm_campaign') || '',
  utm_content: getQueryParam('utm_content') || '',
  utm_term: getQueryParam('utm_term') || ''
};

// === Click ID logic ===
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
  for (let i = 0; i < extraClickIds.length; i++) {
    const key = extraClickIds[i];
    const val = getQueryParam(key);
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

// === Convert to JSON string ===
let cookieValue = JSON.stringify(attribution);
if (encodeValues) {
  cookieValue = encodeUriComponent(cookieValue);
}

// === Check if we have anything to store ===
const hasData =
  attribution.utm_source ||
  attribution.utm_medium ||
  attribution.utm_campaign ||
  attribution.utm_content ||
  attribution.utm_term ||
  (attribution.click_id && attribution.click_id.value);

// === Set cookie and optionally log ===
if (hasData) {
  setCookie(cookieName, cookieValue, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false);

  if (logToConsole) {
    log('🍪 gtm_attr set:', attribution);
  }
}

data.gtmOnSuccess();
