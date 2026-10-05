import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { describe, expect, it } from "vitest"
import { Menu } from "./Menu"

describe("menu", () => {
  it("operador não vê Fornecedores nem Usuários", () => {
    render(<MemoryRouter><Menu ehAdmin={false} /></MemoryRouter>)
    expect(screen.getByRole("link", { name: "Produtos" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Usuários" })).toBeNull()
    expect(screen.queryByRole("link", { name: "Fornecedores" })).toBeNull()
  })
  it("admin vê tudo", () => {
    render(<MemoryRouter><Menu ehAdmin /></MemoryRouter>)
    expect(screen.getByRole("link", { name: "Usuários" })).toBeInTheDocument()
  })
})
