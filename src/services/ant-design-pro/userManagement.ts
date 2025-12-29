// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户列表 GET /api/user-management */
export async function getUserList(
  params: {
    current?: number;
    pageSize?: number;
    username?: string;
    status?: number;
    role?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/api/user-management', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建用户 POST /api/user-management */
export async function addUser(data: API.UserListItem, options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/user-management', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/user-management */
export async function updateUser(data: API.UserListItem, options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/user-management', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/user-management */
export async function removeUser(params: { ids: number[] }, options?: { [key: string]: any }) {
  return request<{ success: boolean }>('/api/user-management', {
    method: 'DELETE',
    params,
    ...(options || {}),
  });
}
