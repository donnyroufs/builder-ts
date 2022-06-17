import { ClassBuilderMixin } from "./Builder"

describe("builder", () => {
  test("builds an entity", () => {
    class Post {
      public readonly title!: string
      public readonly comments: any[] = []
    }

    class PostBuilder extends ClassBuilderMixin(Post) {}

    const b = new PostBuilder()

    const p = b.setComments([1]).setTitle("my title").build()

    expect(p.title).toBe("my title")
    expect(p.comments).toEqual([1])
  })

  test("invokes custom methods on builder and mutates data", () => {
    class Post {
      public readonly title!: string
      public readonly comments: any[] = []
    }

    class PostBuilder extends ClassBuilderMixin(Post) {
      public withComments() {
        this.setComments([1, 2, 3])
        return this
      }
    }

    const b = new PostBuilder()

    const p = b.withComments().build()

    expect(p.comments).toEqual([1, 2, 3])
  })

  test("built type is of correct instance", () => {
    class Post {
      public readonly title!: string
    }

    class PostBuilder extends ClassBuilderMixin(Post) {}

    const b = new PostBuilder()

    const p = b.setTitle("my-title").build()

    expect(p).toBeInstanceOf(Post)
  })

  test('does not lose "this" context', () => {
    class Post {
      public title!: string

      public doStuffWithThis() {
        this.title = "custom"
      }
    }

    class PostBuilder extends ClassBuilderMixin(Post) {}

    const b = new PostBuilder()

    const p = b.setTitle("").build()
    p.doStuffWithThis()

    expect(p.title).toBe("custom")
  })

  test("builds even when the constructor is protected", () => {
    class Post {
      public title!: string

      protected constructor() {}
    }

    class PostBuilder extends ClassBuilderMixin(Post) {}

    const b = new PostBuilder()

    const p = b.setTitle("title").build()

    expect(p.title).toBe("title")
  })

  test("can use the builder multiple times", () => {
    class Post {
      public title!: string
      public createdAt!: Date
    }

    class PostBuilder extends ClassBuilderMixin(Post) {}

    const b = new PostBuilder()

    b.setTitle("title").build()
    const date = new Date()
    const p2 = b.setCreatedAt(date).build()

    expect(p2.title).toBeUndefined()
    expect(p2.createdAt).toBe(date)
  })

  test.todo("can inject dependencies into entity constructor")
})
