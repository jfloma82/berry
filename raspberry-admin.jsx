import { useState } from "react";

/* ── Design tokens ─────────────────────────────────────────── */
const T = {
  bg: "#0F1117",
  surface: "#181C27",
  card: "#1E2333",
  border: "#2A2F42",
  text: "#E8EAF0",
  muted: "#6B7294",
  accent: "#C0392B",
  accentGlow: "rgba(192,57,43,0.18)",
  green: "#27AE60",
  greenBg: "rgba(39,174,96,0.12)",
  yellow: "#F39C12",
  yellowBg: "rgba(243,156,18,0.12)",
  blue: "#2980B9",
  blueBg: "rgba(41,128,185,0.12)",
};

const ADMIN_PW = "1234";

/* ── Sample data ───────────────────────────────────────────── */
const initOrders = [
  { id: "ORD-2401", customer: "김민준", product: "프리미엄 산딸기 1kg", amount: "28,000", date: "2025-02-22", status: "배송중" },
  { id: "ORD-2400", customer: "이서연", product: "산딸기 선물세트", amount: "52,000", date: "2025-02-21", status: "상품준비" },
  { id: "ORD-2399", customer: "박지호", product: "산딸기 잼 세트", amount: "36,000", date: "2025-02-20", status: "배송완료" },
  { id: "ORD-2398", customer: "최하은", product: "프리미엄 산딸기 1kg", amount: "28,000", date: "2025-02-19", status: "주문접수" },
  { id: "ORD-2397", customer: "정도윤", product: "산딸기 선물세트", amount: "52,000", date: "2025-02-18", status: "배송완료" },
];

const initProducts = [
  { id: 1, name: "프리미엄 산딸기", weight: "1kg", price: 28000, stock: 42, active: true },
  { id: 2, name: "산딸기 선물세트", weight: "500g × 2", price: 52000, stock: 18, active: true },
  { id: 3, name: "산딸기 잼 세트", weight: "250g × 3", price: 36000, stock: 7, active: true },
];

const initAS = [
  { id: 1, name: "김**", order: "ORD-2385", category: "파손/불량", date: "2025-02-15", status: "처리완료", reply: "교환 처리 완료하였습니다." },
  { id: 2, name: "이**", order: "ORD-2391", category: "오배송", date: "2025-02-20", status: "처리중", reply: "" },
  { id: 3, name: "박**", order: "ORD-2398", category: "신선도 불량", date: "2025-02-23", status: "접수완료", reply: "" },
];

/* ── Helpers ───────────────────────────────────────────────── */
const statusColor = (s) => {
  const map = {
    "배송완료": { c: T.green, bg: T.greenBg },
    "처리완료": { c: T.green, bg: T.greenBg },
    "배송중": { c: T.blue, bg: T.blueBg },
    "처리중": { c: T.blue, bg: T.blueBg },
    "상품준비": { c: T.yellow, bg: T.yellowBg },
    "주문접수": { c: T.yellow, bg: T.yellowBg },
    "접수완료": { c: T.yellow, bg: T.yellowBg },
  };
  return map[s] || { c: T.muted, bg: "rgba(107,114,148,0.12)" };
};

function Badge({ status }) {
  const { c, bg } = statusColor(status);
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: c, background: bg, letterSpacing: 0.4 }}>
      {status}
    </span>
  );
}

function StatCard({ icon, label, value, sub, glowColor }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: glowColor || T.accentGlow, opacity: 0.5 }} />
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: T.text, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: T.accent }}>{sub}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", small }) {
  const styles = {
    primary: { bg: T.accent, color: "#fff" },
    ghost: { bg: "transparent", color: T.muted, border: `1px solid ${T.border}` },
    success: { bg: T.green, color: "#fff" },
    danger: { bg: "#922B21", color: "#fff" },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} style={{
      background: s.bg, color: s.color, border: s.border || "none",
      padding: small ? "6px 14px" : "10px 20px",
      borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 500,
      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
      transition: "opacity 0.15s", whiteSpace: "nowrap",
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 11, color: T.muted, marginBottom: 6, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
    </div>
  );
}

/* ── Pages ─────────────────────────────────────────────────── */

