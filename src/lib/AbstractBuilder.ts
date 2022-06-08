/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Constructable } from "./types"

export abstract class AbstractBuilder<TEntity> {
  protected values: Record<string, any> = {}

  protected constructor(protected readonly entity: Constructable<TEntity>) {}

  public build(): TEntity {
    const instance = new this.entity()
    // @ts-ignore
    Object.entries(this.values).forEach(([k, v]) => (instance[k] = v))
    this.values = {}
    return instance as TEntity
  }
}
