import { snakeCase } from 'lodash';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const uiExports = {};
const types = [
  'apps',
  'visTypes',
  'fieldFormatters',
  'sledgehammers'
];

for (const type of types) {
  const exports = uiExports[type] = [];
  const typeDir = resolve(__dirname, 'public', snakeCase(type));
  for (const dirname of readdirSync(typeDir)) {
    if (dirname.startsWith('.') || dirname.startsWith('_')) continue;

    if (type === 'apps') {
      const app = require(resolve(typeDir, dirname, 'app.js'));
      if (!app.id) app.id = dirname;
      exports.push(app);
    } else {
      exports.push(`plugins/<%= pluginId %>/${dirname}`);
    }
  }
}


export default function (kibana) {
  return new kibana.Plugin({

    id: '<%= pluginId %>',
    require: ['kibana', 'elasticsearch'],
    uiExports: uiExports,

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      const serverDir = resolve(__dirname, 'server');
      for (const dirname of readdirSync(serverDir)) {
        if (dirname.startsWith('.') || dirname.startsWith('_')) continue;
        const extension = require(resolve(serverDir, dirname));
        if (typeof extension === 'function') {
          extension(server, options);
        }
      }
    }

  });
};
