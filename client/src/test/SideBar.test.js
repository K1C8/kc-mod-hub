import React from "react";
import { render, screen } from "@testing-library/react";
import SideBar from "../components/SideBar";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

jest.mock("@auth0/auth0-react");
jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../AuthTokenContext', () => {
    return {
        accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6Imockmock",
    }
});

describe("Home Component Tests", () => {
    const mockLoginWithRedirect = jest.fn();
    const mockUser = {
        name: "Bin Doe",
        email: "bindoe@example.com",
        picture: "http://example.com/picture.jpg",
        sub: "auth0|mockmocktesttest",
        email_verified: true,
    };


    beforeEach(() => {
        useAuth0.mockReturnValue({
            isAuthenticated: false,
            loginWithRedirect: mockLoginWithRedirect,
            user: null
        });
        // useAuthToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6Imockmock";
    });

    test('loads and displays hints before user logging in', async () => {
        // Render a React element into the DOM
        render(<SideBar />)

        // assert that the alert message is correct using

        expect(screen.getByText('Log in to view')).toBeInTheDocument();
    });

    test("renders without crashing", () => {
        render(
            <SideBar />
        )
        expect(screen.getByText('Click the search icon')).toBeInTheDocument();
    });
});
