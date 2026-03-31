import { createMockHooks, type HookMocks } from "./hooks";
import { createMockNavigation, type NavigationMocks } from "./next/navigation";
import { createMockServices, type ServiceMocks } from "./services";

let mocksInstance: SearchMocks | null = null;

export function createSearcMocks(): SearchMocks {
  const hooks = createMockHooks();
  const services = createMockServices();
  const navigation = createMockNavigation();

  return {
    hooks,
    services,
    navigation,
  };
}

export function getSearchMocks(): SearchMocks {
  if (!mocksInstance) {
    mocksInstance = createSearcMocks();
  }
  return mocksInstance;
}

interface SearchMocks {
  hooks: HookMocks;
  services: ServiceMocks;
  navigation: NavigationMocks;
}
