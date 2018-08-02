// ==UserScript==
// @name QA Toolbox - PreRelease
// @namespace www.cobaltgroup.com/
// @version 3.3.2-beta28
// @author Eric Tanaka
// @include http:*
// @include https:*
// @connect assets-cdk.com
// @downloadURL https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/preRelease.user.js
// @resource toolStyles https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/css/toolbox.css
// @resource changeLog https://github.com/cirept/QA_Toolbox/raw/pre-release/docs/ChangeLog.md
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require https://cdn.rawgit.com/cirept/Typo.js/master/typo/typo.js
// @require https://cdn.rawgit.com/showdownjs/showdown/1.8.6/dist/showdown.min.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/pageInformationPanel/pageInformation.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/pageInformationPanel/dealerName.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/pageInformationPanel/webId.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/pageInformationPanel/pageName.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/pageInformationPanel/hTags.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/qaTools.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/imageChecker.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/linkChecker.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/spellCheck.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/bannedWords.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/speedTestPage.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/qaToolsPanel/checkLinks.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/otherToolsPanel/otherTools.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/otherToolsPanel/showNavigation.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/otherToolsPanel/seoSimplify.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/otherToolsPanel/widgetOutlines.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/otherToolsPanel/viewMobile.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/togglesPanel/toggles.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/togglesPanel/refreshPage.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/togglesPanel/previewBarToggle.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/urlModPanel/urlModifiers.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/urlModPanel/nextGenToggle.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/urlModPanel/m4Check.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/urlModPanel/autofillToggle.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/dynamicDisplayPanel/dynamicDisplay.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/base/shared.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/base/main.js
// @require https://github.com/cirept/QA_Toolbox/raw/pre-release/assets/js/dependencies/base/qaToolbox.js
// @run-at document-idle
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_info
// @grant GM_listValues
// @grant GM_addStyle
// @grant resource
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @noframes
// ==/UserScript==

/**
 * initialize toolbox
 */
qaToolbox.init();
