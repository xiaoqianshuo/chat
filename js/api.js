const API = (() => {
  const BASE_URL = 'https://study.duyiedu.com';
  const TOKEN_KEY = 'token';

  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { method: 'GET', headers });
  }

  function post(path, data) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async function reg(data) {
    const resp = await post('/api/user/reg', data);
    const result = await resp.json();
    if (result.code === 0) {
      localStorage.setItem(TOKEN_KEY, resp.headers.get('authorization'));
    }
    return result;
  }

  async function login(data) {
    const resp = await post('/api/user/login', data);
    const result = await resp.json();
    if (result.code === 0) {
      localStorage.setItem(TOKEN_KEY, resp.headers.get('authorization'));
    }
    return result;
  }

  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function exists(loginId) {
    const resp = await get(`/api/user/exists?loginId=${loginId}`);
    return await resp.json();
  }

  async function profile() {
    const resp = await get('/api/user/profile');
    return await resp.json();
  }

  async function sendChat(content) {
    const data = {
      content,
    };
    const resp = await post('/api/chat', data);
    return await resp.json();
  }

  async function getHistory() {
    const resp = await get('/api/chat/history');
    return await resp.json();
  }

  return {
    reg,
    login,
    loginOut,
    exists,
    profile,
    sendChat,
    getHistory,
  };
})();
