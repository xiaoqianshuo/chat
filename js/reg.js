const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请输入账号';
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return '账号已存在';
  }
});

const nicknameValidator = new FieldValidator('txtNickname', async function (
  val
) {
  if (!val) {
    return '请输入昵称';
  }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (
  val
) {
  if (!val) {
    return '请输入密码';
  }
});

const loginPwdConfirmValidator = new FieldValidator(
  'txtLoginPwdConfirm',
  async function (val) {
    if (!val) {
      return '请再次输入密码';
    }
    if (val !== loginPwdValidator.input.value) {
      return '两次输入密码不一致';
    }
  }
);

const form = $('.user-form');
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  // const data = {
  //   loginId: loginIdValidator.input.value,
  //   nickname: nicknameValidator.input.value,
  //   password: loginPwdValidator.input.value,
  // };
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert('点击确定，跳转登陆页');
    location.href = './login.html';
  }
};
