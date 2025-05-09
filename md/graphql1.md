# GraphQL Backend Introduction

**Dành cho frontend developers nhiều kinh nghiệm với React + TypeScript, nhưng mới tiếp cận backend và GraphQL**

## 1. RESTful API – Nền tảng phổ biến trong phát triển web

Trong phát triển web hiện đại, REST (Representational State Transfer) là kiến trúc API phổ biến và quen thuộc nhất. REST đề cao tính **stateless**, hoạt động dựa trên mô hình **URI-based resource**, sử dụng các HTTP method tiêu chuẩn như:

* `GET`, `POST`, `PUT`, `PATCH`, `DELETE` — tương ứng với các thao tác CRUD cơ bản.

REST được hình thành vào khoảng năm 2000, trong giai đoạn chuyển giao từ Web 1.0 (tĩnh) sang Web 2.0 (động). Mục tiêu lúc bấy giờ là **chuẩn hóa mô hình API**, thay thế các giải pháp phức tạp như SOAP hoặc XML-RPC.

Hiện nay, một số khái niệm như “Web 3.0” đang được sử dụng trong lĩnh vực blockchain, crypto... tuy nhiên cần lưu ý rằng các thư viện web3 thường chỉ “mượn tên” để theo trend, chứ không phản ánh đúng bản chất tiến hóa công nghệ của Web 3.0 thực sự (semantic web).

### Ví dụ REST API với Node.js (Express + TypeScript)

```ts
app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }});
  res.json(user);
});
```

### Khó khăn thường gặp khi mở rộng REST API:

* **Filtering nâng cao**: REST yêu cầu thiết kế thủ công query string, đôi khi khó maintain nếu phức tạp (nhiều trường, nested).
* **Join dữ liệu**: REST không có native support cho relational query. Nếu muốn `include` các liên kết như `User` → `Post`, cần dùng ORM hỗ trợ eager loading, hoặc viết nhiều API riêng lẻ rồi combine ở phía frontend.
* **Typing cho frontend**: Khó tự động hóa typing nếu không có thêm bước generate OpenAPI/Swagger → TypeScript.

## 2. GraphQL – Cấu trúc linh hoạt và mạnh mẽ hơn cho truy vấn dữ liệu

GraphQL (Graph Query Language) được Facebook phát triển từ năm 2012, và open-source năm 2015. Mục tiêu của GraphQL là giải quyết các điểm yếu của REST: over-fetching, under-fetching và tính linh hoạt cho nhiều loại client (web, mobile...).

### Tại sao gọi là “Graph”?

Tên gọi xuất phát từ:

* **Mô hình dữ liệu trong social network (Facebook)**: được biểu diễn như một đồ thị (graph).
* **Tính chất schema**:

  * Mỗi “type” như `User`, `Post` là một **node**.
  * Các quan hệ giữa chúng (`User` có nhiều `Post`) là **edge**.

Tuy nhiên, cần phân biệt rõ: GraphQL chỉ **dựa trên mô hình đồ thị logic**, không phải là một **graph database** như Neo4j.

### Lợi ích so với REST:

* **Over-fetching**: REST có thể trả về nhiều trường không cần thiết → GraphQL chỉ trả về đúng field được yêu cầu.
* **Under-fetching**: REST thường cần gọi nhiều API để ráp đủ dữ liệu → GraphQL có thể lấy tất cả trong một query duy nhất.
* **Phiên bản hóa**: REST cần quản lý `/v1`, `/v2`, còn GraphQL không cần version API, chỉ cần mở rộng schema.
* **Join dữ liệu**: Truy vấn dễ dàng nested object theo định nghĩa schema.

### Nhưng thực tế thì sao?

* Dù GraphQL cho phép chỉ định field, nhiều frontend dev (hoặc tool như Apollo, Relay) lại auto-gen query lấy toàn bộ field → **over-fetching vẫn xảy ra**, chỉ khác về hình thức.
* Do đó, **typing và resolver ở backend mới là điểm tạo ra giá trị thật sự** — không phải ở chỗ "query nhìn gọn hơn".

### Ví dụ về schema & resolver

#### Định nghĩa type theo kiểu cũ (GraphQL Object Type)

```ts
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    title: {
      type: GraphQLString,
    },
    author: {
      type: UserType,
      resolve: (parent) => getUserById(parent.authorId),
    }
  }
});
```

#### Kiểu hiện đại (code-first + TypeScript)

```ts
@ObjectType()
class User {
  @Field() id: number;
  @Field() username: string;
}
```

#### Resolver — nơi xử lý logic từng field

```ts
@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: MyContext) {
    return ctx.db.user.findMany();
  }
}
```

Resolver có thể được tối ưu:

* **Batching** để tránh N+1 query.
* **Authorization** per field (tùy role, quyền truy cập field).
* **Caching**, context-based access...

### Tự động generate typing cho frontend

* Sử dụng GraphQL Code Generator để tự động tạo TypeScript types từ schema.
* Đảm bảo **end-to-end type safety** cho cả FE và BE.

### Các vấn đề cần chú ý với GraphQL

| Vấn đề                       | Mô tả                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| Không giới hạn depth         | Có thể bị DDoS bằng truy vấn sâu                           |
| Không có persisted query     | Khó cache tại backend                                      |
| Dev lấy thừa field           | Over-fetching vẫn còn                                      |
| N+1 query                    | Resolver không được tối ưu sẽ gây chậm                     |
| Không tận dụng cache browser | Vì không có HTTP GET thuần                                 |
| Auth phức tạp                | Đặc biệt với field lồng nhiều tầng và phân quyền linh động |

## 3. Tự động hóa CRUD GraphQL với Sequelize (Node.js)

* Dựa trên ý tưởng của Hasura, nhóm đã viết một bộ code nội bộ với Node.js (Sequelize + GraphQL) cho phép:

  * Tạo CRUD GraphQL schema từ model.
  * Hỗ trợ filter, sort, pagination đầy đủ.
* Các thư viện khác cũng có cách tiếp cận tương tự:

  * **Node.js**: PostGraphile
  * **PHP**: Laravel Lighthouse
  * **Go**: Gqlgen
  * **Rust**: Seaography
  * **Native DB**: Dgraph

## 4. Phiên bản Rust – tối ưu hiệu năng

* Đội ngũ đã port phần lớn code từ Node.js sang Rust để:

  * Tối ưu hiệu suất xử lý truy vấn GraphQL.
  * Giảm latency, tận dụng multi-thread runtime.
* Sử dụng `async-graphql`, `sqlx`, `axum`, `anyhow`…
* Một số đoạn code Rust mẫu và benchmark sẽ được trình bày trực tiếp khi demo.

## 5. Kết luận

Việc chuyển hướng một số frontend developer sang backend là một bước đi chiến lược quan trọng. Họ không chỉ nắm UI/UX mà còn hiểu rõ **dữ liệu FE cần**, từ đó thiết kế BE API dễ dùng, dễ maintain, tối ưu trải nghiệm dev.

Hành trình bắt đầu từ việc nắm vững framework Node.js nội bộ hiện tại, sau đó tiến tới triển khai song song hoặc thay thế bằng Rust – nơi mang lại hiệu suất cao hơn, đặc biệt với các hệ thống lớn và yêu cầu độ trễ thấp.

**Phương pháp tiếp cận thực tế** là chìa khóa: có thể khởi đầu bằng việc sử dụng Node.js để generate code Rust, giữ sự quen thuộc nhưng đồng thời từng bước nâng cấp hệ thống.
