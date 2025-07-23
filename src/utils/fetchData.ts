import { message, Modal } from 'ant-design-vue';
import { logout } from '../api/user';

type Response<T> = {
  data: T;
  statusCode: number;
  succeeded: boolean;
  timestamp: number;
  errors?: string;
  extras?: any;
};

export default async function fetchData<T extends object>(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const token = localStorage.getItem('token');

  const defaultHeader: {
    Authorization?: string;
    'CONTENT-TYPE'?: string;
  } = {
    Authorization: `Bearer ${token}`,
    'CONTENT-TYPE': 'application/json',
  };

  if (init?.body instanceof FormData) {
    delete defaultHeader['CONTENT-TYPE'];
  }

  try {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...defaultHeader,
        ...init?.headers,
      },
    });

    const json: Response<T> = await res.json();

    switch (json.statusCode) {
      case 400:
      case 402:
      case 403:
      case 404:
      case 405:
      case 422:
        throw new Error(json.errors);
      case 401:
        const error = new Error('登录过期, 请重新登录');
        error.name = 'Authorization_Error';
        throw error;
      case 500:
      case 501:
      case 502:
        throw new Error(json.errors);
      case 200:
      default:
        break;
    }

    const data: T = {
      ...json?.data,
      ...json?.extras,
    };

    return data;
  } catch (e) {
    Modal.destroyAll();

    if (e instanceof Error && e.name === 'Authorization_Error') {
      Modal.error({
        title: '登录过期',
        content: e.message,
        onOk: logout,
        onCancel: logout,
      });
    } else if (e instanceof Error) {
      message.error(e.message);
    }
    throw e;
  }
}
