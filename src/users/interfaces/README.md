# User Interfaces

Các interface này được sử dụng để định nghĩa cấu trúc dữ liệu trả về cho client, đảm bảo không bao gồm thông tin nhạy cảm như password, refresh token, OTP, v.v.

## Các Interface

### `IUser`
Interface cơ bản chứa thông tin user cần thiết:
```typescript
interface IUser {
  id: string;
  email: string;
  fullName: string;
  age: number;
  exp: number;
  level: number;
  avatarUrl: string | null;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `IUserWithTopics`
Extends `IUser` và bao gồm danh sách topics của user:
```typescript
interface IUserWithTopics extends IUser {
  topics: Topic[];
}
```

### `IUserWithPermissions`
Extends `IUser` và bao gồm danh sách topic permissions:
```typescript
interface IUserWithPermissions extends IUser {
  topicPermissions: TopicPermission[];
}
```

### `IUserFull`
Extends `IUser` và bao gồm tất cả relations (topics + topicPermissions):
```typescript
interface IUserFull extends IUser {
  topics: Topic[];
  topicPermissions: TopicPermission[];
}
```

### `IUserAuth`
Extends `IUser` và bao gồm access token + refresh token (dùng cho authentication):
```typescript
interface IUserAuth extends IUser {
  accessToken: string;
  refreshToken: string;
}
```

## Transformer Functions

Các function này được sử dụng để chuyển đổi User entity sang các interface tương ứng:

### `toUserResponse(user: User): IUser`
Chuyển đổi User entity sang IUser interface, loại bỏ các thông tin nhạy cảm.

### `toUserWithTopics(user: User): IUserWithTopics`
Chuyển đổi User entity sang IUserWithTopics interface.

### `toUserWithPermissions(user: User): IUserWithPermissions`
Chuyển đổi User entity sang IUserWithPermissions interface.

### `toUserFull(user: User): IUserFull`
Chuyển đổi User entity sang IUserFull interface.

## Cách sử dụng

### Trong Controller

```typescript
import { IUser, IUserFull } from './interfaces';
import { toUserFull, toUserResponse } from './transformers';

@Controller('users')
export class UsersController {
  @Get('me')
  async getMe(@Req() req: Request & { user: { id: string } }): Promise<IUserFull> {
    const user = await this.usersService.getMe(req.user.id);
    return toUserFull(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<IUser> {
    const user = await this.usersService.update(id, dto);
    return toUserResponse(user);
  }
}
```

## Lợi ích

1. **Type Safety**: Đảm bảo type-safe khi trả về dữ liệu
2. **Security**: Tự động loại bỏ các thông tin nhạy cảm (password, refresh token, OTP, etc.)
3. **Consistency**: Đảm bảo cấu trúc dữ liệu nhất quán trong toàn bộ ứng dụng
4. **Flexibility**: Dễ dàng chọn interface phù hợp với từng use case
5. **Maintainability**: Dễ dàng cập nhật và bảo trì