function Dashboard({ orders, products, asList }) {
  const totalRevenue = orders.reduce((s, o) => s + parseInt(o.amount.replace(",", "")), 0);
  const pending = orders.filter(o => o.status !== "배송완료").length;
  const asOpen = asList.filter(a => a.status !== "처리완료").length;
  const lowStock = products.filter(p => p.stock < 10).length;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: T.text }}>대시보드</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 32 }}>오늘도 좋은 하루 되세요 🍓</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        <StatCard icon="💰" label="총 매출" value={`₩${(totalRevenue / 10000).toFixed(0)}만`} sub="전체 주문 합산" glowColor="rgba(192,57,43,0.2)" />
        <StatCard icon="📦" label="진행 중 주문" value={pending} sub="배송완료 제외" glowColor="rgba(41,128,185,0.2)" />
        <StatCard icon="🔧" label="미처리 AS" value={asOpen} sub={asOpen > 0 ? "빠른 처리 필요" : "모두 처리됨"} glowColor="rgba(243,156,18,0.2)" />
        <StatCard icon="⚠️" label="재고 부족" value={lowStock} sub="10개 미만 상품" glowColor="rgba(192,57,43,0.2)" />
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: T.text }}>최근 주문</span>
          <span style={{ fontSize: 12, color: T.muted }}>{orders.length}건</span>
        </div>
        {orders.slice(0, 4).map((o, i) => (
          <div key={o.id} style={{
            display: "flex", alignItems: "center", padding: "14px 24px",
            borderBottom: i < 3 ? `1px solid ${T.border}` : "none", gap: 16,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🍓</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{o.customer} — {o.product}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{o.id} · {o.date}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginRight: 16 }}>₩{o.amount}</div>
            <Badge status={o.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderManager({ orders, setOrders }) {
  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const statuses = ["주문접수", "상품준비", "배송중", "배송완료"];

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: T.text }}>주문 관리</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 32 }}>전체 주문 {orders.length}건</p>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px 80px 1fr 90px 110px 80px", padding: "12px 20px", background: T.surface, borderBottom: `1px solid ${T.border}`, fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: 1 }}>
          <span>주문번호</span><span>고객명</span><span>상품</span><span>금액</span><span>상태</span><span>관리</span>
        </div>
        {orders.map((o) => (
          <div key={o.id}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 80px 1fr 90px 110px 80px", padding: "16px 20px", borderBottom: `1px solid ${T.border}`, alignItems: "center", fontSize: 13 }}>
              <span style={{ color: T.muted, fontSize: 11 }}>{o.id}</span>
              <span style={{ color: T.text, fontWeight: 500 }}>{o.customer}</span>
              <span style={{ color: T.muted, fontSize: 12 }}>{o.product}</span>
              <span style={{ color: T.text, fontWeight: 600 }}>₩{o.amount}</span>
              <Badge status={o.status} />
              <Btn small onClick={() => { setEditing(o.id); setNewStatus(o.status); }} variant="ghost">변경</Btn>
            </div>
            {editing === o.id && (
              <div style={{ padding: "14px 20px", background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                  style={{ padding: "8px 12px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, outline: "none", fontFamily: "'DM Sans'" }}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <Btn small onClick={() => { setOrders(p => p.map(x => x.id === o.id ? { ...x, status: newStatus } : x)); setEditing(null); }} variant="success">저장</Btn>
                <Btn small onClick={() => setEditing(null)} variant="ghost">취소</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryManager({ orders, setOrders }) {
  const steps = ["주문접수", "상품준비", "배송중", "배송완료"];
  const progressVal = (status) => ((steps.indexOf(status) + 1) / steps.length) * 100;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: T.text }}>배송 관리</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 32 }}>진행 중 {orders.filter(o => o.status !== "배송완료").length}건 · 완료 {orders.filter(o => o.status === "배송완료").length}건</p>

      <div style={{ display: "grid", gap: 14 }}>
        {orders.map(o => (
          <div key={o.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <span style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{o.customer}</span>
                <span style={{ color: T.muted, fontSize: 12, marginLeft: 10 }}>{o.id} · {o.product}</span>
              </div>
              <Badge status={o.status} />
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 4, marginBottom: 8 }}>
              <div style={{ height: "100%", width: `${progressVal(o.status)}%`, background: o.status === "배송완료" ? T.green : T.accent, borderRadius: 4, transition: "width 0.6s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              {steps.map(s => (
                <span key={s} style={{ fontSize: 10, color: steps.indexOf(s) <= steps.indexOf(o.status) ? T.text : T.muted, fontWeight: steps.indexOf(s) <= steps.indexOf(o.status) ? 600 : 400 }}>{s}</span>
              ))}
            </div>
            {o.status !== "배송완료" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {steps.slice(steps.indexOf(o.status) + 1).map(next => (
                  <Btn key={next} small onClick={() => setOrders(p => p.map(x => x.id === o.id ? { ...x, status: next } : x))}>
                    → {next}
                  </Btn>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ASManager({ asList, setASList }) {
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReply = (id) => {
    setASList(p => p.map(a => a.id === id ? { ...a, reply: replyText, status: "처리완료" } : a));
    setReplying(null);
    setReplyText("");
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: T.text }}>AS 신고 관리</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 32 }}>전체 {asList.length}건 · 미처리 {asList.filter(a => a.status !== "처리완료").length}건</p>

      <div style={{ display: "grid", gap: 16 }}>
        {asList.map(a => (
          <div key={a.id} style={{ background: T.card, border: `1px solid ${a.status !== "처리완료" ? T.accent + "60" : T.border}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <span style={{ fontWeight: 600, color: T.text, marginRight: 10 }}>🔒 {a.name}</span>
                  <span style={{ fontSize: 12, color: T.muted }}>{a.order} · {a.category} · {a.date}</span>
                </div>
                <Badge status={a.status} />
              </div>
              {a.reply && (
                <div style={{ background: T.greenBg, border: `1px solid rgba(39,174,96,0.25)`, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginBottom: 4 }}>관리자 답변</div>
                  <div style={{ fontSize: 13, color: T.text }}>{a.reply}</div>
                </div>
              )}
              {a.status !== "처리완료" && (
                <Btn small onClick={() => { setReplying(a.id); setReplyText(""); }}>답변 & 처리완료</Btn>
              )}
            </div>
            {replying === a.id && (
              <div style={{ padding: "16px 24px", background: T.surface, borderTop: `1px solid ${T.border}` }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                  placeholder="고객에게 보낼 답변을 입력해 주세요..."
                  style={{ width: "100%", padding: "10px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13, outline: "none", fontFamily: "'DM Sans'", resize: "none", marginBottom: 12 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small onClick={() => handleReply(a.id)} variant="success">처리완료 저장</Btn>
                  <Btn small onClick={() => setReplying(null)} variant="ghost">취소</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductManager({ products, setProducts }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", weight: "", price: "", stock: "", active: true });

  const openEdit = (p) => { setForm({ name: p.name, weight: p.weight, price: String(p.price), stock: String(p.stock), active: p.active }); setModal(p.id); };
  const openAdd = () => { setForm({ name: "", weight: "", price: "", stock: "", active: true }); setModal("add"); };

  const handleSave = () => {
    if (!form.name) return;
    if (modal === "add") {
      setProducts(p => [...p, { id: Date.now(), name: form.name, weight: form.weight, price: parseInt(form.price) || 0, stock: parseInt(form.stock) || 0, active: form.active }]);
    } else {
      setProducts(p => p.map(x => x.id === modal ? { ...x, ...form, price: parseInt(form.price) || 0, stock: parseInt(form.stock) || 0 } : x));
    }
    setModal(null);
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 6, color: T.text }}>상품 관리</h2>
          <p style={{ color: T.muted, fontSize: 13 }}>총 {products.length}개 상품</p>
        </div>
        <Btn onClick={openAdd}>+ 상품 추가</Btn>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🍓</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: T.text }}>{p.name}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{p.weight}</span>
                {!p.active && <span style={{ fontSize: 10, color: T.accent, background: T.accentGlow, padding: "2px 8px", borderRadius: 10 }}>비활성</span>}
              </div>
              <div style={{ fontSize: 13, color: T.muted }}>
                ₩{p.price.toLocaleString()} · 재고
                <span style={{ color: p.stock < 10 ? T.accent : T.green, fontWeight: 600, marginLeft: 4 }}>{p.stock}개</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small onClick={() => openEdit(p)} variant="ghost">수정</Btn>
              <Btn small onClick={() => setProducts(p2 => p2.filter(x => x.id !== p.id))} variant="danger">삭제</Btn>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 36, width: "100%", maxWidth: 460, animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text }}>{modal === "add" ? "상품 추가" : "상품 수정"}</h3>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.muted }}>×</button>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              <Input label="상품명" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder="프리미엄 산딸기" />
              <Input label="용량/규격" value={form.weight} onChange={e => setForm(v => ({ ...v, weight: e.target.value }))} placeholder="1kg" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="가격 (원)" value={form.price} onChange={e => setForm(v => ({ ...v, price: e.target.value }))} placeholder="28000" />
                <Input label="재고 수량" value={form.stock} onChange={e => setForm(v => ({ ...v, stock: e.target.value }))} placeholder="50" />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(v => ({ ...v, active: e.target.checked }))} />
                <span style={{ fontSize: 13, color: T.muted }}>판매 활성화</span>
              </label>
              <Btn onClick={handleSave} variant="success">{modal === "add" ? "상품 추가" : "저장하기"}</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Login ─────────────────────────────────────────────────── */
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PW) { onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: 360, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🍓</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8 }}>관리자 로그인</h1>
          <p style={{ color: T.muted, fontSize: 14 }}>산딸기농장 어드민 패널</p>
        </div>
        <div style={{ background: T.card, border: `1px solid ${err ? T.accent : T.border}`, borderRadius: 20, padding: 36, transition: "border-color 0.2s" }}>
          <label style={{ display: "block", fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 700, letterSpacing: 1 }}>비밀번호</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="관리자 비밀번호 입력"
            style={{ width: "100%", padding: "12px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontSize: 15, outline: "none", fontFamily: "'DM Sans'", marginBottom: 16 }} />
          {err && <p style={{ color: T.accent, fontSize: 12, marginBottom: 16, textAlign: "center" }}>비밀번호가 올바르지 않습니다</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: T.accent, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            로그인
          </button>
          <p style={{ color: T.muted, fontSize: 11, textAlign: "center", marginTop: 16 }}>테스트 비밀번호: 1234</p>
        </div>
      </div>
    </div>
  );
}

/* ── App ───────────────────────────────────────────────────── */
const navItems = [
  { key: "dashboard", label: "대시보드", icon: "📊" },
  { key: "orders", label: "주문 관리", icon: "📦" },
  { key: "delivery", label: "배송 관리", icon: "🚚" },
  { key: "as", label: "AS 관리", icon: "🔧" },
  { key: "products", label: "상품 관리", icon: "🍓" },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState(initOrders);
  const [products, setProducts] = useState(initProducts);
  const [asList, setASList] = useState(initAS);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const pageMap = {
    dashboard: <Dashboard orders={orders} products={products} asList={asList} />,
    orders: <OrderManager orders={orders} setOrders={setOrders} />,
    delivery: <DeliveryManager orders={orders} setOrders={setOrders} />,
    as: <ASManager asList={asList} setASList={setASList} />,
    products: <ProductManager products={products} setProducts={setProducts} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; font-family: 'DM Sans', sans-serif; color: ${T.text}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", position: "fixed", height: "100vh" }}>
          <div style={{ padding: "28px 20px 24px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>🍓</span>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: T.text }}>산딸기농장</div>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}>ADMIN PANEL</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "16px 12px" }}>
            {navItems.map(n => (
              <button key={n.key} onClick={() => setPage(n.key)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: page === n.key ? T.accentGlow : "transparent",
                color: page === n.key ? T.text : T.muted,
                fontSize: 13, fontWeight: page === n.key ? 600 : 400,
                marginBottom: 4, fontFamily: "'DM Sans'", textAlign: "left",
                transition: "all 0.15s",
                borderLeft: page === n.key ? `2px solid ${T.accent}` : "2px solid transparent",
              }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 12px", borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => setLoggedIn(false)} style={{
              width: "100%", padding: "10px 12px", borderRadius: 10, border: "none",
              background: "transparent", color: T.muted, fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans'", textAlign: "left", display: "flex", gap: 10, alignItems: "center",
            }}>
              <span>🚪</span> 로그아웃
            </button>
          </div>
        </aside>
        <main style={{ marginLeft: 220, flex: 1, padding: "40px 36px", minHeight: "100vh" }}>
          {pageMap[page]}
        </main>
      </div>
    </>
  );
}
