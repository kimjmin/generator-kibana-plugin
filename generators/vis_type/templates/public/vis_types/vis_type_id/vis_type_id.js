// the visTypesRegistry informs kibana about this vis type
import visTypesRegistry from 'ui/registry/vis_types';

// load provider to access Kibana services
import TemplateVisTypeProvider from 'ui/template_vis_type/TemplateVisType';
import SchemasProvider from 'ui/Vis/Schemas';

// load the vis type's styles, templates, and angular components
import template from './<%= vis_type_id %>.html';
import editor from './<%= vis_type_id %>_editor.html';
import './<%= vis_type_id %>.less';
import './<%= vis_type_id %>_controller';

// the function passed to register is injected with angular DI, use Private
// to load Kibana providers
visTypesRegistry.register(function HistogramVisType(Private) {
  var TemplateVisType = Private(TemplateVisTypeProvider);
  var Schemas = Private(SchemasProvider);

  // return the visType object, which kibana will use to
  // display and configure new Vis object of this type.
  return new TemplateVisType({
    name: '<%= visTypeId %>',
    title: '<%= visTypeTitle %>',
    description: '<%= visTypeDescription %>',
    icon: 'fa-tachometer',
    template,
    params: {
      defaults: {
        fontSize: 60
      },
      editor: editor
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        min: 1,
        defaults: [
          { type: 'count', schema: 'metric' }
        ]
      }
    ])
  });
});
