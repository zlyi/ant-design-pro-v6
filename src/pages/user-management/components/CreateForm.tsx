import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import type { FC } from 'react';
import { addUser } from '@/services/ant-design-pro/userManagement';

interface CreateFormProps {
  reload?: ActionType['reload'];
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const intl = useIntl();

  const { run, loading } = useRequest(addUser, {
    manual: true,
    onSuccess: () => {
      messageApi.success(
        intl.formatMessage({
          id: 'pages.userManagement.createSuccess',
          defaultMessage: '创建用户成功',
        }),
      );
      reload?.();
    },
    onError: () => {
      messageApi.error(
        intl.formatMessage({
          id: 'pages.userManagement.createFailed',
          defaultMessage: '创建用户失败，请重试',
        }),
      );
    },
  });

  return (
    <>
      {contextHolder}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.userManagement.createUser',
          defaultMessage: '新建用户',
        })}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            <FormattedMessage
              id="pages.userManagement.new"
              defaultMessage="新建"
            />
          </Button>
        }
        width="500px"
        modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          await run(value as API.UserListItem);
          return true;
        }}
      >
        <ProFormText
          name="username"
          label={intl.formatMessage({
            id: 'pages.userManagement.username',
            defaultMessage: '用户名',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.userManagement.usernameRequired"
                  defaultMessage="请输入用户名"
                />
              ),
            },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: (
                <FormattedMessage
                  id="pages.userManagement.usernamePattern"
                  defaultMessage="用户名只能包含字母、数字和下划线"
                />
              ),
            },
          ]}
          width="md"
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.usernamePlaceholder',
            defaultMessage: '请输入用户名',
          })}
        />
        <ProFormText
          name="nickname"
          label={intl.formatMessage({
            id: 'pages.userManagement.nickname',
            defaultMessage: '昵称',
          })}
          width="md"
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.nicknamePlaceholder',
            defaultMessage: '请输入昵称',
          })}
        />
        <ProFormText
          name="email"
          label={intl.formatMessage({
            id: 'pages.userManagement.email',
            defaultMessage: '邮箱',
          })}
          rules={[
            {
              type: 'email',
              message: (
                <FormattedMessage
                  id="pages.userManagement.emailInvalid"
                  defaultMessage="请输入有效的邮箱地址"
                />
              ),
            },
          ]}
          width="md"
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.emailPlaceholder',
            defaultMessage: '请输入邮箱',
          })}
        />
        <ProFormText
          name="phone"
          label={intl.formatMessage({
            id: 'pages.userManagement.phone',
            defaultMessage: '手机号',
          })}
          rules={[
            {
              pattern: /^1[3-9]\d{9}$/,
              message: (
                <FormattedMessage
                  id="pages.userManagement.phoneInvalid"
                  defaultMessage="请输入有效的手机号"
                />
              ),
            },
          ]}
          width="md"
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.phonePlaceholder',
            defaultMessage: '请输入手机号',
          })}
        />
        <ProFormSelect
          name="role"
          label={intl.formatMessage({
            id: 'pages.userManagement.role',
            defaultMessage: '角色',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.userManagement.roleRequired"
                  defaultMessage="请选择角色"
                />
              ),
            },
          ]}
          width="md"
          options={[
            {
              value: 'admin',
              label: intl.formatMessage({
                id: 'pages.userManagement.role.admin',
                defaultMessage: '管理员',
              }),
            },
            {
              value: 'user',
              label: intl.formatMessage({
                id: 'pages.userManagement.role.user',
                defaultMessage: '普通用户',
              }),
            },
            {
              value: 'guest',
              label: intl.formatMessage({
                id: 'pages.userManagement.role.guest',
                defaultMessage: '访客',
              }),
            },
          ]}
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.rolePlaceholder',
            defaultMessage: '请选择角色',
          })}
        />
        <ProFormText
          name="department"
          label={intl.formatMessage({
            id: 'pages.userManagement.department',
            defaultMessage: '部门',
          })}
          width="md"
          placeholder={intl.formatMessage({
            id: 'pages.userManagement.departmentPlaceholder',
            defaultMessage: '请输入部门',
          })}
        />
        <ProFormSelect
          name="status"
          label={intl.formatMessage({
            id: 'pages.userManagement.status',
            defaultMessage: '状态',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.userManagement.statusRequired"
                  defaultMessage="请选择状态"
                />
              ),
            },
          ]}
          width="md"
          initialValue={1}
          options={[
            {
              value: 1,
              label: intl.formatMessage({
                id: 'pages.userManagement.status.enabled',
                defaultMessage: '启用',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'pages.userManagement.status.disabled',
                defaultMessage: '禁用',
              }),
            },
          ]}
        />
      </ModalForm>
    </>
  );
};

export default CreateForm;
