import { useState } from "react";

const theme = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  border: "#E8E4E0",
  text: "#1A1714",
  muted: "#7A736C",
  accent: "#C0392B",
  accentLight: "#F9ECEA",
  accentDark: "#9B2D23",
};

const style = {
  injectFonts: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${theme.bg}; font-family: 'DM Sans', sans-serif; color: ${theme.text}; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  `,
};

const tabs = ["홈", "주문하기", "배송현황", "AS신고"];

const orders = [
  { id: "ORD-2401", product: "프리미엄 산딸기 1kg", date: "2025-02-18", status: "배송중", progress: 65 },
  { id: "ORD-2398", product: "산딸기 잼 세트", date: "2025-02-12", status: "배송완료", progress: 100 },
  { id: "ORD-2385", product: "산딸기 500g × 2", date: "2025-02-05", status: "배송완료", progress: 100 },
];

const products = [
  { id: 1, name: "프리미엄 산딸기", weight: "1kg", price: "28,000", desc: "강원도 고지대 직수확, 당일 냉장 출고", tag: "BEST" },
  { id: 2, name: "산딸기 선물세트", weight: "500g × 2", price: "52,000", desc: "예쁜 선물 박스 포함, 당일 냉장 출고", tag: "GIFT" },
  { id: 3, name: "산딸기 잼 세트", weight: "250g × 3", price: "36,000", desc: "직접 만든 수제 잼, 무방부제", tag: "NEW" },
];

// ─── Components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    "배송중": { color: theme.accent, bg: theme.accentLight },
    "배송완료": { color: "#2D7A4F", bg: "#EAF4EE" },
    "처리중": { color: "#7A5C2D", bg: "#F5EFE0" },
  };
  const s = map[status] || { color: theme.muted, bg: theme.border };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 500, color: s.color, background: s.bg,
    }}>{status}</span>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ height: 4, background: theme.border, borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
      <div style={{
        height: "100%", width: `${value}%`, background: value === 100 ? "#2D7A4F" : theme.accent,
        borderRadius: 4, transition: "width 0.8s ease",
      }} />
    </div>
  );
}

function Tag({ label }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: 1.2,
      color: theme.accent, border: `1px solid ${theme.accent}`,
      padding: "2px 7px", borderRadius: 3,
    }}>{label}</span>
  );
}

// ─── Pages ──────────────────────────────────────────────────────────────────

function HomePage({ setTab }) {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      {/* Hero */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, #1A0A08 0%, #3D1410 60%, #5C1E18 100%)`,
        borderRadius: 20, padding: "64px 48px", marginBottom: 40,
        minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        {/* decorative circles */}
        {[220, 140, 80].map((s, i) => (
          <div key={i} style={{
            position: "absolute", top: -s * 0.3, right: -s * 0.3,
            width: s, height: s, borderRadius: "50%",
            background: `rgba(192,57,43,${0.08 + i * 0.05})`,
            border: `1px solid rgba(192,57,43,0.15)`,
          }} />
        ))}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13, letterSpacing: 3, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "'DM Sans'" }}>
            PREMIUM RASPBERRY
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300,
            color: "#FFFFFF", lineHeight: 1.1, marginBottom: 20,
          }}>
            자연이 담긴<br />
            <span style={{ color: "#E87B6B", fontStyle: "italic" }}>산딸기</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
            강원도 고지대에서 정성껏 재배한 산딸기를 직접 배송합니다.
            신선함이 다를 때까지 당일 수확, 당일 출고.
          </p>
          <button onClick={() => setTab("주문하기")} style={{
            background: theme.accent, color: "#fff", border: "none",
            padding: "14px 32px", borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: "pointer", letterSpacing: 0.5, transition: "background 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = theme.accentDark}
            onMouseLeave={e => e.target.style.background = theme.accent}
          >
            지금 주문하기 →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        {[
          { icon: "📦", label: "주문하기", sub: "신선한 산딸기 주문", tab: "주문하기" },
          { icon: "🚚", label: "배송현황", sub: "내 주문 배송 확인", tab: "배송현황" },
          { icon: "🔧", label: "AS신고", sub: "불만족 시 접수", tab: "AS신고" },
        ].map(item => (
          <button key={item.label} onClick={() => setTab(item.tab)} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: "24px 20px", cursor: "pointer",
            textAlign: "left", transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: theme.muted }}>{item.sub}</div>
          </button>
        ))}
      </div>

      {/* Feature strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden",
      }}>
        {[
          { icon: "🌿", text: "무농약 재배" },
          { icon: "❄️", text: "당일 냉장 출고" },
          { icon: "📬", text: "전국 배송" },
          { icon: "💯", text: "신선도 보장" },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "20px 16px", textAlign: "center",
            borderRight: i < 3 ? `1px solid ${theme.border}` : "none",
            background: theme.surface,
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 12, color: theme.muted, fontWeight: 500 }}>{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderPage() {
  const [cart, setCart] = useState({});
  const [ordered, setOrdered] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", memo: "" });

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(p => p.id === Number(id));
    return sum + (p ? parseInt(p.price.replace(",", "")) * qty : 0);
  }, 0);

  if (ordered) return (
    <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeUp 0.5s ease" }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🍓</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 32, fontWeight: 400, marginBottom: 12 }}>주문이 완료되었습니다</h2>
      <p style={{ color: theme.muted, fontSize: 15 }}>곧 배송 준비를 시작합니다. 감사합니다!</p>
      <button onClick={() => { setOrdered(false); setCart({}); setForm({ name: "", phone: "", address: "", memo: "" }); }}
        style={{ marginTop: 32, background: theme.text, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
        계속 쇼핑하기
      </button>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>주문하기</h2>
      <p style={{ color: theme.muted, fontSize: 14, marginBottom: 32 }}>신선한 산딸기를 선택해 주세요</p>

      <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
        {products.map(p => (
          <div key={p.id} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: "24px", display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${theme.accentLight}, #F0D9D7)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
            }}>🍓</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <Tag label={p.tag} />
              </div>
              <div style={{ fontSize: 12, color: theme.muted, marginBottom: 6 }}>{p.weight} · {p.desc}</div>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 500 }}>₩{p.price}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setCart(c => ({ ...c, [p.id]: Math.max(0, (c[p.id] || 0) - 1) }))}
                style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${theme.border}`, background: "#fff", cursor: "pointer", fontSize: 18, color: theme.muted }}>−</button>
              <span style={{ fontWeight: 600, minWidth: 20, textAlign: "center" }}>{cart[p.id] || 0}</span>
              <button onClick={() => setCart(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }))}
                style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: theme.accent, cursor: "pointer", fontSize: 18, color: "#fff" }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Order form */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 500, marginBottom: 20, fontSize: 16 }}>배송 정보</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "이름", key: "name", placeholder: "홍길동" },
            { label: "연락처", key: "phone", placeholder: "010-0000-0000" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500, letterSpacing: 0.5 }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" }} />
            </div>
          ))}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500, letterSpacing: 0.5 }}>배송주소</label>
            <input value={form.address} onChange={e => setForm(v => ({ ...v, address: e.target.value }))}
              placeholder="서울시 강남구 테헤란로 123"
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" }} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500, letterSpacing: 0.5 }}>배송 메모</label>
            <input value={form.memo} onChange={e => setForm(v => ({ ...v, memo: e.target.value }))}
              placeholder="문 앞에 두세요 (선택)"
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" }} />
          </div>
        </div>
      </div>

      {/* Total & Order */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: theme.muted, fontSize: 14 }}>총 결제금액</span>
          <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 600 }}>
            ₩{total.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => { if (total > 0 && form.name && form.address) setOrdered(true); }}
          style={{
            width: "100%", padding: "16px", background: total > 0 ? theme.accent : theme.border,
            color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500,
            cursor: total > 0 ? "pointer" : "not-allowed", transition: "background 0.2s",
          }}>
          {total > 0 ? "주문 완료하기" : "상품을 선택해 주세요"}
        </button>
      </div>
    </div>
  );
}

