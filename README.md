---
---

# Tool Descriptions<br>

## Page Information :new:
:one: [Dealer Name](#dealer-name)<br>
:two: [Web-ID](#web-id)<br>
:three: [Page Name](#page-name)<br>
:four: [H Tags](#h-tags)<br>

## QA Tools :new:
:one: [Image Checker](#image-checker)<br>
:two: [Link Checker](#link-checker) :sparkles:<br>
:three: [Spell Checker](#spellcheck-page)<br>
:four: [WebPageTest](#web-page-test)<br>
:five: [404 Link Checker](#404-link-checker) :sparkles:<br>

## Other Tools :new:
:one: [Show Navigation](#show-navigation)<br>
:two: [SEO Simplify](#seo-simplify)<br>

## Toggles :new:
:one: [Refresh Button](#refresh-button)<br>
:two: [Hide Preview Toolbar](#hide-preview-toolbar)<br>

## URL Modifiers :new:
:one: [Auto Apply Modifiers](#auto-apply-parameters)<br>
:two: [NextGen Parameter](#nextgen-parameter)<br>
:three: [Show Autofill Tags](#show-autofill-tags)<br>

---
---

<br>
<br>

## Page Information<br>

This panel shows all important information for the current CDK website you are viewing.<br>

*pic of Page Information Panel

***Features***<br>
Clicking on the info area will copy the text to your clipboard.  There will be no notification.

*gif here

### :one: Dealer Name<br>

This area will display the current dealer's ***NAME*** of the CDK site you are viewing.  This dealer name should be the same name as the dealer's "Account" name in Salesforce.

*gif here

### Web ID<br>

This area will display the current dealer's ***WEB-ID*** of the CDK site you are viewing.  This web-id should be the same name as the dealer's "WebID" name in Salesforce.  This is also used to navigate to the dealer's site in WSM for editting.

*gif here

### Page Name<br>

This area will display the current ***PAGE NAME*** of the CDK site you are viewing.  This information is what the 'generic' page name of the page is called.  This will help navigate to a specific page while editting the site in WSM.<br>

*e.g. LandingPage, HoursAndDirections, MiscPage.*

*gif here

### H Tags<br>

This area will display the current h tags on the current page you are viewing.  Any h tags that have a Zero (0) value will be highlighted in orange.<br>

***Clicking on the area will bring a pop up with all the h tags displayed***

*pic of h tag portion of panel
*pic of orange highlight

<br>
<br>

---
---

<br>
<br>

## QA Tools<br>


### :one: Show Navigation<br>

The navigation menu will display all sub-navigation items.  This will allow for users to easily check out each sub-navigation items.


**Features**

1. When clicking on any subnavigation item, it will turn the link a different color.<br>
   * Added to help keep track of what links you have already checked.

Show Navigation Functionality | Show Navigation Legend
----------------------------- | ----------------------
![Show Navigation Functionality](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/showNavigation.png) | ![Show Navigation Legend](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/showNavigationLegend.png)


#### TIP:<br>
>*Show Navigation + Link Checker can and should be used together to verify links in the navigation are correct.*


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### Link checker<br>
All links on the page will be highlighted with specific colors according to the validity of the link.

**Features**

*'HAS NO title text'*<br>
>All links that DO NOT HAVE title text in the link will be flagged<br>

*'HAS title text'*<br>
>All links that HAVE title text in the html code will be flagged<br>

*'OPENS IN A NEW WINDOW'*<br>
>All links that have 'targets' with these values will be flagged<br>
>_blank<br>
>_new<br>
>custom<br>

*'EMPTY OR UNDEFINED URL'*<br>
>All links that do not contain an href value will be flagged<br>

*'VERIFY URL'*<br>
>All links that have href these values will be flagged<br>
>&#35;<br>
>f_<br>
>www<br>
>http<br>

Link Checker Functionality | Link Checker Legend
----------------------------- | ----------------------
![Link Checker Functionality](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/linkChecker.png) | ![Link Checker Legend](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/linkCheckerLegend.png)

#### TIP:<br>
>*Show Navigation + Link Checker can and should be used together to verify links in the navigation are correct.*


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### Image Checker<br>
All images on the page will be highlighted in specific colors that tell the user, at a glance, what images have and do not have alt text

Image Checker Functionality | Image Checker Legend
----------------------------- | ----------------------
![Show Navigation Functionality](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/imageAltChecker.png) | ![Show Navigation Legend](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/imageCheckerLegend.png)


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### Spellcheck Page<br>
This tool will send the current page to be spell checked via third party website.<br>


**Functionality**


A new tab will open with the page already queued up for spell checking.  Once the spell checking is complete the page will autofill with all the ***possible*** miss-spelled words.

Spell Check Results Example |
----------------------------- |
![Spell Check Results](https://cdn.rawgit.com/cirept/NextGen/367ce2a9/images/spellCheck.png) |


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### 404 Checker<br>
All the links on the page will be tested for validity and highlight the links according to the result.


**Functionality**


*'Link to be Tested'*
>All links will initially have this coloring and be subsequently over-written depending the results of validity testing for each link.

*'Link is Working'*
>All links that result in a working page will be flagged.

*'Verify Link Works'*
>In addition to links that result in a 404 error, these other situations will also be flagged<br>
>
>Links that off of the site, other domains, will be flagged<br>
>e.g. facebook.com, google.com, google map links<br>
>
>Links that do not contain an href
>
>Links that are meant for mobile devices
>e.g. tel:+18009098244


404 Checker Functionality | 404 Checker Legend
----------------------------- | ----------------------
![404 Checker Functionality](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/link404checker.png) | ![404 Checker Legend](https://cdn.rawgit.com/cirept/NextGen/5567c3d4/images/link404checkerLegend.png)


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### Web Page Test<br>
Will send in a query to WebPageTest.org of the currently viewed page.


**Functionality**

A new tab will open with the page already queued up for speed testing.  Once the testing has been completed the results of the test will be displayed.

>The results will show the page load times for the site. The results page will also help with determining what is causing slow load times if necessary.<br>
>Benchmark for desktop site = load time < 10 sec.


**Features**

In the "Advanced Settings" (below the button) you are able to enter an email address and change the browser you would like to test in.

This email address will recieve an email once the testing has been completed with a link that leads to the results page.  Simply leave it blank if this feature isn't desired.

By default the testing is set to IE11, please do not change this unless necessary.  IE11 would be the best test case as it is commonly the slowest amoungst all the 'popular' browsers.

****update****<br>
Key Selection, if you ever recieve the error that is along the lines of "limit has been reached for day" please choose a different key and submit another test.


WebPageTest Settings | WebPageTest Prompt
----------------------------- | ----------------------
![WebPageTest Settings](https://cdn.rawgit.com/cirept/NextGen/e101c74d/images/webPageTestSettings.png) | ![WebPageTest Prompt](https://cdn.rawgit.com/cirept/NextGen/e101c74d/images/webPageTestPrompt.png)


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### 404 Link Checker<br>
Will send in a query to WebPageTest.org of the currently viewed page.


**Functionality**

A new tab will open with the page already queued up for speed testing.  Once the testing has been completed the results of the test will be displayed.

>The results will show the page load times for the site. The results page will also help with determining what is causing slow load times if necessary.<br>
>Benchmark for desktop site = load time < 10 sec.


**Features**

In the "Advanced Settings" (below the button) you are able to enter an email address and change the browser you would like to test in.

This email address will recieve an email once the testing has been completed with a link that leads to the results page.  Simply leave it blank if this feature isn't desired.

By default the testing is set to IE11, please do not change this unless necessary.  IE11 would be the best test case as it is commonly the slowest amoungst all the 'popular' browsers.

****update****<br>
Key Selection, if you ever recieve the error that is along the lines of "limit has been reached for day" please choose a different key and submit another test.


WebPageTest Settings | WebPageTest Prompt
----------------------------- | ----------------------
![WebPageTest Settings](https://cdn.rawgit.com/cirept/NextGen/e101c74d/images/webPageTestSettings.png) | ![WebPageTest Prompt](https://cdn.rawgit.com/cirept/NextGen/e101c74d/images/webPageTestPrompt.png)


<br>
[Back to Top](#tool-descriptions)
<br>

---
---

<br>
<br>


### SEO Simplify<br>
