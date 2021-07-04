import { Selector } from 'testcafe';

import config from '../config';
import { studentUser } from '../fixtures/user';
import { seedDB, clearDB, hashUserPassword, login } from '../helpers';

fixture('Logging in')
  .page(config.baseUrl)
  .beforeEach(async (t) => {
    await clearDB();

    const hashedPassword = await hashUserPassword(studentUser.password);
    await seedDB({
      User: [{
        ...studentUser,
        password: hashedPassword
      }]
    });
  });

test('through the login form with a valid email and password', async (t) => {
  await t
    .click(Selector('[data-test=close-modal]'))
    .click(Selector('[data-test=user-account__login-button]'))
    .typeText(Selector('#login-modal-name'), studentUser.email)
    .typeText(Selector('#login-modal-password'), studentUser.password)
    .click(Selector('[data-test=submit-login]'))
    .expect(Selector('[data-test=account-button]').exists).ok();
});

test('through the login form with a invalid email and password should show error', async (t) => {
  await t
    .click(Selector('[data-test=close-modal]'))
    .click(Selector('[data-test=user-account__login-button]'))
    .typeText(Selector('#login-modal-name'), 'bla')
    .typeText(Selector('#login-modal-password'), studentUser.password)
    .click(Selector('[data-test=submit-login]'))
    .expect(Selector('[data-test=signup-modal__notice]').withText('Login failed')).ok();
});

test('with an XHR request', async (t) => {
  await login(studentUser.email, studentUser.password);
  await t.setNativeDialogHandler(type => type === 'beforeunload');
  await t.eval(() => window.location.reload(true));

  await t.expect(Selector('[data-test=account-button]').exists).ok();
});
