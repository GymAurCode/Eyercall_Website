import '../runtime';
import {installBridge} from '../stock-flow-adapter';
import fixtures from './fixtures.json';
import {PERMISSION_MODULES,PERMISSION_ACTIONS} from './src/shared/permissions';
installBridge(fixtures,PERMISSION_MODULES,PERMISSION_ACTIONS);
import('./src/renderer/main');
