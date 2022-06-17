# Read Me

Small package that I use to create fixtures for my tests. Only works with classes for now.

Things I want to add whenever I am in the mood:

- [x] Add support to add methods to the Builder
  - [ ] Improve builder type so that custom methods do not get lost, more info below
- [ ] Build from Types/Interfaces
- [ ] Exclude methods that have been invoked already with a Strict Builder (e.g. after setTitle, setTitle is not available anymore)

```ts
import { ClassBuilderMixin } from "builder-ts"

export class Post {
  public readonly id: string
  public readonly name: string
  public readonly createdAt: Date

  // Also works with protected constructors
  public constructor(id: string, name: string, createdAt: Date) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
  }

  public upvote() {}
}

class PostBuilder extends ClassBuilderMixin(Post) {
  public withTodaysDate() {
    this.setCreatedAt(Date.Today)
  }
}

const post = new PostBuilder()
  .withTodaysDate()
  .setId("id")
  .setName("myName")
  .build() // { id: "id", name: "myName", createdAt: Date, upvote: Function }
```

## Rules

- Properties should follow camelCase convention
- Custom builder methods have to be used before the auto generated "set" methods (because of types)
