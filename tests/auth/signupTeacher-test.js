import { Selector } from 'testcafe';
import { MailSlurp } from 'mailslurp-client';
import config from '../config';
import { clearDB, deleteIntegrationtestUser } from '../helpers';

const api = new MailSlurp({ apiKey: '<add api key here>' });
const mailSlurpEmailId = '<add email id here>';
const inboxId = '<add inbox id here>';

fixture('Signing up as a teacher')
  .page(config.baseUrl)
  .beforeEach(async (t) => {
    await clearDB();
    await t.setNativeDialogHandler(type => type === 'beforeunload');
    await t.eval(() => window.location.reload(true));
    await deleteIntegrationtestUser(config.baseUrl);
  });

test('through the signup form with a valid email and password', async (t) => {
  await t
    .click(Selector('[data-test=user-account__signup-button]'))
    .click(Selector('[data-test=signup-modal__radio-teacher]'))
    .click(Selector('[data-test=signup-modal__checkbox]'))
    .click(Selector('[data-test=signup-modal__button-next]'))
    .typeText(Selector('[data-test=signup-modal__input-name]'), 'pebliointegrationtest###$$$')
    .click(Selector('[data-test=signup-modal__button-next]'))
    .click(Selector('[data-test=signup-modal__button-peblio]'))
    .typeText(Selector('[data-test=signup-modal__input-email]'),
      mailSlurpEmailId, { paste: true })
    .typeText(Selector('[data-test=signup-modal__input-pswd]'), '123456')
    .typeText(Selector('[data-test=signup-modal__input-pswd-confirm]'), '123456')
    .click(Selector('[data-test=signup-modal__button-submit]'))
    .wait(5000);


  const emails = await api.getEmails(inboxId, { minCount: 1, retryTimeout: 60000 });
  const emailId = emails[0].id;
  const confirmationEmail = await api.getEmail(emailId);
  const body = confirmationEmail.body;
  const confirmationCode = body.split('/confirmation')[1].split('</a></p>')[0];
  const confirmationLink = `http://localhost:8082/confirmation${confirmationCode}`;
  console.log('confirmationLink is', confirmationLink);
  await api.deleteEmail(emailId);

  await t
    .navigateTo(confirmationLink)
    .wait(5000)
    .click(Selector('[data-test=close-modal]'))
    .click(Selector('[data-test=user-account__login-button]'))
    .typeText(Selector('#login-modal-name'), 'pebliointegrationtest###$$$')
    .typeText(Selector('#login-modal-password'), '123456')
    .click(Selector('[data-test=submit-login]'))
    .expect(Selector('[data-test=account-button]').exists).ok()
    .click(Selector('[data-test=account-button]'))
    .click(Selector('[data-test=user-account__logout-button]'))
    .click(Selector('[data-test=user-account__login-button]'))
    .click(Selector('[data-test=forgot-link-button]'))
    .typeText(Selector('[data-test=forgot-password-email]'),
      mailSlurpEmailId, { paste: true })
    .click(Selector('[data-test=forgot-password-submit]'))
    .wait(5000);


  const inboxEmails = await api.getEmails(inboxId, { minCount: 1, retryTimeout: 60000 });
  const resetPasswordEmailId = inboxEmails[0].id;
  const passwordResetEmail = await api.getEmail(resetPasswordEmailId);
  const passwordResetEmailBody = passwordResetEmail.body;
  const passwordResetEmailConfirmationCode = passwordResetEmailBody.split('/reset')[1].split('</a></p>')[0];
  const passwordResetConfirmationLink = `http://localhost:8082/reset${passwordResetEmailConfirmationCode}`;
  console.log('passwordResetConfirmationLink is', passwordResetConfirmationLink);
  await api.deleteEmail(resetPasswordEmailId);

  await t
    .navigateTo(passwordResetConfirmationLink)
    .typeText(Selector('[data-test=reset-modal__password]'), '1234567')
    .typeText(Selector('[data-test=reset-modal__confirm-password]'), '1234567')
    .click(Selector('[data-test=reset-modal__submit-button]'))
    .click(Selector('[data-test=close-modal]'))
    .click(Selector('[data-test=user-account__login-button]'))
    .typeText(Selector('#login-modal-name'), 'pebliointegrationtest###$$$')
    .typeText(Selector('#login-modal-password'), '1234567')
    .click(Selector('[data-test=submit-login]'))
    .expect(Selector('[data-test=account-button]').exists).ok()
    .wait(5000)
    .click(Selector('[data-test=account-button]'))
    .click(Selector('[data-test=user-account__logout-button]'));

  const resetSuccessEmails = await api.getEmails(inboxId, { minCount: 1, retryTimeout: 60000 });
  const resetSuccessEmailId = resetSuccessEmails[0].id;
  await api.deleteEmail(resetSuccessEmailId);
});
