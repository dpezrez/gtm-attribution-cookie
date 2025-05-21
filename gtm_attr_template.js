// === IMPORTS ===
const log = require('logToConsole');
const getQueryParam = require('getQueryParameters');
const setCookie = require('setCookie');
const encodeUriComponent = require('encodeUriComponent');

// === CONFIGURATION ===
const cookieDomain = data.cookieDomain || 'auto';
const cookieName = data.cookieName || 'gtm_attr';
const cookieHours = data.cookieHours * 1 || 720;
const encodeValues = data.encodeValues === true;
const extraClickIds = data.extraClickIds ? data.extraClickIds.split(',').map(function(id) { return id.trim(); }) : [];
const maxAge = cookieHours * 3600;

// === UTILITY ===
function maybeEncode(val) {
  return encodeValues ? encodeUriComponent(val) : val;
}

// === UTM PARAMETERS ===
const utm_source   = maybeEncode(getQueryParam('utm_source') || '');
const utm_medium   = maybeEncode(getQueryParam('utm_medium') || '');
const utm_campaign = maybeEncode(getQueryParam('utm_campaign') || '');
const utm_content  = maybeEncode(getQueryParam('utm_content') || '');
const utm_term     = maybeEncode(getQueryParam('utm_term') || '');

// === CLICK ID DETECTION (PRIORITY ORDER: gclid → fbclid → msclkid → extra) ===
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
    const key = extraClickIds[i].trim();
    const val = getQueryParam(key);
    if (val) {
      clickIdKey = key;
      clickIdValue = val;
      break;
    }
  }
}

// === FORMAT CLICK ID COMPONENT (key:value, encode value only) ===
let clickIdComponent = '';
if (clickIdKey && clickIdValue) {
  clickIdComponent = clickIdKey + ':' + maybeEncode(clickIdValue);
}

// === FINAL COOKIE VALUE FORMAT ===
const value = utm_medium + '|' +
              utm_source + '|' +
              utm_campaign + '|' +
              utm_content + '|' +
              utm_term + '|' +
              clickIdComponent;

// === SET COOKIE IF ANY VALUES PRESENT ===
if (utm_source || utm_medium || utm_campaign || utm_content || utm_term || clickIdComponent) {
  setCookie(cookieName, value, {
    domain: cookieDomain,
    path: '/',
    'max-age': maxAge
  }, false); // encode: false — values already encoded
  log('Cookie "' + cookieName + '" set to: ' + value + ' (domain: ' + cookieDomain + ', encode: ' + encodeValues + ')');
}

// === COMPLETE ===
data.gtmOnSuccess();
