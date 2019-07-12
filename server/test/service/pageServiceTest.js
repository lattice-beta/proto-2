import { assert, spy } from 'sinon';
import { ObjectId } from 'mongodb';
import { expect } from 'chai';

import { createResponseWithStatusCode, assertStubWasCalledOnceWith } from '../utils.js';
import { getPage, getPagesWithTag, savePageAsGuest, savePage, deletePage, updatePage, movePage, trashPage, getTrashPages, emptyTrash, restoreFromTrash, renamePage, getMyPagesWithTag, updatePageWithVersion } from '../../src/service/pageService';
import * as pageCreator from '../../src/models/creator/pageCreator';

const sinon = require('sinon');

const sandbox = sinon.sandbox.create();
const mockAWSSinon = require('mock-aws-sinon');
const Page = require('../../src/models/page.js');
const PageVersion = require('../../src/models/pageversion.js');
const User = require('../../src/models/user.js');
const Folder = require('../../src/models/folder.js');

const tag = 'Java';

const pageData = {
  heading: 'Some heading',
  title: 'Some title',
  editors: 'Some editors',
  description: 'Some description',
  editorIndex: ' Some editorIndex',
  layout: 'A perfect layout',
  workspace: 'No workspace',
  tags: ['tag1', 'tag2'],
  id: '9NL7Svh1D',
};

let pageDataWithUser = {
  heading: 'Some heading',
  title: 'Some title',
  editors: 'Some editors',
  description: 'Some description',
  editorIndex: ' Some editorIndex',
  layout: 'A perfect layout',
  workspace: 'No workspace',
  tags: ['tag1', 'tag2'],
  id: '9NL7Svh1D',
  user: {
    _id: new ObjectId('506f1f77bcf86cd799439011')
  }
};
const folderId = 'somefolderId';
const pageId = 'pageId';
const error = { error: 'Could not retrieve page' };
const pageVersion = 'version';
const guestUser = {
  _id: 1
};
const loggedInUser = {
  _id: 2,
  pages: []
};
const pageUpdateUserObjectId = new ObjectId('506f1f77bcf86cd799439011');
const pageUpdateUser = {
  _id: pageUpdateUserObjectId
};
const aggregateWithStudentFilter = Page.aggregate()
  .lookup({
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'userDetail'
  }).unwind('$userDetail')
  .match(
    {
      'userDetail.type': { $ne: 'student' },
      'tags': tag,
      '$or': [{ isPublished: true }, { isPublished: null }]
    }
  );
const aggregateWithoutStudentFilter = Page.aggregate()
  .lookup({
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'userDetail'
  }).unwind('$userDetail')
  .match(
    {
      tags: tag,
      $or: [{ isPublished: true }, { isPublished: null }]
    }
  );
const newPageId = 3;
let findSpy;
let savePageSpy;
let findOneUserSpy;
let request;
let response;
let findOneExecStub;
let findOnePageExecStub;
let findOnePageStub;
let updateUserSpy;
let updatePageSpy;
let updatePageExecStub;
let updatePageStub;
let folderCountStub;
let folderCountExecStub;
let buildPageForUpdateFromRequestStub;
let paginateSpy;
let findPageVersionStub;

