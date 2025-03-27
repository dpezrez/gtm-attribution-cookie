# Google Tag Manager last-click attribution cookie
This Custom HTML tag for GTM stores the source information in a cookie, which can then be used as a variable in any other tag or solution.

## Instructions to use in GTM
1. Copy the .html file
2. In your GTM workspace, add a new CUstom HTML tag and paste the code
3. Replace the domains at the top of the code
4. Add the 'All pages' trigger (or a custom trigger to only fire on specific pages)
5. Add your consent conditions (usually for requiring analytics_storage)
6. Update your consent management platform and/or cookie banner to allow the "gtm_attr" cookies (usually under 'analytics' purposes)
7. Save and publish the container

## Details
The "gtm_attr" cookie is a pipe "|" delimitted string of the UTM and click ID vlaues present in the URL. The format is:

{MEDIUM}|{SOURCE}|{CAMPAIGN}|{CONTENT}|{TERM}|{CLICK ID}

Where the UTMs are collected form:
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term

And the click IDs are:
- Google - gclid, gclscr, wbraid and gad_source - setting cookies value as 'cpc|google||||[ID]'
- Meta - fbclid - setting cookies value as 'cpc|meta||||[ID]'
- Microsoft - msclkid - setting cookies value as 'cpc|microsoft||||[ID]'

It looks up a list of know search engines to populate the cookie as 'organic|[referrer_hostname]||||'.

If there is a referral domains (not a search engine), it then updates the cookie to 'referral|[referrer_hostname]||||'.

Else, it is attributed to direct with the cookie value '(none)|(direct)||||'. And if it is from a known referral exclusion domain (defined at the top of the code), then the cookie is set to '(none)|(direct)|(referral_excluded_direct)|||'.

## Using the cookie value
To use this cookie value, set up a new 1st Party Cookie Variable, and add the Cookie Name of 'gtm_attr'. You can then use this in any other tags as needed.
