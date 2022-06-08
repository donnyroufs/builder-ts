import { BuilderMixin } from "./BuilderMixin"

class Post {
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

describe("abstract builder", () => {
  test("builds an entity", () => {
    class PostBuilder extends BuilderMixin(Post) {}
    const date = new Date()
    const post = new PostBuilder()
      .setId("id")
      .setName("name")
      .setCreatedAt(new Date())
      .build()

    const expectedPost = new Post("id", "name", date)

    expect(post).toEqual(expectedPost)
  })

  test("can create multiple entities with the same builder", () => {
    class PostBuilder extends BuilderMixin(Post) {}
    const date = new Date()
    const builder = new PostBuilder()

    const posts = [
      builder
        .setId("id")
        .setName("name")
        .setCreatedAt(date)
        .build(),
      builder
        .setId("id")
        .setName("name")
        .build(),
    ]
    const expectedPost = new Post("id", "name", date)

    expect(posts.at(0)).toEqual(expectedPost)
    expect(posts.at(1)?.createdAt).toBeUndefined()
  })
})
