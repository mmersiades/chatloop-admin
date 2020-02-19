import React, { ChangeEvent } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import UsersPage from '../index';
import Root from '../../../components/Root';
import { Tabs, Tab, TableContainer, TextField, TableFooter } from '@material-ui/core';
import Navbar from '../../../components/Navbar';
import MenuDrawer from '../../../components/MenuDrawer';

let wrappedUsersPage: ReactWrapper;
let props: any;

const createTestProps = (props: any) => ({ ...props });

describe('Rendering <UsersPage/>', () => {
  beforeEach(() => {
    props = createTestProps({});
    wrappedUsersPage = mount(
      <Root>
        <UsersPage {...props} />
      </Root>
    );
  });

  afterEach(() => wrappedUsersPage.unmount());

  test('should render 1 <NavBar/>', () => {
    expect(wrappedUsersPage.find(Navbar)).toHaveLength(1);
  });

  test('should render 1 <MenuDrawer/>', () => {
    expect(wrappedUsersPage.find(MenuDrawer)).toHaveLength(1);
    expect(wrappedUsersPage.find(MenuDrawer).prop('showMenuDrawer')).toEqual(true);
  });

  test('should render 1 <Tabs/> component with 3 <Tab/>s', () => {
    expect(wrappedUsersPage.find(Tabs)).toHaveLength(1);
    const wrappedTabs = wrappedUsersPage.find(Tab);
    expect(wrappedTabs.at(0).prop('label')).toEqual('Learners');
    expect(wrappedTabs.at(1).prop('label')).toEqual('Partners');
    expect(wrappedTabs.at(2).prop('label')).toEqual('Tutors');
  });

  test('should render 4 <th /> elements', () => {
    const wrappedTableContainer = wrappedUsersPage.find(TableContainer);
    const wrappedTableHeaders = wrappedTableContainer.find('th');
    expect(wrappedTableHeaders.at(0).text()).toEqual('id');
    expect(wrappedTableHeaders.at(1).text()).toEqual('displayName');
    expect(wrappedTableHeaders.at(2).text()).toEqual('email');
    expect(wrappedTableHeaders.at(3).text()).toEqual('');
  });

  test('should render 1 add user button', () => {
    const wrappedTableContainer = wrappedUsersPage.find(TableContainer);
    const wrappedButton = wrappedTableContainer.find('button').findWhere((node) => node.text() === 'Add learner');
    expect(wrappedButton.at(0).prop('type')).toEqual('submit');
  });

  test('should render 2 <TextField/> components', () => {
    const wrappedTableContainer = wrappedUsersPage.find(TableContainer);
    const wrappedTextFields = wrappedTableContainer.find(TextField);
    expect(wrappedTextFields).toHaveLength(2);
    expect(wrappedTextFields.at(0).prop('name')).toEqual('displayName');
    expect(wrappedTextFields.at(0).prop('type')).toEqual('text');
    expect(wrappedTextFields.at(1).prop('name')).toEqual('email');
    expect(wrappedTextFields.at(1).prop('type')).toEqual('text');
  });

  test('should render a <TableFooter/>', () => {
    const wrappedTableFooter = wrappedUsersPage.find(TableFooter);
    // console.log('wrappedTableFooter', wrappedTableFooter.debug());
    expect(wrappedTableFooter).toHaveLength(1);
  });

  test('should render a <tr /> element for a user', () => {
    // const wrappedTableContainer = wrappedUsersPage.find(TableContainer);
    // const wrappedTRs = wrappedTableContainer.find('tr');
    // console.log('wrappedTRs', wrappedTRs.length);
    // console.log('wrappedTRs', wrappedTRs.at(3).debug());
  });
});

describe('Testing useState hooks', () => {
  beforeEach(() => {
    props = createTestProps({});
    wrappedUsersPage = mount(
      <Root>
        <UsersPage {...props} />
      </Root>
    );
  });

  afterEach(() => wrappedUsersPage.unmount());

  test('should set new Tab value on Tab change event', () => {
    const wrappedTabs = wrappedUsersPage.find(Tabs);
    const wrappedPartnerTab = wrappedUsersPage.find(Tab).at(1);
    // console.log('wrappedPartnerTab', wrappedPartnerTab.props());
    const mockSetTab = jest.fn();
    React.useState = jest.fn(() => [0, mockSetTab]);
    const mockChangeEvent = {} as ChangeEvent<{ checked: boolean }>;
    const mockTabValue = 1;
    // if (wrappedPartnerTab.props().onChange) {
    //   // @ts-ignore
    //   wrappedPartnerTab.props().onChange(mockChangeEvent, mockTabValue);
    // }
    // expect(mockSetTab).toHaveBeenCalled();
  });
});
