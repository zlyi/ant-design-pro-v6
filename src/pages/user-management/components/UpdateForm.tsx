import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { message } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import { updateUser } from '@/services/ant-design-pro/userManagement';

export interface UpdateFormProps {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<API.UserListItem>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;

  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { run, loading } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      messageApi.success(
        intl.formatMessage({
          id: 'pages.userManagement.updateSuccess',
          defaultMessage: '更新成功',
        }),
      );
      setOpen(false);
      onOk?.();
    },
    onError: () => {
      messageApi.error(
        intl.formatMessage({
          id: 'pages.userManagement.updateFailed',
          defaultMessage: '更新失败，请重试',
        }),
      );
    },
  });

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onFinish = useCallback(
    async (formValues: any) => {
      await run({ ...formValues, id: values.id });
      return true;
    },
    [run, values.id],
  );

  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.userManagement.editUser',
          defaultMessage: '编辑用户',
        })}
        open={open}
        onOpenChange={setOpen}
        width="500px"
        modalProps={{
          okButtonProps: { loading },
          destroyOnClose: true,
        }}
        initialValues={values}
        onFinish={onFinish}
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

export default UpdateForm;
