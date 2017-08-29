# Change Log

## v3.3.1.3 - **(8/28/2017)**

### Image Alt, Link Title, and 404 Link checker tools
* Increased scroll duration to allow adeqate time for images to fully load before running tool

### Spell Checker
* Added words to custom dictionary
  * GMC, smartphone, fundraiser, AWD, V6, v8, QX56, moonroof, keyless, M36, M37, oversteer, understeer, Craigslist, CarMax, Creve Coeur, Ballwin, GoodYear, Michelin, Bridgestone, Pirelli, Kumho, BFGoodrich, Dunlop, infinitiusa, CARFAX, SiriusXM, JX35, reimagine, G25, G37, eyewear

<br><br>

---

<br><br>

## v3.3.0 - **(7/11/2017)**

* Did major re-work to the tool to support Next Gen support.
  * ***The tool instructions will be updated at a later date***
* ***The legend(s) can now be dragged*** across the screen to prevent it from blocking any content that needs to be QA'd.
* **Included a change log pop-up**
  * ***Scroll all the way to the bottom to close the pop up.***

### Spell Checker
  * Updated tool to work directly on the page vs. use the third party site.
    * **Directions** : The tool will highlight all miss-spelled words on the page in pink.
    * **Information** : The dictionary is customizable, so we can add the custom words that we know are spelled correctly to it.  Please visit [Github Issue Submission](https://github.com/cirept/QA_Toolbox/issues) to submit your words.
    * **Words already added to dictionary**
      * All GMC vehicles
      * All Buick vehicles
      * All INFINITI vehicles
      * All Chevrolet vehicles
      * All Nissan vehicles
      * All Hyundai vehicles
      * All Volkswagen vehicles
        * ***All OEMs listed also have their brand name added to the dictionary.***
    * **NOTE** : **The tool will not take CSS into consideration when checking the text on the page.**  For example: the hours widget on Next Gen will show up as incorrectly spelled because the widget relies on CSS to make the text all uppercase.  **Capitalization is taken into consideration when the tool checks text on the page.**

### Link Checker
  * Tool will now automatically scroll down the page in order to properly load all the content before running the tool.

### Image Alt Checker
  * Tool will now automatically scroll down the page in order to properly load all the content before running the tool.

### 404 Link Checker
  * Tool will now automatically scroll down the page in order to properly load all the content before running the tool.

### h Tag display
  * Fixed issue where some of the h tags would not get displayed in the pop up.

### SEO Simplify
  * Updated code to remove ALL html elements from the user provided input except links.

<br><br>

---

<br><br>

## v3.2.9 - **(6/29/2017)**

* Added additional styles to the Show Navigation tool to compensate for the fix that was applied to address the INFINITI navigation bars. :exclamation:
  * The subnavigation was being displayed with black text on black background.

<br><br>

---

<br><br>

## v3.2.8 - **(6/22/2017)**

* Fixed the Show Navigation tool. :exclamation:
  * The subnavigation was being displayed with white text on a white background.

<br><br>

---

<br><br>

## v3.2.7 - **(4/5/2017)**

* Fixed the 404 Link checker. :exclamation:
  * It was automatcially fixing the issues that was found by building out a completely new, WORKING link
* Moved 'Show Navigation' tool into the 'Other Tools' Panel

<br><br>

---

<br><br>

## v3.2.6 - **(3/30/2017)**

* Combined outdated link checker into the link checker tool. :exclamation:
  * Added an additional color to the legend for 'outdated' flagged links.
  * A teal border will appear around the link. instructions will get updated soon with pictures
* Disabled the 404 checker tool on NEXTGEN, there are some bugs that broke it during previous updates. Time is needed to discover what caused the issue. :exclamation:

<br><br>

---

<br><br>

## v3.2.5.3 - **(3/30/2017)**

* Update v3.2.5.2 has updates not worth mentioning.  :]
* Disabled 404 link checker for NEXTGEN :exclamation:
  * The tool was flagging links green even though it lead to a 404 page.  The tool works on TETRA.  Further investigation is needed to resolve the issue.  Removing feature until a fix has been made.

<br><br>

---

<br><br>

## v3.2.5.1 - **(3/24/2017)**

* Fixed issue with search criteria on VSR and modelshowroom pages :exclamation:
* Added h tag display function to 'H Tags' in Page Information Panel :new:
  * Click on the H Tag counts in Page Information Panel for additional information.

<br><br>

---

<br><br>

## v3.2.5 - **(3/20/2017)**

* Fixed issue with'link checker' tool not properly highlighting link that open in a new tab
  * Custom created NextGen links have a target='custom'.
    * Added this check to the tool decision structure

<br><br>

---

<br><br>

## v3.2.4 - **(3/17/2017)**

* Fixed issue with toolbar not working in FireFox
  * Web pages no longer have jQuery added to site
  * Web pages no longer have fontAwesome added to site ([ionIcons](http://ionicons.com/) is now being used)
    * Modified code to manually add files to site

<br><br>

---

<br><br>

## v3.2.3 - **(3/17/2017)**

* Combined TETRA and NEXTGEN toolbars into one. :new:
  * Toolbar will customize to the current site you are viewing, TETRA or NEXTGEN
    * Color theme will change
    * Position on page will change
    * Overall design has changed
  * Tools will be enabled/disabled; some tools not needed on NEXTGEN

### Tool Changes
* H Tags Display added to "Page Information" panel :new:
  * Will display all h Tag counts on currently viewed page
    * Will highlight in orange all h tag counts that equal 0
* SEO Simplify available on NEXTGEN and TETRA :exclamation:
  * Functionality changed
    * SEO output will now overlay on the page with the text inside.

### Misc Changes
* Toolbar now remembers if you closed the toolbar. :new:
  * e.g. User minimizes the toolbar (clicking the 'X' at the top of the toolbar), the user opens a new page.  The toolbar will remain minimized until the user chooses to restore the toolbar.<br>
* Added minimize function. :new:
  * Click the 'x' at the top
    * The toolbar will stay minimized until restored.

### Instructions Update
* [Coming Soon](https://github.com/cirept/NextGen/blob/master/README.md)<br>

<br><br>

---

<br><br>

## v3.2.2 - **(3/7/2017)**

- Added "Choose Key" option
- Will address the "The test request will exceed the daily test limit for the given API key" that is received.
<br><br>

---

<br><br>

## v3.2.1 - **(3/3/2017)**

- toolbar works on nextgen live sites
- Fixed refresh button placement issue
- Re-worked NextGen toggle functionality
- Hid the NextGen toggle on live sites, shouldn't be needed
- Fixed 'autofill toggle' to work on live sites

<br><br>

---

<br><br>

## v3.2 - **(3/2/2017)**

- Updated thickness of border around link checker "Verify URL"
- Moved "show navigation" and "link checker" tools closer together for easier use.
- Adjusted hints in the legends to mouse click
- Adjusted location of reload button
