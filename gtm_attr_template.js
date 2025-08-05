/*
Built by Daniel Perry-Reed @ Data to Value
https://datatovalue.com/
v1.9 - Suppress cookie/localStorage update logs when no actual update occurs
*/

const log = require('logToConsole');
const getQueryParam = require('getQueryParameters');
const setCookie = require('setCookie');
const getCookieValues = require('getCookieValues');
const encodeUriComponent = require('encodeUriComponent');
const JSON = require('JSON');
const localStorage = require('localStorage');
const createQueue = require('createQueue');
const getReferrerUrl = require('getReferrerUrl');
const getType = require('getType');

const cookieDomain = data.cookieDomain || 'auto';
const cookieName = data.cookieName || 'gtm_attr';
const cookieHours = data.cookieHours * 1 || 720;
const encodeValues = data.encodeValues === true;
const logToConsole = data.logMessages === true;
const enableLocalStorage = data.enableLocalStorage === true;
const pushToDataLayer = data.pushToDataLayer === true;
const dataLayerEventName = data.dataLayerEventName || 'gtm_attr';
const overrideOnNewReferrerDomain = data.overrideOnNewReferrerDomain === true;

const ignoreDomains = data.ignoreDomains ? data.ignoreDomains.split(',').map(function(d){
  d = d.trim().toLowerCase();
  if (d.indexOf('http://') === 0) d = d.slice(7);
  if (d.indexOf('https://') === 0) d = d.slice(8);
  if (d.charAt(d.length-1) === '/') d = d.slice(0, -1);
  return d;
}) : [];

const extraClickIds = data.extraClickIds ? data.extraClickIds.split(',').map(function (id) { return id.trim(); }) : [];
const maxAge = cookieHours * 60 * 60;
const dataLayerPush = createQueue('dataLayer');

let didSyncPush = false;
let didUpdate = false; // Track if JSON actually changed

// Sync cookie and localStorage
let existingCookie = getCookieValues(cookieName)[0];
let existingLocalStorage = localStorage.getItem('gtm_attr');
if (!existingCookie && existingLocalStorage) {
  setCookie(cookieName, existingLocalStorage, { domain: cookieDomain, path: '/', 'max-age': maxAge }, false);
  if (logToConsole) log('🔄 Synced from localStorage to cookie:', existingLocalStorage);
  if (pushToDataLayer) {
    const dlData = { event: dataLayerEventName, attribution: JSON.parse(existingLocalStorage) };
    dataLayerPush(dlData);
    didSyncPush = true;
    if (logToConsole) log('📤 dataLayer push after sync from localStorage:', dlData);
  }
} else if (!existingLocalStorage && existingCookie && enableLocalStorage) {
  localStorage.setItem('gtm_attr', existingCookie);
  if (logToConsole) log('🔄 Synced from cookie to localStorage:', existingCookie);
}

let currentAttr = {};
if (existingCookie) {
  var parsed = JSON.parse(existingCookie);
  if (parsed && getType(parsed) === 'object') currentAttr = parsed;
}

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

let clickIdKey = '';
let clickIdValue = '';
if (getQueryParam('gclid')) { clickIdKey = 'gclid'; clickIdValue = getQueryParam('gclid'); }
else if (getQueryParam('fbclid')) { clickIdKey = 'fbclid'; clickIdValue = getQueryParam('fbclid'); }
else if (getQueryParam('msclkid')) { clickIdKey = 'msclkid'; clickIdValue = getQueryParam('msclkid'); }
else {
  for (var i = 0; i < extraClickIds.length; i++) {
    var key = extraClickIds[i];
    var val = getQueryParam(key);
    if (val) { clickIdKey = key; clickIdValue = val; break; }
  }
}
if (clickIdKey && clickIdValue) attribution.click_id = { type: clickIdKey, value: clickIdValue };

const fullReferrer = getReferrerUrl() || '';
const referrerDomain = getReferrerUrl('host') || '';
if (fullReferrer || referrerDomain) attribution.referrer = { full: fullReferrer, domain: referrerDomain };

let hasUtmOrClick = false;
for (var k in attribution) {
  if ((k.indexOf('utm_') === 0 && attribution[k]) || (k === 'click_id' && attribution[k])) {
    hasUtmOrClick = true;
    break;
  }
}

if (overrideOnNewReferrerDomain && referrerDomain) {
  let normalizedReferrerDomain = referrerDomain.toLowerCase();
  if (normalizedReferrerDomain.indexOf('http://') === 0) normalizedReferrerDomain = normalizedReferrerDomain.slice(7);
  if (normalizedReferrerDomain.indexOf('https://') === 0) normalizedReferrerDomain = normalizedReferrerDomain.slice(8);
  if (normalizedReferrerDomain.charAt(normalizedReferrerDomain.length-1) === '/') normalizedReferrerDomain = normalizedReferrerDomain.slice(0, -1);

  const isIgnored = ignoreDomains.indexOf(normalizedReferrerDomain) !== -1;

  if (isIgnored) {
    if (logToConsole) log('✅ Referrer matches ignore list; no update applied');
  } else if (normalizedReferrerDomain !== '' || hasUtmOrClick) {
    if (logToConsole) log('🔁 Override active: rebuilding JSON');
    currentAttr = {};
    for (var key in attribution) {
      if (attribution[key]) currentAttr[key] = attribution[key];
    }
    didUpdate = true;
  }
} else {
  if (hasUtmOrClick) {
    if (logToConsole) log('🔁 UTM or click ID detected: rebuilding JSON');
    currentAttr = {};
    for (var key in attribution) {
      if (attribution[key]) currentAttr[key] = attribution[key];
    }
    didUpdate = true;
  } else {
    if (logToConsole) log('ℹ️ No UTM or click ID found: JSON remains unchanged');
  }
}

if (encodeValues) {
  for (var key in currentAttr) {
    if (typeof currentAttr[key] === 'string') {
      currentAttr[key] = encodeUriComponent(currentAttr[key]);
    } else if (typeof currentAttr[key] === 'object' && currentAttr[key] !== null) {
      for (var subKey in currentAttr[key]) {
        if (typeof currentAttr[key][subKey] === 'string') currentAttr[key][subKey] = encodeUriComponent(currentAttr[key][subKey]);
      }
    }
  }
}

var storageValue = JSON.stringify(currentAttr);
var hasData = false;
for (var k in currentAttr) { hasData = true; break; }

if (hasData && didUpdate) {
  setCookie(cookieName, storageValue, { domain: cookieDomain, path: '/', 'max-age': maxAge }, false);
  if (logToConsole) log('🍪 Cookie updated:', cookieName, storageValue);
  if (enableLocalStorage) {
    localStorage.setItem('gtm_attr', storageValue);
    if (logToConsole) log('📦 localStorage updated: gtm_attr', storageValue);
  }
}

if (pushToDataLayer && !didSyncPush && (hasData || existingLocalStorage)) {
  const dlSource = hasData ? storageValue : existingLocalStorage;
  const dlData = { event: dataLayerEventName, attribution: JSON.parse(dlSource) };
  dataLayerPush(dlData);
  if (logToConsole) log('📤 dataLayer push with final JSON:', dlData);
}

data.gtmOnSuccess();
