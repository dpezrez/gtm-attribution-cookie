# GTM Attribution Cookie (GTM Tag Template)

This Google Tag Manager (GTM) **Custom Template** sets a first-party cookie (and optionally `localStorage`) to capture and persist attribution data across pages and sessions. It captures UTM parameters and advertising Click IDs, formats them into a JSON object, and stores it for reuse in your tags, analytics tools, or backend systems. Optionally, it can push the same data into the `dataLayer` for GA4 and GTM workflows.

Built by [Daniel Perry-Reed](https://www.linkedin.com/in/danielperryreed/) – analytics specialist at [Data to Value](https://www.datatovalue.com).

---

## 🚀 What This Does

* Captures **UTM parameters**:
  * `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `utm_source_platform`, `utm_creative_format`, and `utm_marketing_tactic`
* Captures common **ad click IDs** `gclid`, `fbclid` and `msclkid`
  * Optionally add your own custom defined IDs
* Captures **referrer info** `referrer.full` and `referrer.domain`
* Stores attribution data in a **first-party cookie**
  * Optionally stores attribution in **localStorage**
  * Automatically **syncs between cookie and localStorage** if one is missing
* Optionally pushes attribution data to the **dataLayer** as a GTM event
* Optionally **URL-encode** all values
* Optioanlly logging all actions to the browser console

---

## ✅ Changelog

| Version     | Changes |
|-------------|---------|
| **v0.1** | - Initial release with support for core UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`) <br> - Captured core click IDs (`gclid`, `fbclid`, `msclkid`) with option to add in custom list <br> - Optional localStorage backup with cookie-localStorage sync functionality <br> - Advanced options for overriding cookie settings <br> - Optional browser console logs |
| **v0.2** | - Added support for additional UTM parameters (`utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`) <br> - Added optional DataLayer push feature (with configurable event name) |
| **v0.3 (current)** | - Added support for capturing referrer info (`referrer.full` and `referrer.domain`) <br> - Added optional attribution update on referrers with no UTMs or Click IDs in the URL |
| **future plans** | - Optional custom mapping for traffic source/medium by click ID <br> - TBC, let me know! |

---

## 🛠️ How to Use

### 📦 Option 1: Import the Prebuilt GTM Container

This is the fastest way to get started. It includes the custom template, tag, some dataLayer variables, and dataLayer trigger.

1. **Download the container file**  
   📄 Download [`gtm_attr_container.json`](./gtm_attr_container.json)

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

| Field Name                      | Type     | Description                                                                 |
|--------------------------------|----------|-----------------------------------------------------------------------------|
| `cookieName`                   | Text     | Name of the cookie (default: `gtm_attr`)                                   |
| `cookieDomain`                 | Text     | Domain for the cookie (default: `auto`)                                    |
| `cookieHours`                  | Text     | Cookie lifetime in hours (default: `720`)                                  |
| `extraClickIds`                | Text     | Comma-separated custom click ID keys                                       |
| `encodeValues`                 | Checkbox | URL-encode attribution values                                              |
| `enableLocalStorage`           | Checkbox | Store attribution in localStorage                                          |
| `pushToDataLayer`              | Checkbox | Push attribution object to dataLayer as an event                           |
| `dataLayerEventName`           | Text     | Event name for DataLayer push (default: `gtm_attr`)                        |
| `overrideOnNewReferrerDomain`  | Checkbox | If enabled, JSON resets on new referrer domain (unless ignored)            |
| `ignoreDomains`                | Text     | Comma-separated list of domains to ignore (no update if referrer matches) |
| `logMessages`                  | Checkbox | Enable console logging for debugging                                       |


---

#### 3. Set Template Permissions

Ensure your template requests:

* `Set a cookie` and `Reads cookie value(s)` (any)
* `Access local storage` (read/write for key `gtm_attr`)
* `Access global variables` (dataLayer read/write)
* `getQueryParameters`
* `access_globals` for `dataLayer` (read/write)
* `Log to console` (always log)
* `Reads URL` (any)
* `Reads Referrer URL` (any)

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
  "utm_id": "12345",
  "utm_source_platform": "google_ads",
  "utm_creative_format": "responsive",
  "utm_marketing_tactic": "remarketing",
  "click_id": {
    "type": "gclid",
    "value": "abc123"
  },
  "referrer": {
    "full": "https://example.com/page",
    "domain": "example.com"
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
