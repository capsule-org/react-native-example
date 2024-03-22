import {CapsuleMobile, Environment} from '@usecapsule/react-native-wallet';
import { setEnv } from '@usecapsule/react-native-wallet';

setEnv(Environment.SANDBOX);
export const capsule = new CapsuleMobile(Environment.SANDBOX, '8ee2d015fbc6062a6e30bdc472f2946c');
