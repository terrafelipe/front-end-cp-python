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

describe("semVazios", () => {
  it("tira null, undefined e texto vazio, mantém zero e false", async () => {
    const { semVazios } = await import("./formato")
    expect(semVazios({ a: null, b: undefined, c: "", d: 0, e: false, f: "x" })).toEqual({ d: 0, e: false, f: "x" })
  })
})
