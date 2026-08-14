import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createPriceItem, deletePriceItem, listPriceItems, replacePriceItems, updatePriceItem } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  prices: router({
    list: publicProcedure.query(() => listPriceItems()),
    create: publicProcedure.input(z.object({ name: z.string().min(1), priceCents: z.number().int().nonnegative(), unit: z.string().min(1).max(12), position: z.number().int().nonnegative() })).mutation(({ input }) => createPriceItem(input)),
    update: publicProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(1).optional(), priceCents: z.number().int().nonnegative().optional(), unit: z.string().min(1).max(12).optional(), position: z.number().int().nonnegative().optional() })).mutation(({ input }) => { const { id, ...patch } = input; return updatePriceItem(id, patch); }),
    remove: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deletePriceItem(input.id)),
    replaceAll: publicProcedure.input(z.object({ items: z.array(z.object({ name: z.string().min(1), priceCents: z.number().int().nonnegative(), unit: z.string().min(1).max(12), position: z.number().int().nonnegative() })) })).mutation(({ input }) => replacePriceItems(input.items)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
