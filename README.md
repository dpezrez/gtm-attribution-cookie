# GTM Attribution Cookie (GTM Tag Template)

This Google Tag Manager (GTM) **Custom Template** sets a first-party cookie to capture and persist attribution data across sessions. It captures UTM parameters and common advertising Click IDs, formats them into a single **JSON object**, and stores it as a cookie for long-term use.

Built by [Daniel Perry-Reed](https://www.linkedin.com/in/danielperryreed/) – marketing analytics specialist at [Data to Value](https://www.datatovalue.com).

---

## 🚀 How to Use

### 📦 Option 1: Import the Prebuilt GTM Container

This is the easiest method — you’ll get the custom tag template, tag, cookie variable, and JSON reader variables already set up.

1. **Download the container file**

   📅 Download `gtm_attr_container.json` [here](https://github.com/dpezrez/gtm-attribution-cookie/blob/main/gtm_attr_container.json)

2. **Import into GTM**

   * Go to your GTM container > Admin > Import Container
   * Upload the JSON file
   * Select your workspace
   * Choose **Merge** and **Rename conflicting tags/variables/templates**

3. **Review and publish**

   * Ensure the imported tag is firing as expected
   * Publish your container

### 🛠️ Option 2: Manual Setup

Follow these steps if you're setting up the attribution cookie template manually.

#### 1. Add the Custom Template Code

* Go to **Templates** > **New**
* Paste in the code from `gtm_attr_template.js` [here](https://github.com/dpezrez/gtm-attribution-cookie/blob/main/gtm_attr_template.js)

#### 2. Set Template Permissions

```json
{
  "permissions": {
    "cookies": [{ "match": ".*", "type": "WRITE" }],
    "apiAccess": [
      "getQueryParameters",
      "setCookie",
      "logToConsole",
      "encodeUriComponent",
      "JSON"
    ]
  }
}
```

#### 3. Configure Template Fields

| Field Name      | Type    | Description                                                                  |
| --------------- | ------- | ---------------------------------------------------------------------------- |
| `cookieName`    | Text    | Name of the cookie to set (`gtm_attr` by default)                            |
| `cookieDomain`  | Text    | Domain for the cookie (`auto` by default)                                    |
| `cookieHours`   | Text    | Cookie lifetime in hours (default: `720`)                                    |
| `extraClickIds` | Text    | Comma-separated custom click ID keys (e.g. `ttclid,li_fat_id`)               |
| `encodeValues`  | Boolean | Whether to URL-encode the values before storing                              |
| `logMessages`   | Boolean | If checked, logs the attribution object to the browser console for debugging |

#### 4. Create the Tag

* Go to **Tags** > New
* Choose your custom template
* Set trigger to **All Pages** or appropriate consent update trigger
* Configure consent settings
* Save and publish

---

## 🔍 Reading Cookie Values

To extract individual values from the JSON cookie, use our companion template:

> 🔗 **JSON Cookie Reader** Variable Template (separate repo) [here](https://github.com/dpezrez/gtm-json-cookie-reader)

This lets you input a cookie name and key path (e.g. `click_id.value`) and automatically returns the value.

### 🧠 Example JSON Format

The cookie value will look like this (after decoding):

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

You can then retrieve:

* `utm_source` → `google`
* `click_id.value` → `abc123`
* `click_id.type` → `gclid`

---

## 🟦 About Data to Value

Built and maintained by myself and the team at [Data to Value](https://www.datatovalue.com) — your data activation partner helping marketing teams transform data into predictable revenue and growth.

---

## 📄 License

MIT
