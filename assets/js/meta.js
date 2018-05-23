// ==UserScript==
// @name QA Toolbox 3.3.2-beta17
// @namespace www.cobaltgroup.com/
// @version 3.3.2-beta17
// @author Eric Tanaka
// @include http:*
// @include https:*
// @connect assets-cdk.com
// @downloadURL https://raw.githubusercontent.com/cirept/QA_Toolbox/master/assets/js/meta.user.js
// @resource toolStyles https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/css/toolbox.css
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require https://cdn.rawgit.com/cirept/Typo.js/master/typo/typo.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/pageInformationPanel/pageInformation.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/pageInformationPanel/dealerName.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/pageInformationPanel/webId.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/pageInformationPanel/pageName.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/pageInformationPanel/hTags.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/qaTools.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/imageChecker.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/linkChecker.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/spellCheck.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/speedTestPage.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/qaToolsPanel/checkLinks.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/otherToolsPanel/otherTools.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/otherToolsPanel/showNavigation.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/otherToolsPanel/seoSimplify.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/otherToolsPanel/widgetOutlines.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/otherToolsPanel/viewMobile.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/togglesPanel/toggles.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/togglesPanel/refreshPage.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/togglesPanel/previewBarToggle.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/urlModPanel/urlModifiers.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/urlModPanel/nextGenToggle.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/urlModPanel/m4Check.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/urlModPanel/autofillToggle.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/dynamicDisplayPanel/dynamicDisplay.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/base/shared.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/base/main.js
// @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.2-beta17/assets/js/dependencies/base/qaToolbox.js
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
