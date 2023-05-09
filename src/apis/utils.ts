import FalconPublicApis from './public-api';

export function assertConnection(falcon: FalconPublicApis) {
  if (!falcon.isConnected) {
    throw new Error(
      'You cannot call this API before having established a connection to the host!'
    );
  }
}
