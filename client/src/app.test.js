import {render, screen} from "@testing-library/react"
import { shallow } from 'enzyme';
import { AuthContext } from './context/authContext.js'
import App from "./App.js"
import Home from "../pages/Home.jsx"
import Navbar from "./components/Navbar.jsx"

describe('Navbar component', () => {
    let wrapper;
  
    beforeEach(() => {
      wrapper = shallow(<Navbar />);
    });
  
    it('renders the logo image', () => {
      expect(wrapper.find('.logo img')).toHaveLength(1);
    });
  
    it('renders the category links', () => {
      expect(wrapper.find('.links Link')).toHaveLength(5);
    });
  
    it('renders the user profile link', () => {
      expect(wrapper.find('.links Link').at(5).prop('to')).toBe('/profile');
    });
  
    it('renders the logout link when a user is logged in', () => {
      const currentUser = { username: 'testuser' };
      const contextValue = { currentUser, logout: jest.fn() };
  
      wrapper = shallow(
        <AuthContext.Provider value={contextValue}>
          <Navbar />
        </AuthContext.Provider>
      );
  
      expect(wrapper.find('.links Link').at(6).prop('to')).toBe('/events');
    });
  
    it('renders the login link when no user is logged in', () => {
      const contextValue = { currentUser: null };
  
      wrapper = shallow(
        <AuthContext.Provider value={contextValue}>
          <Navbar />
        </AuthContext.Provider>
      );
  
      expect(wrapper.find('.links Link').at(6).prop('to')).toBe('/login');
    });
  
    it('triggers handleLogoClick when logo is clicked', () => {
      const handleLogoClick = jest.spyOn(wrapper.instance(), 'handleLogoClick');
      wrapper.instance().forceUpdate();
  
      wrapper.find('.logo Link').simulate('click');
  
      expect(handleLogoClick).toHaveBeenCalled();
    });
  
    it('triggers handleCategoryClick when a category link is clicked', () => {
      const handleCategoryClick = jest.spyOn(wrapper.instance(), 'handleCategoryClick');
      wrapper.instance().forceUpdate();
  
      wrapper.find('.links Link').at(0).simulate('click');
  
      expect(handleCategoryClick).toHaveBeenCalledWith('birthday');
    });
  });


