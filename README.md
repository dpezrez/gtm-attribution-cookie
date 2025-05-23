# GTM Attribution Cookie (GTM Tag Template)

This Google Tag Manager (GTM) **Custom Template** sets a first-party cookie (and optionally into `localStorage`) to capture and persist attribution data across pages and sessions. It captures UTM parameters and advertising Click IDs, formats them into a JSON object, and stores it to be used wherever and whenever you need.

Built by [Daniel Perry-Reed](https://www.linkedin.com/in/danielperryreed/) – marketing analytics specialist at [Data to Value](https://www.datatovalue.com).

---

## 🚀 What This Does

* Captures UTM parameters (`utm_source`, `utm_medium`, etc.)
* Captures ad click IDs (`gclid`, `fbclid`, `msclkid`, and custom IDs)
* Stores attribution data in a first party **cookie** (and optioanlly **localStorage**)
* Syncs the data if one storage type is missing (e.g., cookie cleared, but localStorage present)
* URL-encodes individual values if needed
* Logs actions to the console (optional)

---

## 🛠️ How to Use

### 📦 Option 1: Import the Prebuilt GTM Container

This is the quickest setup method. You'll get the custom tag template, tag, cookie variable, and reader variables ready to go.

1. **Download the container file**

   📄 Download `gtm_attr_container.json` [here](./gtm_attr_container.json)

2. **Import into GTM**

   * Go to GTM > Admin > Import Container
   * Upload the file
   * Choose your workspace
   * Select **Merge** and **Rename conflicting tags/variables/templates**

3. **Review and publish**

   * Confirm the tag fires as expected
   * Publish your container

---

### 🛠️ Option 2: Manual Setup

### 1. Add the Custom Template

* Go to **Templates** > **New**
* Paste in the code from `gtm_attr_template.js` [here](./gtm_attr_template.js)

### 2. Configure Template Fields

| Field Name           | Type    | Description                                                    |
| -------------------- | ------- | -------------------------------------------------------------- |
| `cookieName`         | Text    | Name of the cookie to set (default: `gtm_attr`)                |
| `cookieDomain`       | Text    | Domain for the cookie (default: `auto`)                        |
| `cookieHours`        | Text    | Cookie lifetime in hours (default: `720`)                      |
| `extraClickIds`      | Text    | Comma-separated custom click ID keys (e.g. `ttclid,li_fat_id`) |
| `encodeValues`       | Boolean | Whether to URL-encode the individual UTM and click ID values   |
| `enableLocalStorage` | Boolean | Enables localStorage support and syncing                       |
| `logMessages`        | Boolean | If enabled, logs attribution logic to the browser console      |

### 3. Set Template Permissions

Ensure your template requests access to:

* `setCookie`, `getCookieValues`
* `localStorage` (read/write for key `gtm_attr`)
* `getQueryParameters`
* `logToConsole` (optional for debugging)

### 4. Create the Tag

* Go to **Tags** > New
* Choose your custom template
* Set trigger to **All Pages** or appropriate consent trigger

---

## 🧠 How Syncing Works

* When the tag fires, it checks both cookie and localStorage.
* If one is missing and the other exists, it copies the data to keep both in sync.
* This ensures attribution continuity even if a user clears cookies but not localStorage.

---

## 🔍 Example JSON Stored

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "spring_sale",
  "utm_content": "",
  "utm_term": "",
  "click_id": {
    "type": "gclid",
    "value": "abc123"
  }
}
```

---

## 🟦 About Data to Value

Built and maintained by myself and the team at [Data to Value](https://www.datatovalue.com) — your data activation partner helping marketing teams transform data into predictable revenue and growth.

---

## 📄 License

MIT
