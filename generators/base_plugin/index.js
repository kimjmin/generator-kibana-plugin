var _ = require('lodash');
var glob = require('glob');
var generator = require('yeoman-generator');
var join = require('path').join;
var relative = require('path').relative;

function required(input) {
  return !!input;
}

function pathFilter(find, replace) {
  var match = new RegExp(find, 'g');
  return function (path) {
    return path.replace(match, replace);
  };
}

module.exports = generator.Base.extend({

  constructor: function () {
    generator.Base.apply(this, arguments);
    this.vars = {};
    this.pathFilters = [];
    this.appname = _.kebabCase(this.appname);
  },

  promptingPluginInfo: function () {
    var self = this;
    var done = this.async();

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your Plugin Name',
        default: this.appname
      },
      {
        type: 'list',
        name: 'exportTypes',
        message: 'Would you like to generate something one of these?',
        choices: [
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
      }
    ], function (answers) {
      var name = answers.name;
      self.vars.pluginTitle = _.startCase(name);
      self.vars.pluginId = _.camelCase(name);
      self.vars.plugin_id = _.snakeCase(name);
      self.pathFilters.push(pathFilter('plugin_id', self.vars.plugin_id));
      self.exportTypes = answers.exportTypes;
      done();
    });
  },

  promptingForApplicationInfo: function () {
    var self = this;
    if (!_.contains(self.exportTypes, 'app')) return;
    var done = self.async();

    self.prompt([
      {
        type: 'input',
        name: 'appTitle',
        message: 'APPLICATION: Name',
        default: self.vars.pluginId
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'APPLICATION: Short Description',
        default: 'An awesome Kibana application'
      },
    ], function (answers) {
      var title = answers.appTitle;
      self.vars.appTitle = title;
      self.vars.appId = _.camelCase(title);
      self.vars.app_id = _.snakeCase(title);
      self.pathFilters.push(pathFilter('app_id', self.vars.app_id));
      self.vars.appDescription = answers.appDescription;
      done();
    });
  },

  promptingForVisTypeInfo: function () {
    var self = this;
    if (!_.contains(self.exportTypes, 'vis_type')) return;
    var done = self.async();

    self.prompt([
      {
        type: 'input',
        name: 'visTypeTitle',
        message: 'VIS TYPE: Name'
      },
      {
        type: 'input',
        name: 'visTypeDescription',
        message: 'VIS TYPE: Description'
      },
    ], function (answers) {
      var title = answers.visTypeTitle;
      self.vars.visTypeTitle = title;
      self.vars.visTypeId = _.camelCase(title);
      self.vars.vis_type_id = _.snakeCase(title);
      self.pathFilters.push(pathFilter('vis_type_id', self.vars.vis_type_id));
      self.vars.visTypeDescription = answers.visTypeDescription;
      done();
    });
  },

  promptingForFieldFormatInfo: function () {
    var self = this;
    if (!_.contains(self.exportTypes, 'field_formatter')) return;
    var done = self.async();

    self.prompt([
      {
        type: 'input',
        name: 'formatTitle',
        message: 'FIELD FORMAT: Name',
        validate: required
      },
      {
        type: 'input',
        name: 'formatDescription',
        message: 'FIELD FORMAT: Description',
        required: true
      },
      {
        type: 'checkbox',
        name: 'formatFieldTypes',
        message: 'FIELD FORMAT: Applicable field types',
        choices: [
          { name: 'number', value: 'number', checked: true },
          { name: 'boolean', value: 'boolean', checked: true },
          { name: 'date', value: 'date', checked: true },
          { name: 'ip', value: 'ip', checked: true },
          { name: 'attachment', value: 'attachment', checked: true },
          { name: 'geo_point', value: 'geo_point', checked: true },
          { name: 'geo_shape', value: 'geo_shape', checked: true },
          { name: 'string', value: 'string', checked: true },
          { name: 'murmur3', value: 'murmur3', checked: true },
          { name: 'unknown', value: 'unknown', checked: true },
          { name: 'conflict', value: 'conflict', checked: true }
        ]
      },
    ], function (answers) {
      var title = answers.formatTitle;
      self.vars.formatTitle = title;
      self.vars.formatId = _.camelCase(title);
      self.vars.formatClassName = _.capitalize(_.camelCase(title));
      self.vars.format_id = _.snakeCase(title);
      self.pathFilters.push(pathFilter('format_id', self.vars.format_id));
      self.vars.formatDescription = answers.formatDescription;
      self.vars.formatFieldTypes = answers.formatFieldTypes;
      done();
    });
  },
  //
  // installingDevDeps: function () {
  //   var deps = [
  //     'gulp',
  //     'bluebird',
  //     'babel-eslint',
  //     'eslint-plugin-mocha',
  //     'gulp-eslint',
  //     'gulp-gzip',
  //     'gulp-tar',
  //     'gulp-util',
  //     'lodash',
  //     'mkdirp',
  //     'del',
  //     'rsync'
  //   ];
  //   this.npmInstall(deps, { saveDev: true });
  // },


  writing: function () {
    this._templateGlob('base');
    this.exportTypes.forEach(this._templateGlob, this);
  },

  _templateGlob: function (type, id) {
    var self = this;
    var sourceBase = join(__dirname, 'templates', type);
    var globOpts = {
      dot: true,
      nodir: true
    };
    glob.sync(join(sourceBase, '**', '*'), globOpts).forEach(function (file) {
      try {
        var dest = self.pathFilters.reduce(function (path, filter) {
          return filter(path);
        }, self.destinationPath(relative(sourceBase, file)));
        self.fs.copyTpl(file, dest, self.vars);
      } catch (err) {
        console.error(err.stack);
      }
    });
  }
});
