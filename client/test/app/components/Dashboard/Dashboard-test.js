import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dashboard from '../../../../src/app/components/Dashboard/Dashboard.jsx';
import Account from '../../../../src/app/components/Dashboard/Account/Account.jsx';
import Nav from '../../../../src/app/components/Dashboard/Nav/Nav.jsx';
import Trash from '../../../../src/app/components/Dashboard/Trash/Trash.jsx';
import Profile from '../../../../src/app/components/Profile/Profile.jsx';
import Documents from '../../../../src/app/components/Shared/Documents/Documents.jsx';

import history from '../../../../src/app/utils/history';

const sinon = require('sinon');

const sandbox = sinon.sandbox.create();

const mockStore = configureMockStore([thunk]);
let wrapper;
let store;
let props;
configure({ adapter: new Adapter() });

describe('Dashboard with account view', () => {
  beforeEach(() => {
    store = mockStore({
      dashboard: {
        dashboardView: 'account'
      },
      user: {
        image: 'https://placekitten.com/500/500',
        name: 'Dolan',
        blurb: 'I am a cat'
      },
      page: {
        folders: [],
        pages: [],
        selectedFolderIds: []
      }
    });
    props = {
      location: {
        pathname: ''
      }
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders account', () => {
    wrapper = shallow(<Dashboard store={store} {...props} />);
    console.log('****');
    console.log(wrapper.text());
    console.log('****');
    // console.log(wrapper.dive());
    expect(wrapper.find('dashboard__container')).to.have.lengthOf(1);
    // expect(wrapper.find(Account)).to.have.lengthOf(1);
  });
});
