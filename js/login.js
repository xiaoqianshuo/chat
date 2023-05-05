const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请输入账号';
  }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', async function (
  val
) {
  if (!val) {
    return '请输入密码';
  }
});

const form = $('.user-form');
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return;
  }
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  // const data = {
  //   loginId: loginIdValidator.input.value,
  //   password: loginPwdValidator.input.value,
  // };
  const resp = await API.login(data);
  console.log(resp);
  if (resp.code === 0) {
    alert('登录成功，点击确定，跳转首页');
    location.href = './index.html';
  } else {
    loginIdValidator.p.innerText = '账号或密码错误';
    loginPwdValidator.input.value = '';
  }
};