function DeliveryPage() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>배송현황</h2>
      <p style={{ color: theme.muted, fontSize: 14, marginBottom: 32 }}>최근 주문 내역을 확인하세요</p>

      <div style={{ display: "grid", gap: 16 }}>
        {orders.map(o => (
          <div key={o.id} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: "24px", transition: "box-shadow 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{o.product}</div>
                <div style={{ fontSize: 12, color: theme.muted }}>주문번호 {o.id} · {o.date}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <ProgressBar value={o.progress} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: theme.muted }}>
              <span>주문접수</span><span>상품준비</span><span>배송중</span><span>배송완료</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ASPage() {
  const [step, setStep] = useState("list"); // list | write | done
  const [pw, setPw] = useState("");
  const [enteredPw, setEnteredPw] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState({ name: "", order: "", category: "", content: "", pw: "" });
  const [posts, setPosts] = useState([
    { id: 1, name: "김**", order: "ORD-2385", category: "파손", date: "2025-02-08", status: "처리중" },
  ]);

  const handleSubmit = () => {
    if (form.name && form.content && form.pw) {
      setPosts(p => [{ id: Date.now(), name: form.name, order: form.order, category: form.category, date: "2025-02-25", status: "접수완료" }, ...p]);
      setStep("done");
    }
  };

  if (step === "done") return (
    <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeUp 0.5s ease" }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 32, fontWeight: 400, marginBottom: 12 }}>AS 접수 완료</h2>
      <p style={{ color: theme.muted, fontSize: 15 }}>빠른 시일 내에 처리해 드리겠습니다.</p>
      <button onClick={() => setStep("list")} style={{ marginTop: 32, background: theme.text, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>목록으로</button>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>AS 신고 게시판</h2>
          <p style={{ color: theme.muted, fontSize: 14 }}>비밀 게시판 — 개인정보는 안전하게 보호됩니다</p>
        </div>
        <button onClick={() => setStep("write")} style={{
          background: theme.accent, color: "#fff", border: "none",
          padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>+ 신고하기</button>
      </div>

      {/* Post list */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 24 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px 100px",
          padding: "12px 24px", background: theme.bg, borderBottom: `1px solid ${theme.border}`,
          fontSize: 11, fontWeight: 600, color: theme.muted, letterSpacing: 0.8,
        }}>
          <span>신고자</span><span>주문번호</span><span>유형</span><span>접수일</span><span>처리상태</span>
        </div>
        {posts.map(p => (
          <div key={p.id} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px 100px",
            padding: "16px 24px", borderBottom: `1px solid ${theme.border}`,
            fontSize: 14, alignItems: "center",
          }}>
            <span style={{ fontWeight: 500 }}>🔒 {p.name}</span>
            <span style={{ color: theme.muted, fontSize: 13 }}>{p.order}</span>
            <span style={{ fontSize: 13 }}>{p.category}</span>
            <span style={{ fontSize: 12, color: theme.muted }}>{p.date}</span>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>

      {/* Write form */}
      {step === "write" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
        }}>
          <div style={{
            background: theme.surface, borderRadius: 20, padding: 36, width: "100%", maxWidth: 520,
            animation: "fadeUp 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond'", fontSize: 24, fontWeight: 400 }}>AS 신고 접수</h3>
              <button onClick={() => setStep("list")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: theme.muted }}>×</button>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { label: "이름", key: "name", placeholder: "홍길동" },
                { label: "주문번호", key: "order", placeholder: "ORD-XXXX" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500 }}>AS 유형</label>
                <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'", background: "#fff" }}>
                  <option value="">선택해 주세요</option>
                  <option>파손/불량</option><option>오배송</option><option>신선도 불량</option><option>기타</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500 }}>내용</label>
                <textarea value={form.content} onChange={e => setForm(v => ({ ...v, content: e.target.value }))}
                  rows={4} placeholder="불편하셨던 점을 상세히 작성해 주세요"
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'", resize: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: theme.muted, marginBottom: 6, fontWeight: 500 }}>비밀번호 (게시글 확인용)</label>
                <input type="password" value={form.pw} onChange={e => setForm(v => ({ ...v, pw: e.target.value }))}
                  placeholder="숫자 4자리"
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "'DM Sans'" }} />
              </div>
              <button onClick={handleSubmit} style={{
                width: "100%", padding: "14px", background: theme.accent, color: "#fff",
                border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: "pointer",
              }}>접수하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("홈");

  const pageMap = {
    "홈": <HomePage setTab={setActiveTab} />,
    "주문하기": <OrderPage />,
    "배송현황": <DeliveryPage />,
    "AS신고": <ASPage />,
  };

  return (
    <>
      <style>{style.injectFonts}</style>
      <div style={{ minHeight: "100vh", background: theme.bg, padding: "0 0 80px" }}>
        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(250,250,248,0.92)", backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border}`, padding: "0 24px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", height: 60, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🍓</span>
              <span style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 500, letterSpacing: 0.5 }}>산딸기농장</span>
            </div>
            <nav style={{ display: "flex", gap: 4 }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  background: activeTab === t ? theme.accentLight : "none",
                  color: activeTab === t ? theme.accent : theme.muted,
                  border: "none", padding: "6px 14px", borderRadius: 20,
                  fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
                  cursor: "pointer", transition: "all 0.2s",
                }}>{t}</button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
          {pageMap[activeTab]}
        </main>
      </div>
    </>
  );
}
