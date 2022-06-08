/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AbstractBuilder } from "./AbstractBuilder"
import { TitleCaseParser } from "./TitleCaseParser"
import { Builder, Constructable } from "./types"

export function BuilderMixin<TEntity extends Constructable>(entity: TEntity) {
  const constr = class extends AbstractBuilder<TEntity> {
    public constructor() {
      super(entity)
    }
  }
  const properties = Object.getOwnPropertyNames(new entity())

  properties.forEach((prop) => {
    // @ts-ignore
    constr.prototype[`set${TitleCaseParser.parse(prop)}`] = function (
      newValue: unknown
    ) {
      // @ts-ignore
      this.values[prop] = newValue
      return this
    }
  })

  return constr as unknown as Constructable<Builder<InstanceType<TEntity>>>
}
