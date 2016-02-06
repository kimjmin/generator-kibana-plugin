import _ from 'lodash';

import FieldFormatProvider from 'ui/index_patterns/_field_format/FieldFormat';

import editor from '<%= format_id %>_editor.html';
import editorController from '<%= format_id %>_editor_controller.html';

export default function UrlFormatProvider(Private) {
  const FieldFormat = Private(FieldFormatProvider);

  return class <%= formatClassName %>Format extends FieldFormat {
    static id = '<%= formatId %>';
    static title = '<%= formatTitle %>';
    static fieldType = ['<%- formatFieldTypes.join(`', '`) %>'];

    static editor = {
      template: editor,
      controller: editorController,
      controllerAs: '<%= formatId %>',
    };

    static paramDefaults = {
      replacements: [],
    };

    _convert(value) {
      return this.param('replacements').reduce((output, [replace, with]) => {
        return output.replace(new RegExp(replace, 'g'), with);
      }, value);
    }
  }

  return Url;
};