describe('pageService', () => {
  beforeEach(() => {
    pageDataWithUser = {
      heading: 'Some heading',
      title: 'Some title',
      editors: 'Some editors',
      description: 'Some description',
      editorIndex: ' Some editorIndex',
      layout: 'A perfect layout',
      workspace: 'No workspace',
      tags: ['tag1', 'tag2'],
      id: '9NL7Svh1D',
      user: {
        _id: pageUpdateUserObjectId
      }
    };
  });
  describe('uploadPageSnapshotToS3ServiceStub', () => {
    beforeEach(() => {
      request = {
        body: {
          id: pageId,
          image: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error if image could not be deleted from s3', async () => {
      // TODO add test
    });
  });

  describe('getPage', () => {
    beforeEach(() => {
      request = {
        params: {
          pageId
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall retrieve page by id', () => {
      findSpy = sandbox.stub(Page, 'find').yields(null, [pageData]);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assertSendWasCalledWith([pageData]);
    });

    it('shall return error when retrieve page by id fails', () => {
      response.status = createResponseWithStatusCode(500);
      findSpy = sandbox.stub(Page, 'find').yields(error, null);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assertSendWasCalledWith(error);
    });

    it('shall return 404 when page not found', () => {
      response.status = createResponseWithStatusCode(404);
      findSpy = sandbox.stub(Page, 'find').yields(null, null);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assert.calledOnce(response.send);
    });

    it('shall return 404 when page not found', () => {
      response.status = createResponseWithStatusCode(404);
      findSpy = sandbox.stub(Page, 'find').yields(null, []);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assert.calledOnce(response.send);
    });

    it('shall return 404 when page is trashed', () => {
      const trashedPage = Object.assign({}, pageData);
      trashedPage.trashedAt = Date.now();
      response.status = createResponseWithStatusCode(404);
      findSpy = sandbox.stub(Page, 'find').yields(null, [trashedPage]);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assert.calledOnce(response.send);
    });

    it('shall return 404 when page is deleted', () => {
      const deletedPage = Object.assign({}, pageData);
      deletedPage.deletedAt = Date.now();
      response.status = createResponseWithStatusCode(404);
      findSpy = sandbox.stub(Page, 'find').yields(null, [deletedPage]);

      getPage(request, response);

      assertFindWasCalledWithPageId();
      assert.calledOnce(response.send);
    });
  });

  describe('getTrashPages', () => {
    beforeEach(() => {
      request = {
        user: loggedInUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall retrieve all trashed pages for user', async () => {
      findSpy = sandbox.stub(Page, 'find').yields(null, [pageData]);

      await getTrashPages(request, response);

      assertTrashedPagesWereRequestedForUser();
      assertSendWasCalledWith([pageData]);
    });

    it('shall return error when retrieve trashed pages fails', async () => {
      const retrievePageError = { message: 'Could not retrieve pages' };
      response.status = createResponseWithStatusCode(500);
      findSpy = sandbox.stub(Page, 'find').yields(retrievePageError, null);

      await getTrashPages(request, response);

      assertTrashedPagesWereRequestedForUser();
      assertSendWasCalledWith({ error: 'Could not retrieve pages' });
    });

    it('shall return 403 when user not found', async () => {
      request.user = null;
      response.status = createResponseWithStatusCode(403);
      findSpy = sandbox.stub(Page, 'find').yields(null, []);

      await getTrashPages(request, response);

      assert.notCalled(findSpy);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });
  });

  describe('getPagesWithTag', () => {
    beforeEach(() => {
      request = {
        query: {
          tag
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall retrieve pages for tag and default pagination parameters', () => {
      paginateSpy = sandbox.stub(Page, 'aggregatePaginate').yields(null, pageData);


      getPagesWithTag(request, response);

      assertPaginateWasCalledWithTag();
      assertSendWasCalledWith(pageData);
    });

    it('shall retrieve pages for tag with limit, offset and sort from query', () => {
      request = {
        query: {
          tag,
          offset: 7,
          limit: 13,
          sort: 'heading'
        }
      };
      paginateSpy = sandbox.stub(Page, 'aggregatePaginate').yields(null, pageData);

      getPagesWithTag(request, response);

      assertPaginateWasCalledWithTagOffsetLimit(aggregateWithStudentFilter, request.query.offset, request.query.limit, request.query.sort);
      assertSendWasCalledWith(pageData);
    });

    it('shall retrieve pages for tag with limit, offset and sort from query without filtering student pages', () => {
      request = {
        query: {
          tag,
          offset: 7,
          limit: 13,
          sort: 'heading',
          showStudentPages: true
        }
      };
      paginateSpy = sandbox.stub(Page, 'aggregatePaginate').yields(null, pageData);

      getPagesWithTag(request, response);

      assertPaginateWasCalledWithTagOffsetLimit(aggregateWithoutStudentFilter, request.query.offset, request.query.limit, request.query.sort);
      assertSendWasCalledWith(pageData);
    });

    it('shall retrieve pages for tag with limit, offset and sort from query without filtering student pages with string value for showStudentPages', () => {
      request = {
        query: {
          tag,
          offset: 7,
          limit: 13,
          sort: 'heading',
          showStudentPages: 'true'
        }
      };
      paginateSpy = sandbox.stub(Page, 'aggregatePaginate').yields(null, pageData);

      getPagesWithTag(request, response);

      assertPaginateWasCalledWithTagOffsetLimit(aggregateWithoutStudentFilter, request.query.offset, request.query.limit, request.query.sort);
      assertSendWasCalledWith(pageData);
    });

    it('shall return error when retrieve page by id fails', () => {
      response.status = createResponseWithStatusCode(500);
      paginateSpy = sandbox.stub(Page, 'aggregatePaginate').yields(error, null);

      getPagesWithTag(request, response);

      assertPaginateWasCalledWithTag();
      assertSendWasCalledWith(error);
    });
  });

  describe('getMyPagesWithTag', () => {
    beforeEach(() => {
      request = {
        query: {
          tag
        },
        user: loggedInUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return unauthorized when user not found', () => {
      request.user = null;
      response.status = createResponseWithStatusCode(403);
      findSpy = sandbox.stub(Page, 'find').yields(null, pageData);

      getMyPagesWithTag(request, response);

      assert.notCalled(findSpy);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });

    it('shall return error if retrieving my pages matching tags fails', async () => {
      response.status = createResponseWithStatusCode(500);
      const execSpy = sandbox.stub().throws({ message: 'Could not connect to database' });
      const sortSpy = (sortByArgs) => {
        expect(sortByArgs).to.be.eql({ title: -1 });
        return { exec: execSpy };
      };
      findSpy = sandbox.stub(Page, 'find').returns({ sort: sortSpy, exec: execSpy });

      await getMyPagesWithTag(request, response);

      assertStubWasCalledOnceWith(findSpy, { user: loggedInUser._id, tags: tag });
      assert.calledOnce(execSpy);
      assertSendWasCalledWith({ error: 'Could not connect to database' });
    });

    it('shall return my pages matching tags', async () => {
      response.status = createResponseWithStatusCode(200);
      const execSpy = sandbox.stub().returns(pageData);
      const sortSpy = (sortByArgs) => {
        expect(sortByArgs).to.be.eql({ title: -1 });
        return { exec: execSpy };
      };
      findSpy = sandbox.stub(Page, 'find').returns({ sort: sortSpy, exec: execSpy });

      await getMyPagesWithTag(request, response);

      assertStubWasCalledOnceWith(findSpy, { user: loggedInUser._id, tags: tag });
      assert.calledOnce(execSpy);
      assertSendWasCalledWith(pageData);
    });
  });

  describe('savePageAsGuest', () => {
    beforeEach(() => {
      request = {
        query: {
          tag
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error if peblioguest user not found', async () => {
      response.status = createResponseWithStatusCode(500);
      findOneExecStub = sandbox.stub().throws({ message: 'peblioguest user not found' });
      findOneUserSpy = sandbox.stub(User, 'findOne').returns({ exec: findOneExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').throws({ message: 'Could not save Page as guest' });

      await savePageAsGuest(request, response);

      assertFindOneUserWasCalledWithName();
      assert.calledOnce(findOneExecStub);
      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'peblioguest user not found' });
    });

    it('shall return error when saving page errors page by id', async () => {
      response.status = createResponseWithStatusCode(500);
      findOneExecStub = sandbox.stub().returns(guestUser);
      findOneUserSpy = sandbox.stub(User, 'findOne').returns({ exec: findOneExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').throws({ message: 'Could not save Page as guest' });

      await savePageAsGuest(request, response);

      assertFindOneUserWasCalledWithName();
      assert.calledOnce(findOneExecStub);
      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ error: 'Could not save Page as guest' });
    });

    it('shall save page as guest', async () => {
      findOneExecStub = sandbox.stub().returns(guestUser);
      findOneUserSpy = sandbox.stub(User, 'findOne').returns({ exec: findOneExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').returns(pageData);

      await savePageAsGuest(request, response);

      assertFindOneUserWasCalledWithName();
      assert.calledOnce(findOneExecStub);
      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ page: pageData });
    });
  });

  describe('savePage', () => {
    beforeEach(() => {
      request = {
        user: loggedInUser,
        body: {
          id: newPageId
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return unauthorized if user not present in request', async () => {
      response.status = createResponseWithStatusCode(403);
      savePageSpy = sandbox.stub(Page.prototype, 'save').returns(pageData);

      await savePage({}, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });

    it('shall return error if saving page fails', async () => {
      response.status = createResponseWithStatusCode(500);
      savePageSpy = sandbox.stub(Page.prototype, 'save').throws({ message: 'Error saving page' });

      await savePage(request, response);

      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ error: 'Error saving page' });
    });

    it('shall save page for logged in user', async () => {
      savePageSpy = sandbox.stub(Page.prototype, 'save').returns(pageData);

      await savePage(request, response);

      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ page: pageData });
    });
  });

  describe('deletePage', () => {
    beforeEach(() => {
      request = {
        params: {
          pageId: newPageId
        },
        user: pageUpdateUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error when deleting page not owned by user', async () => {
      pageDataWithUser.user = {
        _id: new ObjectId('503f1f77bcf86cd799439011')
      };
      response.status = createResponseWithStatusCode(403);
      updatePageSpy = sandbox.stub(Page, 'update');
      findOnePageExecStub = sandbox.stub().returns(pageDataWithUser);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });

      await deletePage(request, response);

      assert.notCalled(updatePageSpy);
      assertStubWasCalledOnceWith(findOnePageStub, { _id: newPageId });
      assertSendWasCalledWith({ error: 'You do not have the permissions to delete this page' });
    });

    it('shall return error when deleting page', async () => {
      pageDataWithUser.user = pageUpdateUser;
      response.status = createResponseWithStatusCode(500);
      updatePageSpy = sandbox.stub(Page, 'update').throws({ message: 'Could not delete page' });
      findOnePageExecStub = sandbox.stub().returns(pageDataWithUser);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });

      await deletePage(request, response);

      assertPageWasUpdatedWithDeletedAtDetails();
      assertStubWasCalledOnceWith(findOnePageStub, { _id: newPageId });
      assertSendWasCalledWith({ error: 'Could not delete page' });
    });

    it('shall return success after page is deleted', async () => {
      findOnePageExecStub = sandbox.stub().returns(pageDataWithUser);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      response.sendStatus = createResponseWithStatusCode(204);
      updatePageSpy = sandbox.stub(Page, 'update');

      await deletePage(request, response);

      assertStubWasCalledOnceWith(findOnePageStub, { _id: newPageId });
      assertPageWasUpdatedWithDeletedAtDetails();
      assert.notCalled(response.send);
    });

    it('shall return error when no user found', async () => {
      request.user = null;
      findOnePageExecStub = sandbox.stub().returns(pageDataWithUser);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      response.status = createResponseWithStatusCode(403);
      updatePageSpy = sandbox.stub(Page, 'update');

      await deletePage(request, response);

      assert.notCalled(findOnePageStub);
      assert.notCalled(updatePageSpy);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });
  });

  describe('restoreFromTrash', () => {
    beforeEach(() => {
      request = {
        params: {
          pageId: newPageId
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error is restore page fails', async () => {
      response.status = createResponseWithStatusCode(500);
      updatePageSpy = sandbox.stub(Page, 'update').throws({ message: 'Could not restore page' });

      await restoreFromTrash(request, response);

      assertPageWasUpdatedWithDeletedAtDetails();
      assertSendWasCalledWith({ error: 'Could not restore page' });
    });

    it('shall return success after page trashedAt updated to null', async () => {
      response.sendStatus = createResponseWithStatusCode(204);
      updatePageSpy = sandbox.stub(Page, 'update');

      await restoreFromTrash(request, response);

      assertPageWasUpdatedWithTrashedAtAsNull();
      assert.notCalled(response.send);
    });
  });

  describe('trashPage', () => {
    beforeEach(() => {
      request = {
        params: {
          pageId: newPageId
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error is trashing page fails', async () => {
      response.status = createResponseWithStatusCode(500);
      updatePageSpy = sandbox.stub(Page, 'update').throws({ message: 'Could not trash page' });

      await trashPage(request, response);

      assertPageWasUpdatedWithTrashedAtDetails();
      assertSendWasCalledWith({ error: 'Could not trash page' });
    });

    it('shall return success after page is trashed', async () => {
      response.sendStatus = createResponseWithStatusCode(204);
      updatePageSpy = sandbox.stub(Page, 'update');

      await trashPage(request, response);

      assertPageWasUpdatedWithTrashedAtDetails();
      assert.notCalled(response.send);
    });
  });

  describe('emptyTrash', () => {
    beforeEach(() => {
      request = {
        user: loggedInUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(204),
        sendStatus: createResponseWithStatusCode(204)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error is emptying trash fails', async () => {
      response.status = createResponseWithStatusCode(500);
      updatePageSpy = sandbox.stub(Page, 'updateMany').throws({ message: 'Could not empty trash' });

      await emptyTrash(request, response);

      assertAllPagesForUserWasUpdatedWithDeletedAtDetails();
      assertSendWasCalledWith({ error: 'Could not empty trash' });
    });

    it('shall return success after emptying trash', async () => {
      updatePageSpy = sandbox.stub(Page, 'updateMany').returns(null);

      await emptyTrash(request, response);

      assertAllPagesForUserWasUpdatedWithDeletedAtDetails();
    });
  });

  describe('updatePage', () => {
    beforeEach(() => {
      request = {
        body: { ...pageData },
        user: loggedInUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return 403 error when request is unauthrorized', async () => {
      request.user = null;
      response.status = createResponseWithStatusCode(403);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);

      await updatePage(request, response);

      assert.notCalled(buildPageForUpdateFromRequestStub);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });

    it('shall return error when retrieval of page to be updated threw an error', async () => {
      response.status = createResponseWithStatusCode(500);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields({ message: 'Could not update page' }, null);

      await updatePage(request, response);

      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
    });

    it('shall return error when page to be updated was not found', async () => {
      response.status = createResponseWithStatusCode(500);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, null);

      await updatePage(request, response);

      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
    });

    it('shall return error when page to be updated does not have user', async () => {
      response.status = createResponseWithStatusCode(500);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, pageData);

      await updatePage(request, response);

      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
    });

    it('shall return unauthorized error when page to be updated is not owned by user trying to update it', async () => {
      pageData.user = ObjectId('507f1f77bcf86cd799439011');
      response.status = createResponseWithStatusCode(403);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, pageData);

      await updatePage(request, response);

      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Missing permission to update page' });
    });

    it('shall return error if updating page fails', async () => {
      pageData.user = loggedInUser._id;
      response.status = createResponseWithStatusCode(500);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, pageData);
      updatePageSpy = sandbox.stub(Page, 'update').yields({ message: 'Could not update page' }, null);

      await updatePage(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertUpdatePageWasCalledWithLatestPageData();
      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assertSendWasCalledWith({ message: 'Could not update page' });
    });

    it('shall return success after updating page', async () => {
      pageData.user = loggedInUser._id;
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageData);
      buildPageForUpdateFromRequestStub = sandbox.stub(pageCreator, 'buildPageForUpdateFromRequest').returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, pageData);

      await updatePage(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertUpdatePageWasCalledWithLatestPageData();
      assert.calledOnce(buildPageForUpdateFromRequestStub);
      assert.calledOnce(response.send);
    });
  });

  describe('updatePageWithVersion', () => {
    beforeEach(() => {
      request = {
        query: { id: pageData.id, version: pageVersion },
        user: loggedInUser
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return 403 error when request is unauthrorized', async () => {
      request.user = null;
      response.status = createResponseWithStatusCode(403);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageData);

      await updatePageWithVersion(request, response);

      assertSendWasCalledWith({ error: 'Please log in first' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when retrieval of page to be updated threw an error', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields({ message: 'Could not retrieve page' }, null);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageDataWithUser);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when no page could be retrieved', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields({ message: 'Could not retrieve page' }, null);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, null);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when retrieved page does not have user', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, {});
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageDataWithUser);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Could not retrieve page!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when user trying to update page does not own page', async () => {
      response.status = createResponseWithStatusCode(403);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageData, user: 'holaUser' });
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageDataWithUser);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertSendWasCalledWith({ error: 'Missing permission to update page' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when user pageVersion retrieve error', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageDataWithUser, user: loggedInUser._id });
      findPageVersionStub = sandbox.stub(PageVersion, 'find').yields({ message: 'Could not retrieve page version!' }, null);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageData);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertFindPageVersionWasCalledWithPageIdAndVersion();
      assertSendWasCalledWith({ error: 'Could not retrieve page version!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when user no pageVersion data available', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageDataWithUser, user: loggedInUser._id });
      findPageVersionStub = sandbox.stub(PageVersion, 'find').yields(null, null);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageData);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertFindPageVersionWasCalledWithPageIdAndVersion();
      assertSendWasCalledWith({ error: 'Could not retrieve page version!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when user no pageVersion data empty', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageDataWithUser, user: loggedInUser._id });
      findPageVersionStub = sandbox.stub(PageVersion, 'find').yields(null, []);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, pageData);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertFindPageVersionWasCalledWithPageIdAndVersion();
      assertSendWasCalledWith({ error: 'Could not retrieve page version!' });
      assert.notCalled(updatePageSpy);
    });

    it('shall return error when updating pageData', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageDataWithUser, user: loggedInUser._id });
      findPageVersionStub = sandbox.stub(PageVersion, 'find').yields(null, [pageDataWithUser]);
      updatePageSpy = sandbox.stub(Page, 'update').yields({ message: 'error updating page' }, null);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertFindPageVersionWasCalledWithPageIdAndVersion();
      assertSendWasCalledWith({ message: 'error updating page' });
      assert.calledOnce(updatePageSpy);
      assertUpdatePageWasCalledLatestPageVersionData();
    });

    it('shall restore page version', async () => {
      response.status = createResponseWithStatusCode(200);
      findOnePageStub = sandbox.stub(Page, 'findOne').yields(null, { ...pageDataWithUser, user: loggedInUser._id });
      findPageVersionStub = sandbox.stub(PageVersion, 'find').yields(null, [pageDataWithUser]);
      updatePageSpy = sandbox.stub(Page, 'update').yields(null, null);

      await updatePageWithVersion(request, response);

      assertFindOnePageWasCalledWithPageId();
      assertFindPageVersionWasCalledWithPageIdAndVersion();
      assert.calledOnce(response.send);
      assert.calledOnce(updatePageSpy);
      assertUpdatePageWasCalledLatestPageVersionData();
    });
  });

  describe('movePage', () => {
    beforeEach(() => {
      request = {
        user: loggedInUser,
        body: {
          folderId
        },
        params: {
          pageId
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(200)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error if request not authenticated', async () => {
      response.status = createResponseWithStatusCode(403);
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage({}, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });

    it('shall return 400 if no body', async () => {
      response.sendStatus = createResponseWithStatusCode(400);
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage({ user: loggedInUser }, response);

      assert.notCalled(savePageSpy);
      assert.notCalled(response.send);
    });

    it('shall return error if page not found', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageExecStub = sandbox.stub().throws({ message: 'Could not find page' });
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage(request, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'Could not find page' });
      assertFindOnePageWasCalledWithId();
    });

    it('shall return 404 if page not found', async () => {
      response.status = createResponseWithStatusCode(404);
      findOnePageExecStub = sandbox.stub().returns(null);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage(request, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: `Page with id ${pageId} not found` });
      assertFindOnePageWasCalledWithId();
    });

    it('shall return error if retrieve folder gives error', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageExecStub = sandbox.stub().returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      folderCountExecStub = sandbox.stub().throws({ message: 'Folder not found' });
      folderCountStub = sandbox.stub(Folder, 'count').returns({ exec: folderCountExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage(request, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'Folder not found' });
      assertFindOnePageWasCalledWithId();
      assert.calledOnce(folderCountExecStub);
      assertFolderCountWasCalledWithFolderId();
    });

    it('shall return 404 if folder not found', async () => {
      response.status = createResponseWithStatusCode(404);
      findOnePageExecStub = sandbox.stub().returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      folderCountExecStub = sandbox.stub().returns(null);
      folderCountStub = sandbox.stub(Folder, 'count').returns({ exec: folderCountExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save');

      await movePage(request, response);

      assert.notCalled(savePageSpy);
      assertSendWasCalledWith({ error: 'Folder with id somefolderId not found' });
      assertFindOnePageWasCalledWithId();
      assert.calledOnce(folderCountExecStub);
      assertFolderCountWasCalledWithFolderId();
    });

    it('shall return error if saving page fails', async () => {
      response.status = createResponseWithStatusCode(500);
      findOnePageExecStub = sandbox.stub().returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      folderCountExecStub = sandbox.stub().returns(1);
      folderCountStub = sandbox.stub(Folder, 'count').returns({ exec: folderCountExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').throws({ message: 'Save page failed' });
      pageData.save = savePageSpy;

      await movePage(request, response);

      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ error: 'Save page failed' });
      assertFindOnePageWasCalledWithId();
      assert.calledOnce(folderCountExecStub);
      assertFolderCountWasCalledWithFolderId();
    });

    it('shall move page to new folder', async () => {
      findOnePageExecStub = sandbox.stub().returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      folderCountExecStub = sandbox.stub().returns(1);
      folderCountStub = sandbox.stub(Folder, 'count').returns({ exec: folderCountExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').returns(pageData);
      pageData.save = savePageSpy;

      await movePage(request, response);

      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ page: pageData });
      assertFindOnePageWasCalledWithId();
      assert.calledOnce(folderCountExecStub);
      assertFolderCountWasCalledWithFolderId();
    });

    it('shall remove page from folder', async () => {
      request.body.folderId = null;
      findOnePageExecStub = sandbox.stub().returns(pageData);
      findOnePageStub = sandbox.stub(Page, 'findOne').returns({ exec: findOnePageExecStub });
      folderCountExecStub = sandbox.stub().returns(1);
      folderCountStub = sandbox.stub(Folder, 'count').returns({ exec: folderCountExecStub });
      savePageSpy = sandbox.stub(Page.prototype, 'save').returns(pageData);
      pageData.save = savePageSpy;

      await movePage(request, response);

      assert.calledOnce(savePageSpy);
      assertSendWasCalledWith({ page: pageData });
      assert.notCalled(folderCountStub);
      assertFindOnePageWasCalledWithId();
    });
  });

  describe('renamePage', () => {
    beforeEach(() => {
      request = {
        user: loggedInUser,
        body: {
          folderId
        },
        params: {
          pageId: pageData._id,
          pageName: 'NewName'
        }
      };
      response = {
        send: spy(),
        json: spy(),
        status: createResponseWithStatusCode(200),
        sendStatus: createResponseWithStatusCode(204)
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('shall return error if request not authenticated', async () => {
      response.status = createResponseWithStatusCode(403);
      updatePageExecStub = sandbox.stub().returns({});
      updatePageStub = sandbox.stub(Page, 'update').returns({ exec: updatePageExecStub });

      await renamePage({}, response);

      assert.notCalled(updatePageStub);
      assertSendWasCalledWith({ error: 'Please log in first' });
    });

    it('shall update page with new pageName', async () => {
      response.status = createResponseWithStatusCode(204);
      updatePageExecStub = sandbox.stub().returns(Promise.resolve());
      updatePageStub = sandbox.stub(Page, 'update').returns({ exec: updatePageExecStub });

      await renamePage(request, response);

      assertUpdatePageWasCalledWithNewPageTitle(updatePageExecStub);
      assert.calledOnce(updatePageStub);
      assert.notCalled(response.send);
    });

    it('shall return error while renaming page with new pageName', async () => {
      response.status = createResponseWithStatusCode(500);
      updatePageExecStub = sandbox.stub().throws({ message: 'Could not update page' });
      updatePageStub = sandbox.stub(Page, 'update').returns({ exec: updatePageExecStub });

      await renamePage(request, response);

      assertUpdatePageWasCalledWithNewPageTitle(updatePageExecStub);
      assert.calledOnce(updatePageStub);
      assertSendWasCalledWith({ error: 'Could not update page' });
    });
  });
});

function assertUpdatePageWasCalledWithLatestPageData() {
  assert.calledOnce(updatePageSpy);
  assert.calledWith(updatePageSpy,
    { id: pageData.id },
    {
      heading: pageData.heading,
      title: pageData.title,
      id: '9NL7Svh1D',
      description: pageData.description,
      editors: pageData.editors,
      editorIndex: pageData.editorIndex,
      layout: pageData.layout,
      workspace: pageData.workspace,
      tags: pageData.tags,
      user: loggedInUser._id
    },
    sinon.match.any);
}

function assertUpdatePageWasCalledLatestPageVersionData() {
  assert.calledOnce(updatePageSpy);
  assert.calledWith(updatePageSpy,
    { id: pageData.id },
    pageDataWithUser,
    sinon.match.any);
}

function assertUpdatePageWasCalledWithNewPageTitle(stub) {
  assert.calledOnce(stub);
  assert.calledWith(updatePageStub, { _id: pageData._id }, { title: 'NewName' });
}

function assertFindWasCalledWithPageId() {
  assertStubWasCalledOnceWith(findSpy, { id: pageId });
}

function assertAllPagesForUserWasUpdatedWithDeletedAtDetails() {
  assertStubWasCalledOnceWith(updatePageSpy, { user: loggedInUser._id, trashedAt: { $exists: true, $ne: null } }, {
    trashedAt: null,
    deletedAt: Date.now(),
    folder: null
  });
}

function assertTrashedPagesWereRequestedForUser() {
  assertStubWasCalledOnceWith(findSpy, { user: loggedInUser._id, trashedAt: { $exists: true } });
}

function assertFolderCountWasCalledWithFolderId() {
  assertStubWasCalledOnceWith(folderCountStub, { _id: folderId, user: loggedInUser._id });
}

function assertFindOnePageWasCalledWithId() {
  assertStubWasCalledOnceWith(findOnePageStub, { _id: pageId });
}

function assertFindOnePageWasCalledWithPageId() {
  assertStubWasCalledOnceWith(findOnePageStub, { id: pageData.id });
}

function assertFindPageVersionWasCalledWithPageIdAndVersion() {
  assertStubWasCalledOnceWith(findPageVersionStub, { id: pageData.id, version_id: pageVersion });
}

function assertPageWasUpdatedWithDeletedAtDetails() {
  assertStubWasCalledOnceWith(updatePageSpy, { _id: newPageId }, { deletedAt: Date.now(), trashedAt: null });
}

function assertPageWasUpdatedWithTrashedAtAsNull() {
  assertStubWasCalledOnceWith(updatePageSpy, { _id: newPageId }, { trashedAt: null });
}

function assertPageWasUpdatedWithTrashedAtDetails() {
  assertStubWasCalledOnceWith(updatePageSpy, { _id: newPageId }, { trashedAt: Date.now() });
}

function assertUpdateUserWasCalledWithPageId() {
  assertStubWasCalledOnceWith(updateUserSpy, { _id: loggedInUser._id }, { pages: [request.body.id] });
}

function assertPaginateWasCalledWithTag() {
  assertStubWasCalledOnceWith(paginateSpy, aggregateWithStudentFilter, { offset: 0, limit: 10, sort: 'title' });
}

function assertPaginateWasCalledWithTagOffsetLimit(aggregate, offset, limit, sort) {
  assertStubWasCalledOnceWith(paginateSpy, aggregate, { $or: [{ isPublished: true }, { isPublished: null }], tags: tag }, { offset, limit, sort });
}

function assertSendWasCalledWith(msg) {
  assertStubWasCalledOnceWith(response.send, sinon.match(msg));
}

function assertFindOneUserWasCalledWithId() {
  assertStubWasCalledOnceWith(findOneUserSpy, { _id: loggedInUser._id });
}

function assertFindOneUserWasCalledWithName() {
  assertStubWasCalledOnceWith(findOneUserSpy, { name: 'peblioguest' });
}
