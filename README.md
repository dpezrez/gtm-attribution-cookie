# GTM Custom Template: Attribution Cookie Writer (`gtm_attr`)

This Google Tag Manager (GTM) **Custom Template** sets a first-party cookie to capture and persist attribution data across sessions. It captures UTM parameters and common advertising click IDs, formats them into a single cookie value, and stores it for long-term use.

Built by [Daniel Perry-Reed](https://www.linkedin.com/in/danielperryreed/) - marketing analytics specialist at [Data to Value](https://www.datatovalue.com).

---

# 🚀 How to Use

## 📦 Option 1: Import the Prebuilt GTM Container

This method lets you skip all manual setup steps. You’ll get the custom template, tag, and supporting variables already configured.

1. **Download the container file**

   * Download the file named: `gtm_attr_container.json` [here](https://github.com/dpezrez/gtm-attribution-cookie/blob/main/gtm_attr_container.json)

2. **Open your GTM Workspace**

   * Navigate to your container > Admin > Import Container

3. **Import the JSON file**

   * Upload the `gtm_attr_container.json`
   * Choose your workspace
   * Select **Merge** and **Rename conflicting tags/variables/templates** if needed

4. **Review and publish**

   * Ensure the imported tag is firing as expected on all pages
   * Publish your container

---

## 🛠 Option 2: Manual Setup

Follow these steps if you're manually setting up the attribution cookie template in GTM:

### 1. Add the Custom Template Code

* Open GTM > Templates

* Click **New** under Tag Templates

* Paste in the JavaScript code from`/gtm_attr_template.js` [here](https://github.com/dpezrez/gtm-attribution-cookie/blob/main/gtm_attr_template.js)

### 2. Set Template Permissions

In the template editor, configure the required permissions as shown below:

```json
{
  "permissions": {
    "cookies": [{ "match": ".*", "type": "WRITE" }],
    "apiAccess": [
      "getQueryParameters",
      "setCookie",
      "logToConsole"
    ]
  }
}
```

### 3. Configure Template Fields

| Field Name      | Type    | Description                                                                      |
| --------------- | ------- | -------------------------------------------------------------------------------- |
| `cookieName`    | Text    | Override the name of the cookie to set (`gtm_attr` by default)                   |
| `cookieDomain`  | Text    | Override the domain to set the cookie on (`auto` by default)                     |
| `cookieHours`   | Text    | Override the lifetime of the cookie in hours (720 by default - 30 days)          |
| `extraClickIds` | Text    | Comma-separated list of extra click ID parameters (e.g. `ttclid,li_fat_id`)      |
| `encodeValues`  | Boolean | Whether to encode each UTM and Click ID values before storing (false by default) |

### 4. Create the Cookie Variable

* Go to **Variables** > New > Variable Type: **1st Party Cookie**
* Cookie name: `gtm_attr` (or whatever name you are using)

### 5. Create the Tag

* Go to **Tags** > New

* Choose your custom template

* Set trigger to **All Pages** (or Initialization, or cookie banner consent update, etc.)

* Set your consent dependencies

* Save and publish

### 6. Create JS Variables to Read Values (as needed)

For example, to extract `utm_source`:

```javascript
function() {
  var value = {{YOUR COOKIE VARIABLE}};
  if (value) return decodeURIComponent(value.split('|')[1] || '');
  return '';
}
```

Use index references:

* `[0]` → `utm_medium`
* `[1]` → `utm_source`
* `[2]` → `utm_campaign`
* `[3]` → `utm_content`
* `[4]` → `utm_term`
* `[5]` → `click_id_type:click_id_value`

Split `[5]` by `:` to isolate the click ID type and value.

---

# 🤝 About Data to Value

Built and maintained by myself and the team at [Data to Value](https://www.datatovalue.com) — your data activation partner helping marketing teams transform your into predictable revenue growth.

---

# 📄 License

MIT
