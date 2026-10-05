import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Paginacao } from "./Paginacao"

describe("Paginacao", () => {
  it("volta para a última página que existe quando a atual sumiu", () => {
    const aoMudar = vi.fn()
    render(<Paginacao pagina={3} totalPaginas={2} total={40} aoMudar={aoMudar} />)
    expect(aoMudar).toHaveBeenCalledWith(2)
  })

  it("não mexe na página quando ela existe", () => {
    const aoMudar = vi.fn()
    render(<Paginacao pagina={2} totalPaginas={2} total={40} aoMudar={aoMudar} />)
    expect(aoMudar).not.toHaveBeenCalled()
  })
})
