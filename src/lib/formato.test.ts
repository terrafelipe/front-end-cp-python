import { describe, expect, it } from "vitest"
import { dataCurta, dataHora, dinheiro } from "./formato"

describe("formato", () => {
  it("dinheiro aceita string e número", () => {
    expect(dinheiro("27.90")).toBe("R$ 27,90")
    expect(dinheiro(4821.37)).toBe("R$ 4.821,37")
  })
  it("dataCurta não sofre com fuso", () => {
    expect(dataCurta("2026-09-25")).toBe("25/09")
  })
  it("dataHora mostra no fuso local", () => {
    expect(dataHora("2026-09-25T15:30:00+00:00")).toMatch(/^25\/09\/2026 \d{2}:30$/)
  })
})
