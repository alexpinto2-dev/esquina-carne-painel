/*
 * Direção visual: placa de preços limpa para TV.
 * A tela pública exibe somente produtos, valores e contato. A manutenção
 * permanece contextual e acessível apenas pelo ícone no cabeçalho.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { fromPriceCents, toPriceCents } from "@shared/price-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Search, Settings2, Trash2 } from "lucide-react";

type Product = { id: number; name: string; price: number; unit: string };
const whatsapp = "5579999592625";

const initialProducts: Product[] = [
  { id: 1, name: "Bife Temperado", price: 52.9, unit: "kg" }, { id: 2, name: "Almôndegas", price: 35.9, unit: "kg" }, { id: 3, name: "Mocotó", price: 12.99, unit: "kg" }, { id: 4, name: "Carne Moída", price: 21.99, unit: "kg" }, { id: 5, name: "Galinha de capoeira", price: 38.99, unit: "kg" }, { id: 6, name: "Coração de Frango Temperado", price: 56.99, unit: "kg" }, { id: 7, name: "Coração Frango", price: 54.99, unit: "kg" }, { id: 8, name: "Peito Frango c/ osso", price: 18, unit: "kg" }, { id: 9, name: "Filé de Peito de Frango", price: 24.99, unit: "kg" }, { id: 10, name: "Filé Frango Temperado", price: 29.9, unit: "kg" }, { id: 11, name: "Chambaril", price: 26.9, unit: "kg" },
  { id: 12, name: "Coxa e Sobrecoxa", price: 12.99, unit: "kg" }, { id: 13, name: "Sobrecoxa", price: 17.9, unit: "kg" }, { id: 14, name: "Sobrecoxa Temperada", price: 20.99, unit: "kg" }, { id: 15, name: "Coxinha da Asa", price: 22.9, unit: "kg" }, { id: 16, name: "Coxinha da Asa Temperada", price: 25.99, unit: "kg" }, { id: 17, name: "Frango Inteiro", price: 16.99, unit: "kg" }, { id: 18, name: "Frango de postura", price: 21.9, unit: "kg" }, { id: 19, name: "Codorna", price: 42.99, unit: "kg" }, { id: 20, name: "Salsicha", price: 14.99, unit: "kg" }, { id: 21, name: "Kit Feijoada", price: 29.99, unit: "kg" }, { id: 22, name: "Pé de Porco", price: 19.9, unit: "kg" },
  { id: 23, name: "Carne de Hambúrguer", price: 35.9, unit: "kg" }, { id: 24, name: "Hambúrguer patinho", price: 50.9, unit: "kg" }, { id: 25, name: "Hambúrguer fraldinha", price: 50.9, unit: "kg" }, { id: 26, name: "Hambúrguer frango", price: 34.9, unit: "kg" }, { id: 27, name: "Hambúrguer suíno", price: 45.9, unit: "kg" }, { id: 28, name: "Miolo Alcatra", price: 57.99, unit: "kg" }, { id: 29, name: "Alcatra", price: 51.99, unit: "kg" }, { id: 30, name: "Contra Filé", price: 49.9, unit: "kg" }, { id: 31, name: "Bife Ancho", price: 50.99, unit: "kg" }, { id: 32, name: "Lagarto", price: 48.9, unit: "kg" }, { id: 33, name: "Patinho", price: 47, unit: "kg" }, { id: 34, name: "Coxão Mole/ Chã de dentro", price: 43.99, unit: "kg" }, { id: 35, name: "Coxão Duro/ Chã de fora", price: 40.9, unit: "kg" }, { id: 36, name: "Prime Rib", price: 49.9, unit: "kg" }, { id: 37, name: "Maminha", price: 51.9, unit: "kg" }, { id: 38, name: "Filé Mignon Completo", price: 82.9, unit: "kg" }, { id: 39, name: "Filé Lâmina", price: 94.99, unit: "kg" }, { id: 40, name: "Picanha Nacional Fresca", price: 82.9, unit: "kg" }, { id: 41, name: "Picanha Suína", price: 43.99, unit: "kg" }, { id: 42, name: "Cupim Nacional", price: 46.9, unit: "kg" }, { id: 43, name: "Picanha Cordeiro", price: 106, unit: "kg" }, { id: 44, name: "Fraldinha", price: 48.9, unit: "kg" }, { id: 45, name: "Carne de sol de 1ª", price: 44.9, unit: "kg" },
  { id: 46, name: "Cupim Grill", price: 64.9, unit: "kg" }, { id: 47, name: "Acém c/ osso", price: 26.49, unit: "kg" }, { id: 48, name: "Acém s/ osso", price: 35.9, unit: "kg" }, { id: 49, name: "Miolo Acém", price: 41.9, unit: "kg" }, { id: 50, name: "Palheta c/ osso", price: 26.49, unit: "kg" }, { id: 51, name: "Palheta s/ osso", price: 36.9, unit: "kg" }, { id: 52, name: "Miolo palheta", price: 41.9, unit: "kg" }, { id: 53, name: "Músculo s/ osso", price: 33.9, unit: "kg" }, { id: 54, name: "Peito Bovino s/ osso", price: 35.9, unit: "kg" }, { id: 55, name: "Costela Moída", price: 35.9, unit: "kg" }, { id: 56, name: "Peito Bovino c/ osso", price: 22.99, unit: "kg" }, { id: 57, name: "Costela Bovina c/ osso", price: 23.99, unit: "kg" }, { id: 58, name: "Capa de filé", price: 43.9, unit: "kg" }, { id: 59, name: "Rabada Bovina", price: 41.9, unit: "kg" }, { id: 60, name: "Coração de Boi", price: 19.9, unit: "kg" }, { id: 61, name: "Língua de Boi", price: 19.9, unit: "kg" }, { id: 62, name: "Passarinha Bovina", price: 14.99, unit: "kg" }, { id: 63, name: "Rins Bovino", price: 17.89, unit: "kg" }, { id: 64, name: "Tripa Bovina", price: 22.99, unit: "kg" }, { id: 65, name: "Fígado bovino", price: 22.99, unit: "kg" }, { id: 66, name: "Bucho bovino", price: 22, unit: "kg" }, { id: 67, name: "Tripa Suína", price: 37.9, unit: "kg" },
  { id: 68, name: "Charque de 1ª", price: 68.99, unit: "kg" }, { id: 69, name: "Charque de 2ª", price: 63.99, unit: "kg" }, { id: 70, name: "Charque Cupim", price: 64.99, unit: "kg" }, { id: 71, name: "Bacon", price: 37.9, unit: "kg" }, { id: 72, name: "Bacon fatiado", price: 59, unit: "kg" }, { id: 73, name: "Linguiça Caseira", price: 34.99, unit: "kg" }, { id: 74, name: "Linguiça Paio", price: 42.9, unit: "kg" }, { id: 75, name: "Calabresa Josefina", price: 30.99, unit: "kg" }, { id: 76, name: "Calabresa Reta", price: 32.99, unit: "kg" }, { id: 77, name: "Calabresa Sadia", price: 26.99, unit: "kg" }, { id: 78, name: "Toscana de frango", price: 28.99, unit: "kg" }, { id: 79, name: "Costela suína fresca", price: 27.99, unit: "kg" }, { id: 80, name: "Costela suína salgada", price: 24.99, unit: "kg" }, { id: 81, name: "Costela suína resfriada", price: 35.99, unit: "kg" }, { id: 82, name: "Filé Suíno", price: 35.9, unit: "kg" }, { id: 83, name: "Lombo Suíno", price: 35.9, unit: "kg" }, { id: 84, name: "Pernil de Bode", price: 44.9, unit: "kg" }, { id: 85, name: "Pernil de Carneiro", price: 44.9, unit: "kg" }, { id: 86, name: "Costela de Carneiro", price: 40.9, unit: "kg" }, { id: 87, name: "Dianteiro Carneiro", price: 40.9, unit: "kg" }, { id: 88, name: "Sarapatel de Carneiro", price: 33.99, unit: "kg" }, { id: 89, name: "Amarradinho de Carneiro", price: 8.5, unit: "und" }, { id: 90, name: "Carneiro desossado", price: 82.99, unit: "kg" }, { id: 91, name: "Queijo coalho", price: 34.99, unit: "kg" }, { id: 92, name: "Queijo pré cozido", price: 42.9, unit: "kg" }, { id: 93, name: "Manteiga", price: 42.9, unit: "kg" }, { id: 94, name: "Requeijão", price: 42.9, unit: "kg" }, { id: 95, name: "Castanha", price: 79.99, unit: "kg" },
];

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const pricesQuery = trpc.prices.list.useQuery(undefined, { refetchInterval: 5000, refetchOnWindowFocus: true });
  const replacePrices = trpc.prices.replaceAll.useMutation();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const seededRef = useRef(false);

  useEffect(() => {
    if (pricesQuery.data && pricesQuery.data.length > 0) {
      setProducts(pricesQuery.data.map((item) => ({ id: item.id, name: item.name, price: fromPriceCents(item.priceCents), unit: item.unit })));
    } else if (pricesQuery.data && pricesQuery.data.length === 0 && !seededRef.current) {
      seededRef.current = true;
      replacePrices.mutate({ items: initialProducts.map((item, position) => ({ name: item.name, priceCents: toPriceCents(item.price), unit: item.unit, position })) });
    }
  }, [pricesQuery.data]);
  const [search, setSearch] = useState("");
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const filtered = useMemo(() => products.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page % pageCount) * pageSize, (page % pageCount) * pageSize + pageSize);

  useEffect(() => { const timer = window.setInterval(() => setPage((current) => (current + 1) % pageCount), 12000); return () => window.clearInterval(timer); }, [pageCount]);
  useEffect(() => { if (page >= pageCount) setPage(0); }, [page, pageCount]);

  const updateProduct = (id: number, patch: Partial<Product>) => setProducts((list) => list.map((item) => item.id === id ? { ...item, ...patch } : item));
  const addProduct = () => setProducts((list) => [...list, { id: Date.now(), name: "Novo produto", price: 0, unit: "kg" }]);
  const removeProduct = (id: number) => setProducts((list) => list.filter((item) => item.id !== id));
  const savePrices = async () => {
    await replacePrices.mutateAsync({ items: products.map((item, position) => ({ name: item.name, priceCents: toPriceCents(item.price), unit: item.unit, position })) });
    await pricesQuery.refetch();
    setMaintenanceOpen(false);
    toast.success("Preços sincronizados em todos os dispositivos");
  };

  return <div className="min-h-screen bg-[#101b2d] text-[#f9f0dd]">
    <header className="site-header"><div className="header-inner"><div className="logo-lockup"><img src="/manus-storage/logoesquina_6c4420b9.jpg" alt="Esquina da Carne" /><div><span>ESQUINA DA CARNE</span><small>Aracaju · Sergipe</small></div></div><div className="header-actions"><div className="qr-wrap"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(`https://wa.me/${whatsapp}`)}`} alt="QR Code para pedidos no WhatsApp" /><span>Aponte a câmera<br />e peça pelo WhatsApp</span></div><button className="maintenance-icon" title="Manutenção dos preços" aria-label="Manutenção dos preços" onClick={() => setMaintenanceOpen(true)}><Settings2 className="size-5" /></button></div></div></header>
    <main className="price-board"><div className="board-heading"><div><p className="eyebrow">Tabela de preços</p><h1>Preços do balcão</h1></div><span className="updated-note">Atualizado agora</span></div><section className="price-grid" aria-live="polite">{visible.map((product) => <article className="simple-price-row" key={product.id}><h2>{product.name}</h2><div className="row-rule" /><strong>{money(product.price)}</strong><span>/{product.unit}</span></article>)}</section><footer className="board-footer"><span>Esquina da Carne · Aracaju/SE</span><div className="pager"><button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft /></button><b>{(page % pageCount) + 1} / {pageCount}</b><button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}><ChevronRight /></button></div></footer></main>
    <Sheet open={maintenanceOpen} onOpenChange={setMaintenanceOpen}><SheetContent className="w-full overflow-y-auto border-l border-[#b8b8b0]/20 bg-[#f0efe9] text-[#17191c] sm:max-w-xl"><SheetHeader className="border-b border-[#17191c]/10 pb-5"><SheetTitle className="display-title text-3xl">Manutenção dos preços</SheetTitle><SheetDescription className="text-[#17191c]/65">Edite os valores exibidos no painel. As alterações ficam salvas neste dispositivo.</SheetDescription></SheetHeader><div className="space-y-5 py-5"><div className="flex gap-2"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto" className="border-[#17191c]/15 bg-white" /><Button onClick={addProduct} variant="outline" className="border-[#17191c]/20 bg-transparent font-bold"><Plus className="mr-2 size-4" /> Novo</Button></div><div className="space-y-3">{products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => <div key={product.id} className="edit-row"><div className="grid flex-1 gap-2 sm:grid-cols-[1.6fr_.7fr_.55fr]"><Input value={product.name} onChange={(e) => updateProduct(product.id, { name: e.target.value })} className="border-[#17191c]/15 bg-white font-semibold" /><Input type="number" step="0.01" value={product.price} onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })} className="border-[#17191c]/15 bg-white" /><select value={product.unit} onChange={(e) => updateProduct(product.id, { unit: e.target.value })} className="h-10 rounded-md border border-[#17191c]/15 bg-white px-2 text-sm"><option value="kg">kg</option><option value="und">und</option></select></div><button onClick={() => removeProduct(product.id)} className="delete-button" aria-label={`Excluir ${product.name}`}><Trash2 className="size-4" /></button></div>)}</div></div><Button onClick={savePrices} disabled={replacePrices.isPending} className="mt-auto w-full bg-[#d94a3d] font-bold text-white hover:bg-[#b83a30]">{replacePrices.isPending ? "Sincronizando..." : "Salvar e sincronizar"}</Button></SheetContent></Sheet>
  </div>;
}
