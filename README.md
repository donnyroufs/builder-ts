```ts
import { BuilderMixin } from "builder-ts"

export class Post {
  public readonly id: string
  public readonly name: string
  public readonly createdAt: Date

  public constructor(id: string, name: string, createdAt: Date) {
    this.id = id
    this.name = name
    this.createdAt = createdAt
  }

  public upvote() {}
}

class PostBuilder extends BuilderMixin(Post) {}

const post = new PostBuilder()
  .setId("id")
  .setName("myName")
  .setCreatedAt(new Date())
  .build() // { id: "id", name: "myName", createdAt: Date }
```
