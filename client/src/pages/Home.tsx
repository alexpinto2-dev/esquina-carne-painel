/*
 * Direção visual: Placa de Açougue Contemporânea.
 * Esta página privilegia leitura a distância, preço em primeiro plano,
 * faixas assimétricas e manutenção simples sem abandonar o contexto público.
 */
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Eye, MonitorCog, Pencil, Plus, Search, Settings2, Trash2, X } from "lucide-react";

type Product = { id: number; name: string; price: number; unit: string; category: string; highlight?: boolean };

const initialProducts: Product[] = [
  { id: 1, name: "Picanha Nacional Fresca", price: 84.99, unit: "kg", category: "Bovinos", highlight: true },
  { id: 2, name: "Filé Mignon Completo", price: 84.99, unit: "kg", category: "Bovinos" },
  { id: 3, name: "Bife Ancho", price: 50.99, unit: "kg", category: "Bovinos" },
  { id: 4, name: "Carne Moída", price: 22.99, unit: "kg", category: "Bovinos" },
  { id: 5, name: "Coração de Frango Temperado", price: 48.9, unit: "kg", category: "Aves", highlight: true },
  { id: 6, name: "Filé de Peito de Frango", price: 25.99, unit: "kg", category: "Aves" },
  { id: 7, name: "Coxa e Sobrecoxa", price: 12.99, unit: "kg", category: "Aves" },
  { id: 8, name: "Toscana de Frango", price: 27.99, unit: "kg", category: "Aves" },
  { id: 9, name: "Linguiça Caseira", price: 34.99, unit: "kg", category: "Suínos", highlight: true },
  { id: 10, name: "Costela Suína Fresca", price: 27.99, unit: "kg", category: "Suínos" },
  { id: 11, name: "Bacon Fatiado", price: 59, unit: "kg", category: "Suínos" },
  { id: 12, name: "Kit Feijoada", price: 29.99, unit: "kg", category: "Suínos" },
  { id: 13, name: "Queijo Coalho", price: 34.9, unit: "kg", category: "Mercearia" },
  { id: 14, name: "Charque de 1ª", price: 64.99, unit: "kg", category: "Mercearia" },
  { id: 15, name: "Manteiga", price: 41, unit: "kg", category: "Mercearia" },
  { id: 16, name: "Amarradinho de Carneiro", price: 8.5, unit: "und", category: "Especiais" },
];

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const groups = ["Todos", "Bovinos", "Aves", "Suínos", "Mercearia", "Especiais"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem("esquina-products") || "null") || initialProducts; } catch { return initialProducts; }
  });
  const [activeGroup, setActiveGroup] = useState("Todos");
  const [search, setSearch] = useState("");
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [tvMode, setTvMode] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => { localStorage.setItem("esquina-products", JSON.stringify(products)); }, [products]);
  useEffect(() => { if (!tvMode) return; const timer = window.setInterval(() => setPage((p) => p + 1), 9000); return () => window.clearInterval(timer); }, [tvMode]);

  const filtered = useMemo(() => products.filter((item) => (activeGroup === "Todos" || item.category === activeGroup) && item.name.toLowerCase().includes(search.toLowerCase())), [products, activeGroup, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page % pageCount) * pageSize, (page % pageCount) * pageSize + pageSize);

  const updateProduct = (id: number, patch: Partial<Product>) => setProducts((list) => list.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addProduct = () => setProducts((list) => [...list, { id: Date.now(), name: "Novo produto", price: 0, unit: "kg", category: "Bovinos" }]);
  const removeProduct = (id: number) => setProducts((list) => list.filter((item) => item.id !== id));
  const saveAndClose = () => { setMaintenanceOpen(false); toast.success("Preços atualizados no painel"); };

  return (
    <div className={`min-h-screen bg-[#101b2d] text-[#f9f0dd] ${tvMode ? "tv-mode" : ""}`}>
      <header className="relative overflow-hidden border-b border-[#f9f0dd]/15 bg-[#162b49]">
        <div className="absolute inset-0 bg-[url('/manus-storage/meat-counter-texture_64602349.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="brand-mark"><img src="/manus-storage/esquina-mark_9e061ab1.png" alt="Marca Esquina da Carne" /></div>
            <div><p className="eyebrow text-[#e3b77b]">Aracaju · Sergipe</p><h1 className="display-title text-3xl leading-none sm:text-5xl">ESQUINA DA CARNE</h1><p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e0e7]/75 sm:text-sm">Preço bom se reconhece de longe.</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#f9f0dd]/20 bg-[#101b2d]/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#d9e0e7] lg:flex"><span className="live-dot" /> Painel ao vivo</div>
            <Button onClick={() => setMaintenanceOpen(true)} className="h-11 gap-2 rounded-md bg-[#d94a3d] px-4 font-bold text-[#fff8ec] shadow-lg shadow-[#d94a3d]/20 hover:bg-[#ef5b4d]"><Settings2 className="size-4" /> <span className="hidden sm:inline">Manutenção</span></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 pb-8 pt-6 sm:px-8 lg:px-12">
        <section className="hero-strip mb-7 grid gap-6 overflow-hidden rounded-sm border border-[#e3b77b]/25 bg-[#213b61] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="offer-tag">OFERTA DO DIA</div><h2 className="display-title mt-4 max-w-3xl text-4xl leading-[0.9] sm:text-6xl lg:text-8xl">Corte certo.<br /><span className="text-[#e3b77b]">Preço aberto.</span></h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-[#d9e0e7]/80 sm:text-base">Carnes selecionadas e preparadas com cuidado para o seu almoço, churrasco e feira da semana.</p></div>
          <div className="hero-price-block"><span className="eyebrow text-[#d94a3d]">Destaque</span><strong>{money(products.find((p) => p.highlight)?.price || 84.99)}</strong><span>por kg · consulte disponibilidade</span></div>
        </section>

        <div className="mb-5 flex flex-col gap-4 border-y border-[#f9f0dd]/12 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">{groups.map((group) => <button key={group} onClick={() => { setActiveGroup(group); setPage(0); }} className={`category-tab whitespace-nowrap ${activeGroup === group ? "active" : ""}`}>{group}</button>)}</div>
          <div className="flex items-center gap-3"><span className="text-xs uppercase tracking-wider text-[#d9e0e7]/60">Atualizado agora</span><button onClick={() => setTvMode(!tvMode)} className="tv-toggle" aria-label="Alternar modo TV"><Eye className="size-4" /> {tvMode ? "Sair da TV" : "Modo TV"}</button></div>
        </div>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
          {visible.map((product, index) => <article key={product.id} className={`price-card ${product.highlight ? "highlight" : ""}`} style={{ animationDelay: `${index * 35}ms` }}><div className="flex min-h-[112px] flex-col justify-between"><div><span className="eyebrow text-[#e3b77b]/70">{product.category}</span><h3 className="mt-2 text-xl font-bold leading-tight text-[#fff8ec] sm:text-2xl">{product.name}</h3></div><div className="mt-5 flex items-end justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#d9e0e7]/60">por {product.unit}</span><span className="display-price">{money(product.price)}</span></div></div></article>)}
          {!visible.length && <div className="col-span-full py-20 text-center text-[#d9e0e7]/70">Nenhum produto encontrado para esta busca.</div>}
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-[#f9f0dd]/12 pt-5 text-xs uppercase tracking-[0.14em] text-[#d9e0e7]/55 sm:flex-row sm:items-center sm:justify-between"><span>Esquina da Carne · Aracaju/SE</span><span className="flex items-center gap-2"><span className="live-dot" /> preços sujeitos à disponibilidade</span><span className="flex items-center gap-2"><button disabled={pageCount <= 1} onClick={() => setPage((p) => Math.max(0, p - 1))} className="page-button"><ChevronLeft /></button><strong className="text-[#f9f0dd]">{(page % pageCount) + 1} / {pageCount}</strong><button disabled={pageCount <= 1} onClick={() => setPage((p) => p + 1)} className="page-button"><ChevronRight /></button></span></footer>
      </main>

      <Sheet open={maintenanceOpen} onOpenChange={setMaintenanceOpen}><SheetContent className="w-full overflow-y-auto border-l border-[#e3b77b]/20 bg-[#f8f0e1] text-[#162b49] sm:max-w-xl"><SheetHeader className="border-b border-[#162b49]/10 pb-5"><SheetTitle className="display-title text-3xl">Manutenção do balcão</SheetTitle><SheetDescription className="text-[#162b49]/65">Edite nomes, categorias e preços. As alterações ficam salvas neste dispositivo.</SheetDescription></SheetHeader><div className="space-y-5 py-5"><div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-[#162b49]/40" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto" className="border-[#162b49]/15 bg-white pl-9" /></div><Button onClick={addProduct} variant="outline" className="h-10 border-[#162b49]/20 bg-transparent font-bold"><Plus className="mr-2 size-4" /> Novo produto</Button></div><div className="rounded-md bg-[#162b49]/5 p-4"><div className="flex items-center justify-between"><div><Label className="font-bold">Modo TV automático</Label><p className="mt-1 text-xs text-[#162b49]/60">Alterna as páginas de preços a cada 9 segundos.</p></div><Switch checked={tvMode} onCheckedChange={setTvMode} /></div></div><div className="space-y-3">{products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => <div key={product.id} className="edit-row"><div className="grid flex-1 gap-2 sm:grid-cols-[1.6fr_.7fr_.7fr]"><Input value={product.name} onChange={(e) => updateProduct(product.id, { name: e.target.value })} className="border-[#162b49]/15 bg-white font-semibold" /><Input type="number" step="0.01" value={product.price} onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })} className="border-[#162b49]/15 bg-white" /><select value={product.unit} onChange={(e) => updateProduct(product.id, { unit: e.target.value })} className="h-10 rounded-md border border-[#162b49]/15 bg-white px-3 text-sm"><option value="kg">kg</option><option value="und">und</option></select></div><button onClick={() => removeProduct(product.id)} className="delete-button" aria-label={`Excluir ${product.name}`}><Trash2 className="size-4" /></button></div>)}</div></div><div className="mt-auto border-t border-[#162b49]/10 pt-5"><Button onClick={saveAndClose} className="w-full bg-[#d94a3d] font-bold text-white hover:bg-[#b83a30]">Salvar alterações</Button></div></SheetContent></Sheet>
    </div>
  );
}
