# GTM Attribution Cookie (GTM Tag Template)

This Google Tag Manager (GTM) **Custom Template** sets a first-party cookie (and optionally `localStorage`) to capture and persist attribution data across pages and sessions. It captures UTM parameters and advertising Click IDs, formats them into a JSON object, and stores it for reuse in your tags, analytics tools, or backend systems. Optionally, it can push the same data into the `dataLayer` for GA4 and GTM workflows.

Built by [Daniel Perry-Reed](https://www.linkedin.com/in/danielperryreed/) – analytics specialist at [Data to Value](https://www.datatovalue.com).

---

## 🚀 What This Does

* Captures UTM parameters:
  * `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
  * **Extended support** for `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`
* Captures common ad click IDs (`gclid`, `fbclid`, `msclkid`) and optional custom IDs
* Stores attribution data in a **first-party cookie** (and optionally in `localStorage`)
* Automatically **syncs between cookie and localStorage** if one is missing
* Optionally pushes attribution data to the **dataLayer** as a GTM event
* URL-encodes individual values if needed
* Debug logging to the console (optional)

---

## ✅ Changelog

| Version     | Changes |
|-------------|---------|
| **v0.1** | - Initial release with support for core UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`) <br> - Captured core click IDs (`gclid`, `fbclid`, `msclkid`) with option to add in custom list <br> - Optional localStorage backup with cookie-localStorage sync functionality <br> - Advanced options for overriding cookie settings <br> - Optional browser console logs |
| **v0.2 (current)** | - Added support for additional UTM parameters (`utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`) <br> - Added optional DataLayer push feature (with configurable event name) |
| **future plans** | - Optional custom mapping for traffic source/medium by click ID <br> - TBC, let me know! |

---

## 🛠️ How to Use

### 📦 Option 1: Import the Prebuilt GTM Container

This is the fastest way to get started. It includes the custom template, tag, some dataLayer variables, and dataLayer trigger.

1. **Download the container file**  
   📄 [Download `gtm_attr_container.json`](./gtm_attr_container.json)

2. **Import into GTM**
   * Go to **GTM > Admin > Import Container**
   * Upload the file
   * Choose your workspace
   * Select **Merge** and **Rename conflicting tags/variables/templates**

3. **Review and publish**
   * Confirm the tag fires as expected
   * Publish your container

---

### 🛠️ Option 2: Manual Setup

#### 1. Add the Custom Template

* Go to **Templates > New**
* Paste in the code from [`gtm_attr_template.js`](./gtm_attr_template.js)

#### 2. Configure Template Fields

| Field Name            | Type     | Description                                                                 |
|-----------------------|----------|-----------------------------------------------------------------------------|
| `cookieName`          | Text     | Name of the cookie (default: `gtm_attr`)                                   |
| `cookieDomain`        | Text     | Domain for the cookie (default: `auto`)                                    |
| `cookieHours`         | Text     | Cookie lifetime in hours (default: `720`)                                  |
| `extraClickIds`       | Text     | Comma-separated custom click ID keys (e.g. `ttclid,li_fat_id`)             |
| `encodeValues`        | Checkbox | URL-encode attribution values                                               |
| `enableLocalStorage`  | Checkbox | Store attribution in localStorage                                           |
| `pushToDataLayer`     | Checkbox | Push attribution object to dataLayer as an event                           |
| `dataLayerEventName`  | Text     | Event name for DataLayer push (default: `gtm_attr`; shown only if enabled) |
| `logMessages`         | Checkbox | Enable console logging for debugging                                        |

---

#### 3. Set Template Permissions

Ensure your template requests:

* `setCookie`, `getCookieValues`
* `localStorage` (read/write for key `gtm_attr`)
* `getQueryParameters`
* `access_globals` for `dataLayer` (read/write)
* `logToConsole` (optional)

---

#### 4. Create the Tag

* Go to **Tags > New**
* Choose your custom template
* Set the trigger to **All Pages** or an appropriate consent-based trigger

---

## 🧠 How Syncing Works

* When the tag fires:
  * If **cookie is missing but localStorage exists**, sync from localStorage to cookie
  * If **localStorage is missing but cookie exists**, sync from cookie to localStorage
* This ensures attribution continuity even if cookies are cleared while localStorage remains intact

---

## 🔍 Example JSON Stored

**Cookie / localStorage value:**

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "spring_sale",
  "utm_content": "",
  "utm_term": "",
  "utm_id": "12345",
  "utm_source_platform": "google_ads",
  "utm_creative_format": "responsive",
  "utm_marketing_tactic": "remarketing",
  "click_id": {
    "type": "gclid",
    "value": "abc123"
  }
}
```

**DataLayer event (if enabled):**

```javascript
dataLayer.push({
  event: "gtm_attr",
  attribution: {
    ...same as above...
  }
});
```

---

## 🟦 About Data to Value

Built and maintained by myself and the team at [Data to Value](https://www.datatovalue.com) — your data activation partner helping marketing and RevOps teams transform data into predictable revenue and growth.

---

## 📄 License

MIT
