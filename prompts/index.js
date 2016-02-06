export default function () {
  const done = this.async();
  const vars = this.vars = {};
  const pathFilters = this.pathFilters = [];

  const prompts = Rx.Observable.create(obs => {
    obs.onNext({
      type: 'input',
      name: 'name',
      message: 'Your Plugin Name',
      default: this.appname
    });

    obs.onNext({
      type: 'list',
      name: 'generateNewExport',
      message: 'Would you like to generate one of these things?',
      choices: [
        { name: 'None', value: false },
        { name: 'Application', value: 'app' },
        { name: 'Custom Vis Type', value: 'visType' },
        { name: 'Field Formatter', value: 'fieldFormatter' },
        { name: 'Spy Panel Section', value: 'spyMode' },
        { name: 'Chrome Nav Control', value: 'chromeNavControl' },
        { name: 'Navbar Extension', value: 'navbarExtension' },
        { name: 'Settings Section', value: 'settingsSection' },
        { name: 'Doc Viewer Mode', value: 'docView' },
        { name: 'Sledgehammer', value: 'sledgehammer' },
      ]
    });

    onEachAnswer.subscribe(answer => {
      if (answer.name !== 'generateNewExport') {

      }
    });

    obs.onCompleted();
  });

  this
    .prompt(prompts)
    .process.subscribe(
      answer => onEachAnswer.push(answer),
      error => onError.push(error),
      answers => {
        var name = answers.name;
        vars.pluginTitle = _.startCase(name);
        vars.pluginId = _.camelCase(name);
        vars.plugin_id = _.snakeCase(name);
        pathFilters.push(pathFilter('plugin_id', vars.plugin_id));
        self.exportTypes = answers.exportTypes;
        done();
      }
    );
}
