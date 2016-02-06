import moment from 'moment';
import chrome from 'ui/chrome';
import uiModules from 'ui/modules';
import uiRoutes from 'ui/routes';

import 'ui/autoload/styles';
import './<%= app_id %>.less';
import './<%= app_id %>_controller.js';

chrome
  .setNavBackground('#222222')
  .setTabs([]);
