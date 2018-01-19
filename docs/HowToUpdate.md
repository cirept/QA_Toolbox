# how to update the QA Tool

**first a little back story behind this particular process**

- Please follow these instructions when performing modifications to the tool in order to quickly and easily get your changes approved and published to all the QA Tool's users.  If you find a better way.  Then I am all ears.  :]

- If you are not familiar with using Github, don't fret!  There are a ton of guides out there to learn the git workflow.  Here are a few good resources to start you off.
    - https://guides.github.com/introduction/flow/
    - https://gist.github.com/blackfalcon/8428401

- The QA Tool is a custom userscript and uses Tampermonkey as a primary userscript manager so I hope you are familiar with it.  And when I say familiar, all I mean is just know how to:
    1. add a usersctipt
    2. modify a userscript
    3. how to force an update request.  <-- I will provide instructions on this step

<br>
<br>

---

<br>
<br>

## and we are off!   :rocket:
In order to modify this tool just follow these simple steps:
1. [Create your custom branch](#Create-your-custom-branch)
2. [Update your branch with your new tool or enhancement](#Update-your-branch)
3. [Test your new code, using Tampermonkey](#Test-your-code)
4. [Documentation](#Documentation)
5. [Open a pull request to get your code merged with the master and sent out to the world!](#Open-a-pull-request)

**Easy Right!?**

Allow me to explain these steps in depth to make it as easy as possible to update this tool.

<br>
<br>

---

<br>
<br>

## Create your custom branch

Create a branch from the 'master' repo on GitHub, please use a descriptive name in order to clearly identify branch purpose.

- if you are unable to do so, that means you do not have permission to modify the code.  Please contact the code owner(s) to get set up with the proper permissions.

<br>
<br>

---

<br>
<br>

### Updating your branch

**Tip:**  Add a linter addon to your preferred IDE.  Any popular IDE out there should have linter addons for your to install.  Shoot for adding a linter that use **ESLint.**
2. write your code and update your branch with w/e enhancement or new tool that your heart desires.
3. if using Tampermonkey, you can write your code and test it very easily.  I will explain this in this next.

**Additional Tips:**
- This project uses strict ESLint rules, that are in place to help others read your code, but it often times helps YOU read your own code.  Have you ever had one of those days where you pump out a bazilion lines of code then revisit it a day later then not no what you are looking at?  Well this should help this not happen!

With Tampermonkey, you are able to laod your local js file and run it on the webpage!  Greeaaatttt right?!  Here's how!

**Discalimer: these steps have only been tested with Chrome, so yeah...**

If you don't already have Tampermonkey installed on your Chrome browser, please do so now.

2. Navigate to the **Extensions** menu.

    - Click the [three dot] menu button near the top right of the browser.
    - Mouse over "More Tools"
    - Click on "Extensions"

3. Find the "Tampermonkey" extension.  *if you have a ton of extensions, the list may be long.  Keep scrolling and you should find it eventually*

4. There will be TWO (2) CHECKBOXES:
    - "Allow in incognito"
    - "Allow access to file URLs"    <-- **CHECK THIS OPTION**

5. You are done with this tab, close it out.
6. Click on the Tampermonkey icon in your "extension logo soup" area.
7. Navigate to "Dashboard", the dashboard will show you all the userscripts installed in Tampermonkey.
8. Create a duplicate copy of the QA Tool userscript. We are going to modify the code.
9. Replace the @require line of code to the main JS file, which should look like this.

> // @require https://cdn.rawgit.com/cirept/QA_Toolbox/3.3.1.4-prerelease/assets/js/toolBox.js

Replace it with

> // @require file://FULL_FILE_PATH_TO_YOUR_CUSTOM_JS_FILE

You're done!  Navigate to a CDK page and reload the page, you should see YOUR version of the QA Tool.

[for more information on getting Tampermonkey to read your local js file](https://forum.tampermonkey.net/viewtopic.php?t=316)

Build away!

<br>
<br>

---

<br>
<br>

## Test your code
In this step we will create a pre-release version of the QA Tool.  This step will help weed out any issues that you may encounter when publishing your release to the world.  But before we create a pre-release there is a file that needs updating.

- QA_Toolbox/assets/js/meta.js

Please update these lines in the meta.js file

**@version X.X.X.X**
- update the version number to what will be the latest version when your changes gets published.  For example, if the current version is 3.3.1 that would mean when your changes are published the version you will be using could be 3.4 or 3.3.2, depending on the modifications you are making (more on Semantic Versioning later).  So you would put either of those two version numbers here.

**@require https://cdn.rawgit.com/cirept/QA_Toolbox/XXXXXXXXXX/assets/js/toolBox.js**
- update the file path to link to the PRE-RELEASE version you will create.


**Now we are ready to create a pre-release version of the QA Tool with YOUR code.**

- [Click here to learn how to create a Release](https://help.github.com/articles/creating-releases/).

**Do not forget to select "This is a pre-release" to ensure that your changes are pushed out pre-maturely**
- Please follow the semantic versioning increments of the current QA Tool.
- if the current version is 3.3.1.4, YOUR version should be **3.3.1.5-beta** or **3.3.2-alpha** or **3.4-beta** depending on the type of update you are making.  For more information on Semantic Versioning, [see here](http://semver.org/).
- One more thing to note is how I included, -beta, -alpha.  This is recommended during the testing phase to reserve that version number for YOUR release, in the event that various updates are made at once.  Once you get your changes merged to the master branch, you should drop the extra fluff in the version number and it will be just the number.  **3.3.1.5** or **3.3.2** or **3.4**.

<br>
<br>

---

<br>
<br>

## Documentation

Please update the README.md file with detailed information on the tool that you created or modified.

Please update the ChangeLog.md file with a general overview of the changes you made to the tool.

<br>
<br>

---

<br>
<br>

## Open a pull request

[How to do a pull request](https://help.github.com/articles/creating-a-pull-request/)

Additional resources:
[about pull requests](https://help.github.com/articles/about-pull-requests/)
[commenting on a pull request](https://help.github.com/articles/commenting-on-a-pull-request/)


Code Quality is not part of the 'human review' portion of a pull request but it is a requirement via a passing grade by **Codacy**.  If you aren't familiar with Codacy, please check out their [site](https://www.codacy.com/product).  For this project we are using ESLint rules and rules have already been set up that will allow Codacy to provide feedback on your code.  The rules are strict if you are not used to writing code with rules.  Most of the rules that is to provide HUMAN readability and general 'best practices.'

**When you create a pull request, please perform these steps:**
1. Please include a **summary** of what changes that you made in the comments of the pull request.

2. Add a **link to the pre-release version** in the comments so the reviewers can easily find the version you want to merge
    - this pre-release should be the same pre-release you tested in the previous phase.

**Reviewers will be testing for:**
1. funtionality of the tool.
    - is it easy to use?
    - are there enhancements that can be added?
2. A great description of the update in the README.md file
    - There are a lot of people that currently use the tool and not all of them will understand how to use certain tools or why they should use it.
    - It helps with maintenance, in the event that business rules change a user can point it out and have it addressed.
