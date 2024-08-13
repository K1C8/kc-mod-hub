import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../components/Home";

test('loads and displays basic list before logging in', async () => {
    // Render a React element into the DOM
    render(<Home />);

    // assert that the alert message is correct using

});

test("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });
