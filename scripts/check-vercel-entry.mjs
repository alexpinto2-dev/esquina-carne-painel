process.env.VERCEL = "1";
process.env.NODE_ENV = "production";
const module = await import("../index.ts");
if (!module.default || typeof module.default.use !== "function") {
  throw new Error("Vercel entry did not export an Express application");
}
console.log("VERCEL_ENTRY_OK");
