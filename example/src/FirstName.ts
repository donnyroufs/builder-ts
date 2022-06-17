import { ValueObject } from "./ValueObject"

export class FirstName extends ValueObject {
  public readonly value: string

  protected constructor(value: string) {
    super()

    this.value = value
  }

  public static make(value: string) {
    return new FirstName(value)
  }
}
