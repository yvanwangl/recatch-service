import * as _ from 'lodash';
import {default as defaultConfig} from './config.default';

const env = process.env.NODE_ENV !== 'production' ? 'dev' : 'prod';

const overrideConfig = require(`./config.${env}`).default;

const config = _.merge(defaultConfig, overrideConfig);

export default config;