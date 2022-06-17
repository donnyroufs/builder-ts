import * as crypto from "crypto"

import { UserBuilder } from "./UserBuilder"
import { FirstName } from "./FirstName"

function main() {
  const builder = new UserBuilder()

  const user = builder
    .setId(crypto.randomUUID())
    .setAge(25)
    .setFirstName(FirstName.make("John"))
    .build()

  console.log({ user })
}

main()
