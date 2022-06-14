import { ProxyHandler } from "./ProxyHandler"
import { ClassDefinitionFor, Newable, Builder } from "./types"

export function ClassBuilderMixin<TEntity extends ClassDefinitionFor<unknown>>(
  entity: TEntity
) {
  const AbstractBuilder = class {
    public constructor() {
      return this.makeProxy() as any
    }

    private makeProxy() {
      return new Proxy({}, new ProxyHandler<TEntity>(this, entity))
    }
  }

  return AbstractBuilder as unknown as Newable<Builder<TEntity["prototype"]>>
}
