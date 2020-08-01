import faker from "faker";

import { sharedConfig } from "../shared/shared-config";

export const config = {
  ...sharedConfig,
  serverId: faker.random.uuid(),
};
