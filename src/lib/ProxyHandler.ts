import { cast } from "./Cast"

type EntityProps = Record<string, unknown>
type Instance = any

export class ProxyHandler<TEntity> {
  private readonly _obj: EntityProps = {}
  private readonly _instance: Instance
  private readonly _entity: TEntity
  private readonly _internalProxy: object

  public constructor(instance: unknown, entity: TEntity) {
    this._instance = instance
    this._entity = entity
    this._internalProxy = new Proxy({}, this)
  }

  public get(_: unknown, prop: string) {
    const stringifiedProp = cast<string>(prop)

    if (this.isBuildProp(stringifiedProp)) {
      return this.onBuild()
    }

    return (value: unknown): unknown => {
      if (stringifiedProp.includes("set")) {
        this.onSet(stringifiedProp, value)
      }

      if (this.isSetProp(stringifiedProp)) {
        this.onCustomMethod(stringifiedProp, value)
      }

      return this._internalProxy
    }
  }

  private onBuild() {
    return () => {
      // @ts-expect-error we assume its newable for now
      return Object.assign(new this._entity(), {
        ...this._obj,
      })
    }
  }

  private onSet(prop: string, value: unknown) {
    const propName = prop.slice(3).toLowerCase()

    this._obj[propName] = value
  }

  private onCustomMethod(prop: string, value: unknown) {
    const fn = this._instance[prop]

    fn.bind(this._internalProxy)(value)
  }

  private isBuildProp(prop: string): boolean {
    return prop.includes("build")
  }

  private isSetProp(prop: string): boolean {
    return !prop.includes("set") && typeof this._instance[prop] === "function"
  }
}
