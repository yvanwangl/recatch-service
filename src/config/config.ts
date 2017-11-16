import * as _ from 'lodash';
import {default as defaultConfig} from './config.default';

const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';

const overrideConfig = require(`./config.${env}.ts`).default;

const config = _.merge(defaultConfig, overrideConfig);

export default config;