import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Popconfirm, Space, Tag } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import {
  getUserList,
  removeUser,
} from '@/services/ant-design-pro/userManagement';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const UserManagement: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);

  const intl = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeUser, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      messageApi.success(
        intl.formatMessage({
          id: 'pages.userManagement.deleteSuccess',
          defaultMessage: '删除成功',
        }),
      );
    },
    onError: () => {
      messageApi.error(
        intl.formatMessage({
          id: 'pages.userManagement.deleteFailed',
          defaultMessage: '删除失败，请重试',
        }),
      );
    },
  });

  const handleRemove = useCallback(
    async (selectedRows: API.UserListItem[]) => {
      if (!selectedRows?.length) {
        messageApi.warning(
          intl.formatMessage({
            id: 'pages.userManagement.selectToDelete',
            defaultMessage: '请选择要删除的用户',
          }),
        );
        return;
      }

      await delRun({
        ids: selectedRows
          .map((row) => row.id)
          .filter((id): id is number => id !== undefined),
      });
    },
    [delRun, messageApi, intl],
  );

  const handleSingleDelete = useCallback(
    async (record: API.UserListItem) => {
      if (record.id === undefined) return;
      await delRun({
        ids: [record.id],
      });
    },
    [delRun],
  );

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.username"
          defaultMessage="用户名"
        />
      ),
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.nickname"
          defaultMessage="昵称"
        />
      ),
      dataIndex: 'nickname',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.email"
          defaultMessage="邮箱"
        />
      ),
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.phone"
          defaultMessage="手机号"
        />
      ),
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.role"
          defaultMessage="角色"
        />
      ),
      dataIndex: 'role',
      valueEnum: {
        admin: {
          text: (
            <FormattedMessage
              id="pages.userManagement.role.admin"
              defaultMessage="管理员"
            />
          ),
        },
        user: {
          text: (
            <FormattedMessage
              id="pages.userManagement.role.user"
              defaultMessage="普通用户"
            />
          ),
        },
        guest: {
          text: (
            <FormattedMessage
              id="pages.userManagement.role.guest"
              defaultMessage="访客"
            />
          ),
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.department"
          defaultMessage="部门"
        />
      ),
      dataIndex: 'department',
      hideInSearch: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.userManagement.status.disabled"
              defaultMessage="禁用"
            />
          ),
          status: 'Error',
        },
        1: {
          text: (
            <FormattedMessage
              id="pages.userManagement.status.enabled"
              defaultMessage="启用"
            />
          ),
          status: 'Success',
        },
      },
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? (
            <FormattedMessage
              id="pages.userManagement.status.enabled"
              defaultMessage="启用"
            />
          ) : (
            <FormattedMessage
              id="pages.userManagement.status.disabled"
              defaultMessage="禁用"
            />
          )}
        </Tag>
      ),
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.createdAt"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.updatedAt"
          defaultMessage="更新时间"
        />
      ),
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.userManagement.option"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <UpdateForm
            trigger={
              <a>
                <FormattedMessage
                  id="pages.userManagement.edit"
                  defaultMessage="编辑"
                />
              </a>
            }
            values={record}
            onOk={() => actionRef.current?.reload()}
          />
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.userManagement.confirmDelete',
              defaultMessage: '确定要删除该用户吗？',
            })}
            onConfirm={() => handleSingleDelete(record)}
            okText={intl.formatMessage({
              id: 'pages.userManagement.confirm',
              defaultMessage: '确定',
            })}
            cancelText={intl.formatMessage({
              id: 'pages.userManagement.cancel',
              defaultMessage: '取消',
            })}
          >
            <a style={{ color: '#ff4d4f' }}>
              <FormattedMessage
                id="pages.userManagement.delete"
                defaultMessage="删除"
              />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.userManagement.title',
          defaultMessage: '用户管理',
        })}
        actionRef={actionRef}
        rowKey="id"
        cardBordered
        search={{
          labelWidth: 120,
        }}
        cardProps={{
          style: { backgroundColor: '#fff' },
        }}
        toolBarRender={() => [
          <CreateForm key="create" reload={actionRef.current?.reload} />,
        ]}
        request={getUserList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage
                id="pages.userManagement.chosen"
                defaultMessage="已选择"
              />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage
                id="pages.userManagement.item"
                defaultMessage="项"
              />
            </div>
          }
        >
          <Popconfirm
            title={intl.formatMessage({
              id: 'pages.userManagement.confirmBatchDelete',
              defaultMessage: '确定要批量删除选中的用户吗？',
            })}
            onConfirm={() => handleRemove(selectedRowsState)}
            okText={intl.formatMessage({
              id: 'pages.userManagement.confirm',
              defaultMessage: '确定',
            })}
            cancelText={intl.formatMessage({
              id: 'pages.userManagement.cancel',
              defaultMessage: '取消',
            })}
          >
            <Button loading={loading} danger>
              <FormattedMessage
                id="pages.userManagement.batchDelete"
                defaultMessage="批量删除"
              />
            </Button>
          </Popconfirm>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRow?.nickname || currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserManagement;
