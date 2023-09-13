/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/

import { Memoize } from 'typescript-memoize';

import { ActorsApiBridge } from './actors';
import { AlertsApiBridge } from './alerts';
import { DetectsApiBridge } from './detects';
import { DevicesApiBridge } from './devices';
import { FwmgrApiBridge } from './fwmgr';
import { IncidentsApiBridge } from './incidents';
import { MitreApiBridge } from './mitre';
import { PluginsApiBridge } from './plugins';
import { RemoteResponseApiBridge } from './remote-response';
import { UserManagementApiBridge } from './user-management';
import { WorkflowsApiBridge } from './workflows';
import { CustomobjectsApiBridge } from './customobjects';
import { FaasGatewayApiBridge } from './faas-gateway';
import { LoggingapiApiBridge } from './loggingapi';

import { assertConnection } from '../utils';
import type { Bridge } from '../bridge';

export default abstract class FalconPublicApis {
  isConnected = false;
  abstract bridge: Bridge<any>;

  @Memoize()
  get actors(): ActorsApiBridge {
    assertConnection(this);

    return new ActorsApiBridge(this.bridge);
  }

  @Memoize()
  get alerts(): AlertsApiBridge {
    assertConnection(this);

    return new AlertsApiBridge(this.bridge);
  }

  @Memoize()
  get detects(): DetectsApiBridge {
    assertConnection(this);

    return new DetectsApiBridge(this.bridge);
  }

  @Memoize()
  get devices(): DevicesApiBridge {
    assertConnection(this);

    return new DevicesApiBridge(this.bridge);
  }

  @Memoize()
  get fwmgr(): FwmgrApiBridge {
    assertConnection(this);

    return new FwmgrApiBridge(this.bridge);
  }

  @Memoize()
  get incidents(): IncidentsApiBridge {
    assertConnection(this);

    return new IncidentsApiBridge(this.bridge);
  }

  @Memoize()
  get mitre(): MitreApiBridge {
    assertConnection(this);

    return new MitreApiBridge(this.bridge);
  }

  @Memoize()
  get plugins(): PluginsApiBridge {
    assertConnection(this);

    return new PluginsApiBridge(this.bridge);
  }

  @Memoize()
  get remoteResponse(): RemoteResponseApiBridge {
    assertConnection(this);

    return new RemoteResponseApiBridge(this.bridge);
  }

  @Memoize()
  get userManagement(): UserManagementApiBridge {
    assertConnection(this);

    return new UserManagementApiBridge(this.bridge);
  }

  @Memoize()
  get workflows(): WorkflowsApiBridge {
    assertConnection(this);

    return new WorkflowsApiBridge(this.bridge);
  }

  @Memoize()
  get customobjects(): CustomobjectsApiBridge {
    assertConnection(this);

    return new CustomobjectsApiBridge(this.bridge);
  }

  @Memoize()
  get faasGateway(): FaasGatewayApiBridge {
    assertConnection(this);

    return new FaasGatewayApiBridge(this.bridge);
  }

  @Memoize()
  get loggingapi(): LoggingapiApiBridge {
    assertConnection(this);

    return new LoggingapiApiBridge(this.bridge);
  }
}
