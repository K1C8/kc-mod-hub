import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Home from "../components/Home";
import { useNavigate } from "react-router-dom";
import FollowedItemList from "../components/FollowedItemList";
import ItemList from "../components/ItemList";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, BrowserRouter } from 'react-router-dom'

jest.mock("@auth0/auth0-react");

jest.doMock('../components/SideBar', () => {
  const SideBar = () => <div />;
  return SideBar;
});

jest.mock('../components/SideBar');
jest.mock('../components/Banner');

const SideBar = require('../components/SideBar').default;
const Banner = require('../components/Banner').default;

describe("Home Component Tests Before Login", () => {
    const mockLoginWithRedirect = jest.fn();
    const mockBanner = jest.fn();
    const mockItemList = jest.fn();
    const mockFollowedItemList = jest.fn();
    const mockSideBar = jest.fn();
  
    beforeEach(() => {
      useAuth0.mockReturnValue({
        isAuthenticated: false,
        loginWithRedirect: mockLoginWithRedirect,
      });
      // Banner.mockReturnValue({ Banner() => {return (<div />})});

    });

    test('loads and displays basic list before logging in', async () => {
        // Render a React element into the DOM
        render(<Home />);

        // assert that the alert message is correct using

        expect(screen.getByText('Most Recent Files')).toBeInTheDocument();
    });

    test("renders without crashing", () => {
        render(<Home />);
        expect(screen.getByText('Modding Hub')).toBeInTheDocument();
    });
});
