(function (d) {
  const version = GM_info.script.version;
  const loadDependencies = d.createElement('script');
  loadDependencies.type = 'text/javascript';
  loadDependencies.async = true;
  loadDependencies.onload = function () {
    loadFiles();
  };
  loadDependencies.src = `https://rawgit.com/cirept/QA_Toolbox/${version}/assets/js/dependencies/init.js`;
  loadDependencies.id = 'addParentIdToElements';
  d.getElementsByTagName('head')[0].appendChild(loadDependencies);

  /**
   * dynamically load all dependency files to the head
   */
  function loadFiles() {
    // all the dependency files
    const filesToLoad = [
      'shared',
      'qaToolbox',
      'pageInformation',
      'dealerName',
      'webId',
      'pageName',
      'hTags',
      'qaTools',
      'imageChecker',
      'linkChecker',
      'spellCheck',
      'speedTestPage',
      'checkLinks',
      'otherTools',
      'showNavigation',
      'seoSimplify',
      'toggles',
      'refreshPage',
      'previewBarToggle',
      'urlModifiers',
      'nextGenToggle',
      'm4Check',
      'dynamicDisplay',
    ];
    const version = GM_info.script.version;
    const baseURL =
      `https://cdn.rawgit.com/cirept/QA_Toolbox/${version}/assets/js/dependencies/`;
    const fileEx = '.js';

    // attach each file to the document
    const doWork = filesToLoad.map((value) => {
      let myScript = d.createElement('script');
      myScript.type = 'text/javascript';
      myScript.async = true;
      myScript.src = `${baseURL}${value}${fileEx}`;
      d.getElementsByTagName('head')[0].appendChild(myScript);
    });
  }
})(document);
