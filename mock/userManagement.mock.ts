import type { Request, Response } from 'express';

// 模拟用户数据
const mockUserList: API.UserListItem[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '超级管理员',
    email: 'admin@example.com',
    phone: '13800138001',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    status: 1,
    role: 'admin',
    department: '技术部',
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-15 14:30:00',
  },
  {
    id: 2,
    username: 'zhangsan',
    nickname: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138002',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    status: 1,
    role: 'user',
    department: '产品部',
    createdAt: '2024-01-05 09:00:00',
    updatedAt: '2024-01-20 16:45:00',
  },
  {
    id: 3,
    username: 'lisi',
    nickname: '李四',
    email: 'lisi@example.com',
    phone: '13800138003',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
    status: 1,
    role: 'user',
    department: '运营部',
    createdAt: '2024-02-10 11:30:00',
    updatedAt: '2024-02-25 10:20:00',
  },
  {
    id: 4,
    username: 'wangwu',
    nickname: '王五',
    email: 'wangwu@example.com',
    phone: '13800138004',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
    status: 0,
    role: 'guest',
    department: '市场部',
    createdAt: '2024-03-01 14:00:00',
    updatedAt: '2024-03-10 09:15:00',
  },
  {
    id: 5,
    username: 'zhaoliu',
    nickname: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138005',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
    status: 1,
    role: 'user',
    department: '财务部',
    createdAt: '2024-03-15 08:45:00',
    updatedAt: '2024-03-20 17:30:00',
  },
];

let userList = [...mockUserList];
let nextId = 6;

// 获取用户列表
function getUserList(req: Request, res: Response) {
  const { current = 1, pageSize = 10, username, status, role } = req.query;

  let filteredList = [...userList];

  // 筛选
  if (username) {
    filteredList = filteredList.filter(
      (item) =>
        item.username?.includes(username as string) ||
        item.nickname?.includes(username as string),
    );
  }

  if (status !== undefined && status !== '') {
    filteredList = filteredList.filter(
      (item) => item.status === Number(status),
    );
  }

  if (role) {
    filteredList = filteredList.filter((item) => item.role === role);
  }

  // 分页
  const start = (Number(current) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedList = filteredList.slice(start, end);

  res.json({
    data: paginatedList,
    total: filteredList.length,
    success: true,
    pageSize: Number(pageSize),
    current: Number(current),
  });
}

// 新增用户
function addUser(req: Request, res: Response) {
  const body = req.body;
  const newUser: API.UserListItem = {
    id: nextId++,
    ...body,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  userList.unshift(newUser);

  res.json({
    success: true,
    data: newUser,
  });
}

// 更新用户
function updateUser(req: Request, res: Response) {
  const body = req.body;
  const index = userList.findIndex((item) => item.id === body.id);

  if (index > -1) {
    userList[index] = {
      ...userList[index],
      ...body,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    res.json({
      success: true,
      data: userList[index],
    });
  } else {
    res.status(404).json({
      success: false,
      errorMessage: '用户不存在',
    });
  }
}

// 删除用户
function removeUser(req: Request, res: Response) {
  const { ids } = req.query;

  if (ids) {
    const idArray = (ids as string).split(',').map(Number);
    userList = userList.filter((item) => !idArray.includes(item.id!));
  }

  res.json({
    success: true,
  });
}

export default {
  'GET /api/user-management': getUserList,
  'POST /api/user-management': addUser,
  'PUT /api/user-management': updateUser,
  'DELETE /api/user-management': removeUser,
};
