import { camelCase, capitalize, contains, kebabCase, snakeCase } from 'lodash';
import { join, relative } from 'path';
import glob from 'glob';
import generator from 'yeoman-generator';

function required(input) {
  return !!input;
}

function pathFilter(find, replace) {
  const match = new RegExp(find, 'g');
  return function (path) {
    return path.replace(match, replace);
  };
}

export default generator.Base.extend({

  constructor() {
    generator.Base.apply(this, arguments);
    this.appname = kebabCase(this.appname);
  },

  prompt() {

  },

  promptingForApplicationInfo() {
    if (!contains(this.exportTypes, 'app')) return;
    const done = this.async();

    this.prompt([
      {
        type: 'input',
        name: 'appTitle',
        message: 'APPLICATION: Name',
        default: vars.pluginId
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'APPLICATION: Short Description',
        default: 'An awesome Kibana application'
      },
    ], function (answers) {
      const title = answers.appTitle;
      vars.appTitle = title;
      vars.appId = camelCase(title);
      vars.app_id = snakeCase(title);
      pathFilters.push(pathFilter('app_id', vars.app_id));
      vars.appDescription = answers.appDescription;
      done();
    });
  },

  promptingForVisTypeInfo: function () {
    if (!contains(this.exportTypes, 'vis_type')) return;
    const done = this.async();

    this.prompt([
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
      const title = answers.visTypeTitle;
      vars.visTypeTitle = title;
      vars.visTypeId = camelCase(title);
      vars.vis_type_id = snakeCase(title);
      pathFilters.push(pathFilter('vis_type_id', vars.vis_type_id));
      vars.visTypeDescription = answers.visTypeDescription;
      done();
    });
  },

  promptingForFieldFormatInfo: function () {
    if (!contains(this.exportTypes, 'field_formatter')) return;
    const done = this.async();

    this.prompt([
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
      const title = answers.formatTitle;
      vars.formatTitle = title;
      vars.formatId = camelCase(title);
      vars.formatClassName = capitalize(camelCase(title));
      vars.format_id = snakeCase(title);
      pathFilters.push(pathFilter('format_id', vars.format_id));
      vars.formatDescription = answers.formatDescription;
      vars.formatFieldTypes = answers.formatFieldTypes;
      done();
    });
  },
  //
  // installingDevDeps: function () {
  //   const deps = [
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
    const sourceBase = join(__dirname, 'templates', type);
    const globOpts = {
      dot: true,
      nodir: true
    };
    glob.sync(join(sourceBase, '**', '*'), globOpts).forEach(function (file) {
      try {
        const dest = pathFilters.reduce(function (path, filter) {
          return filter(path);
        }, this.destinationPath(relative(sourceBase, file)));
        this.fs.copyTpl(file, dest, vars);
      } catch (err) {
        console.error(err.stack);
      }
    });
  }
});
