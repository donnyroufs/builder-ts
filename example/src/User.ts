import { FirstName } from "./FirstName"

type CreateUserArgs = {
  id: string
  firstName: FirstName
  age: number
}

export class User {
  public readonly id: string
  public readonly firstName: FirstName
  public readonly age: number

  protected constructor(props: CreateUserArgs) {
    this.id = props.id
    this.firstName = props.firstName
    this.age = props.age
  }

  public static make(props: CreateUserArgs): User {
    if (props.firstName.value.length <= 2) {
      throw new Error("User must have a name longer than 2 characters.")
    }

    return new User(props)
  }
}
