import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  listPriceItems: vi.fn(),
  createPriceItem: vi.fn(),
  updatePriceItem: vi.fn(),
  deletePriceItem: vi.fn(),
  replacePriceItems: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";
import { fromPriceCents, toPriceCents } from "../shared/price-utils";

describe("price synchronization", () => {
  beforeEach(() => vi.clearAllMocks());

  it("round-trips Brazilian prices through integer cents", () => {
    expect(toPriceCents(52.9)).toBe(5290);
    expect(toPriceCents(8.5)).toBe(850);
    expect(fromPriceCents(5290)).toBe(52.9);
    expect(fromPriceCents(850)).toBe(8.5);
  });

  it("reads the shared catalog and forwards an update mutation", async () => {
    const catalog = [{ id: 8, name: "Picanha", priceCents: 8290, unit: "kg", position: 0 }];
    dbMocks.listPriceItems.mockResolvedValue(catalog);
    dbMocks.updatePriceItem.mockResolvedValue({ ...catalog[0], priceCents: 8490 });
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    await expect(caller.prices.list()).resolves.toEqual(catalog);
    await expect(caller.prices.update({ id: 8, priceCents: 8490 })).resolves.toMatchObject({ priceCents: 8490 });
    expect(dbMocks.updatePriceItem).toHaveBeenCalledWith(8, { priceCents: 8490 });
  });

  it("forwards a complete replacement used by the maintenance save action", async () => {
    const replacement = [{ name: "Novo corte", priceCents: 3590, unit: "kg", position: 0 }];
    dbMocks.replacePriceItems.mockResolvedValue([{ id: 11, ...replacement[0] }]);
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });

    await expect(caller.prices.replaceAll({ items: replacement })).resolves.toHaveLength(1);
    expect(dbMocks.replacePriceItems).toHaveBeenCalledWith(replacement);
  });
});
