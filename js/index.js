(async () => {
  // 验证是否登录
  const resp = await API.profile();
  const user = resp.data;

  if (!user) {
    alert('未登录或登录已过期！');
    location.href = './login.html';
    return;
  }

  const doms = {
    aside: {
      nickname: $('#nickname'),
      loginId: $('#loginId'),
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    txtMes: $('#txtMsg'),
    msgContainer: $('.msg-container'),
  };

  // 设置用户信息
  setUserInfo();

  // 注销事件
  doms.close.addEventListener('click', () => {
    API.loginOut();
    location.href = './login.html';
  });

  // 渲染聊天记录
  await renderChat();
  async function renderChat() {
    const resp = await API.getHistory();
    const chats = resp.data;
    chats.forEach((chat) => {
      addChat(chat);
    });
    scrollBottom();
  }
  // 添加聊天记录
  doms.msgContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChat();
  });

  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  function addChat(chatInfo) {
    const div = $$$('div');
    div.classList.add('chat-item');
    if (chatInfo.from) {
      div.classList.add('me');
    }
    const img = $$$('img');
    img.className = 'chat-avatar';
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

    const content = $$$('div');
    content.className = 'chat-content';
    content.innerText = chatInfo.content;

    const date = $$$('div');
    date.className = 'chat-date';
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  async function sendChat() {
    const msg = doms.txtMes.value.trim();
    if (!msg) {
      return;
    }
    doms.txtMes.value = '';
    addChat({
      from: user.loginId,
      to: null,
      content: msg,
      createdAt: Date.now(),
    });
    scrollBottom();
    const resp = await API.sendChat(msg);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
})();
