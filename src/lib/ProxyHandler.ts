import { cast } from "./Cast"
import { StringParser } from "./StringParser"

type EntityProps = Record<string, unknown>
type Instance = any

export class ProxyHandler<TEntity> {
  private _obj: EntityProps = {}
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
    const props = { ...this._obj }
    this._obj = {}

    // We can overwrite the prototype here to make sure the constructor does not do a thing
    // this will however take out default behaviour. So for now, I will assume that the constructor
    // either has a list of primitives, or an object of all the properties.
    return () => {
      // @ts-expect-error we assume its newable for now
      return Object.assign(new this._entity({} as any), {
        ...props,
      })
    }
  }

  private onSet(prop: string, value: unknown) {
    const propName = StringParser.toCamelCase(prop.slice(3))

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
