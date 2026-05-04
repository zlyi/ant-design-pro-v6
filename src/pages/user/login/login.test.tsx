import { TestBrowser } from '@@/testBrowser';
import { fireEvent, render } from '@testing-library/react';
import express from 'express';
import React, { act } from 'react';
// @ts-expect-error
import mockData from '../../../../mock/requestRecord.mock';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let server: {
  close: () => void;
};

const startMock = (port: number) => {
  const app = express();

  app.get('*', (req, res) => {
    const key = `GET ${req.path}`;
    if (mockData[key]) {
      res.json(mockData[key]);
      return;
    }
    res.status(404).send(`Mock key ${key} Not Found`);
  });

  app.post('*', (req, res) => {
    const key = `POST ${req.path}`;
    if (mockData[key]) {
      res.json(mockData[key]);
      return;
    }
    res.status(404).send(`Mock key ${key} Not Found`);
  });

  return app.listen(port);
};

describe('Login Page', () => {
  beforeAll(() => {
    server = startMock(8000);
  });

  afterAll(() => {
    server?.close();
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
