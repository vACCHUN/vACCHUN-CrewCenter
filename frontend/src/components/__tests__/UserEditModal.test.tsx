/// <reference types="vitest" />
/// <reference types="vite/client" />
/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import UserEditModal from "../UserEditModal";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { User } from "../../types/users";
import AuthContext from "../../context/AuthContext";
import { mockVatsimUser } from "../../__mocks__/mockuser";
import { mockUser } from "../../__mocks__/mockuser";

describe("UserEditModal", () => {
  beforeEach(() => {
    vi.mock(import("react"), async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useState: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Renders modal", () => {
    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <UserEditModal editData={mockUser as User} setEditData={vi.fn()} setEditOpen={vi.fn()} handleToggle={vi.fn()} editSubmit={vi.fn()} />
      </AuthContext.Provider>
    );

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.initial)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.CID)).toBeInTheDocument();

    const traineeToggle = screen.getByTestId("trainee").querySelector("i");
    const isInstructorToggle = screen.getByTestId("isInstructor").querySelector("i");
    const isAdminToggle = screen.getByTestId("isAdmin").querySelector("i");

    expect(traineeToggle).toBeInTheDocument();
    expect(isInstructorToggle).toBeInTheDocument();
    expect(isAdminToggle).toBeInTheDocument();

    expect(traineeToggle).toHaveClass("fa-check");
    expect(isInstructorToggle).toHaveClass("fa-x");
    expect(isAdminToggle).toHaveClass("fa-x");
  });

  it("Does not render admin toggle when editing 'self'", () => {
    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <UserEditModal editData={{ ...mockUser, CID: mockVatsimUser.cid } as User} setEditData={vi.fn()} setEditOpen={vi.fn()} handleToggle={vi.fn()} editSubmit={vi.fn()} />
      </AuthContext.Provider>
    );

    const isAdminToggle = screen.getByTestId("isAdmin").querySelector("i");

    expect(isAdminToggle).not.toBeInTheDocument();
  });

  it("Changes data on click", () => {
    const mockToggleFunction = vi.fn();

    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <UserEditModal editData={mockUser as User} setEditData={vi.fn()} setEditOpen={vi.fn()} handleToggle={mockToggleFunction} editSubmit={vi.fn()} />
      </AuthContext.Provider>
    );

    const traineeToggle = screen.getByTestId("trainee").querySelector("i");
    const isInstructorToggle = screen.getByTestId("isInstructor").querySelector("i");
    const isAdminToggle = screen.getByTestId("isAdmin").querySelector("i");

    if (traineeToggle) {
      fireEvent.click(traineeToggle);
      expect(mockToggleFunction).toHaveBeenCalledWith("trainee", 0);
    }
    if (isInstructorToggle) {
      fireEvent.click(isInstructorToggle);
      expect(mockToggleFunction).toHaveBeenCalledWith("isInstructor", 1);
    }
    if (isAdminToggle) {
      fireEvent.click(isAdminToggle);
      expect(mockToggleFunction).toHaveBeenCalledWith("isAdmin", 1);
    }
  });

  it("Calls editSubmit on save", () => {
    const mockEditSubmit = vi.fn();

    render(
      <AuthContext.Provider value={{ isAdmin: true, userData: mockVatsimUser }}>
        <UserEditModal editData={mockUser as User} setEditData={vi.fn()} setEditOpen={vi.fn()} handleToggle={vi.fn()} editSubmit={mockEditSubmit} />
      </AuthContext.Provider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);
    expect(mockEditSubmit).toHaveBeenCalledOnce();
  });
});
