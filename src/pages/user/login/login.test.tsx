import { TestBrowser } from '@@/testBrowser';
import type { Server } from 'node:http';
import { fireEvent, render } from '@testing-library/react';
import { message } from 'antd';
import express from 'express';
import React, { act } from 'react';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let server: Server;

describe('Login Page', () => {
  beforeAll(async () => {
    const app = express();

    app.use(express.json());
    app.get('/api/currentUser', (_req, res) => {
      res.json({
        data: {
          name: 'Serati Ma',
          avatar:
            'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
        },
      });
    });
    app.post('/api/login/account', (_req, res) => {
      res.json({
        status: 'ok',
        type: 'account',
        currentAuthority: 'admin',
      });
    });

    await new Promise<void>((resolve) => {
      server = app.listen(8000, resolve);
    });
  });

  afterAll(async () => {
    message.destroy();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

  it('should show login form', async () => {
    const historyRef = React.createRef<any>();
    const rootContainer = render(
      <TestBrowser
        historyRef={historyRef}
        location={{
          pathname: '/user/login',
        }}
      />,
    );

    await rootContainer.findAllByText('Ant Design');

    act(() => {
      historyRef.current?.push('/user/login');
    });

    expect(
      rootContainer.baseElement?.querySelector('.ant-pro-form-login-desc')
        ?.textContent,
    ).toBe(
      'Ant Design is the most influential web design specification in Xihu district',
    );

    expect(rootContainer.asFragment()).toMatchSnapshot();

    rootContainer.unmount();
  });

  it('should login success', async () => {
    const historyRef = React.createRef<any>();
    const rootContainer = render(
      <TestBrowser
        historyRef={historyRef}
        location={{
          pathname: '/user/login',
        }}
      />,
    );

    await rootContainer.findAllByText('Ant Design');

    const userNameInput = await rootContainer.findByPlaceholderText(
      'Username: admin or user',
    );

    act(() => {
      fireEvent.change(userNameInput, { target: { value: 'admin' } });
    });

    const passwordInput = await rootContainer.findByPlaceholderText(
      'Password: ant.design',
    );

    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'ant.design' } });
    });

    await (await rootContainer.findByText('Login')).click();

    // 等待接口返回结果
    await waitTime(5000);

    await rootContainer.findAllByText('Ant Design Pro');

    expect(rootContainer.asFragment()).toMatchSnapshot();

    await waitTime(2000);

    rootContainer.unmount();
  });
});
