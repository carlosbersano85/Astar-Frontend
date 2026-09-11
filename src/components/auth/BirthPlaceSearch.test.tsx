import { useState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BirthPlaceSearch from "./BirthPlaceSearch";

const city = { id: 1, name: "Buenos Aires", admin1: "Buenos Aires", country: "Argentina", latitude: -34.61, longitude: -58.38, timezone: "America/Argentina/Buenos_Aires" };
function Form({ onSelect = vi.fn() }) {
  const [value, setValue] = useState("");
  return <BirthPlaceSearch value={value} onInputChange={setValue} onSelect={(place) => { setValue(place.label); onSelect(place); }} />;
}
const input = () => screen.getByPlaceholderText("Busca tu ciudad...");
async function typeCity(name: string) {
  fireEvent.change(input(), { target: { value: name } });
  await act(async () => { await vi.advanceTimersByTimeAsync(350); });
}
describe("BirthPlaceSearch", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });
  it("searches when the parent echoes typed text and preserves selected coordinates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [city] }) });
    vi.stubGlobal("fetch", fetchMock);
    const select = vi.fn();
    render(<Form onSelect={select} />);
    await typeCity("Buenos Aires");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /Buenos Aires/ }));
    expect(select).toHaveBeenCalledWith({ label: "Buenos Aires, Buenos Aires, Argentina", latitude: city.latitude, longitude: city.longitude, timezone: city.timezone });
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await typeCity("Cordoba");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("ignores an old response after the query is cleared", async () => {
    let finish: (value: unknown) => void;
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { finish = resolve; })));
    render(<Form />);
    await typeCity("Buenos Aires");
    fireEvent.change(input(), { target: { value: "" } });
    await act(async () => { finish({ ok: true, json: async () => ({ results: [city] }) }); });
    expect(screen.queryByRole("button", { name: /Buenos Aires/ })).not.toBeInTheDocument();
  });
  it("distinguishes connection failures from an empty result", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<Form />);
    await typeCity("Buenos Aires");
    expect(screen.getByText(/No pudimos conectar/)).toBeInTheDocument();
    expect(screen.queryByText(/No encontramos esa ciudad/)).not.toBeInTheDocument();
  });
  it("only reports no matches after a successful empty response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) }));
    render(<Form />);
    fireEvent.change(input(), { target: { value: "zzzz" } });
    expect(screen.queryByText(/No encontramos/)).not.toBeInTheDocument();
    await act(async () => { await vi.advanceTimersByTimeAsync(350); });
    expect(screen.getByText(/No encontramos/)).toBeInTheDocument();
  });
});
