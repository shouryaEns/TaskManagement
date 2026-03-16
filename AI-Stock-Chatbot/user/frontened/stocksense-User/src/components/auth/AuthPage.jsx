import { useState } from "react";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "", mobile_number: "", username: "", password: "", confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Login failed");
      onLogin?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (registerForm.password !== registerForm.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!/^\d{10}$/.test(registerForm.mobile_number)) {
      return setError("Enter a valid 10-digit mobile number");
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerForm.email,
          mobile_number: registerForm.mobile_number,
          username: registerForm.username,
          password: registerForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || "Registration failed");
      setSuccess("Account created! Please sign in.");
      setMode("login");
      setLoginForm({ email: registerForm.email, password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: focusedField === field ? "rgba(0,200,150,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focusedField === field ? "rgba(0,200,150,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10,
    padding: "12px 14px 12px 42px",
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  });

  const Field = ({ icon, label, type = "text", value, onChange, name, placeholder, extra }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", marginBottom: 6,
        fontSize: 11, fontFamily: "monospace",
        color: "#556", letterSpacing: 1, textTransform: "uppercase",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 13, top: "50%",
          transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none",
        }}>{icon}</span>
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          autoComplete="off"
          style={inputStyle(name)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none",
              color: "#445", cursor: "pointer", fontSize: 14, padding: 0,
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
        {extra}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080a10",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      fontFamily: "'Space Grotesk', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,200,150,0.06) 0%, transparent 70%)",
        top: -100, left: -100, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,163,255,0.05) 0%, transparent 70%)",
        bottom: -80, right: -80, pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #00c896, #00a3ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 900, color: "#000",
            margin: "0 auto 14px",
            boxShadow: "0 8px 32px rgba(0,200,150,0.3)",
          }}>S</div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontSize: 22,
            fontWeight: 700, color: "#fff", letterSpacing: 2,
          }}>
            STOCK<span style={{ color: "#00c896" }}>SENSE</span>
          </div>
          <div style={{ fontSize: 12, color: "#445", marginTop: 4, fontFamily: "monospace" }}>
            Indian Market Intelligence Platform
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Top accent */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #00c896, #00a3ff, transparent)" }} />

          {/* Tab switcher */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["login", "register"].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                style={{
                  padding: "16px",
                  background: mode === m ? "rgba(0,200,150,0.08)" : "transparent",
                  border: "none",
                  borderBottom: mode === m ? "2px solid #00c896" : "2px solid transparent",
                  color: mode === m ? "#00c896" : "#445",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  textTransform: "capitalize", letterSpacing: 0.5,
                }}
              >
                {m === "login" ? "🔑 Sign In" : "✨ Register"}
              </button>
            ))}
          </div>

          <div style={{ padding: "28px 28px 24px" }}>

            {/* Error / Success */}
            {error && (
              <div style={{
                background: "rgba(255,77,109,0.1)",
                border: "1px solid rgba(255,77,109,0.3)",
                borderRadius: 10, padding: "10px 14px",
                marginBottom: 20, fontSize: 13,
                color: "#ff4d6d", fontFamily: "monospace",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "rgba(0,200,150,0.1)",
                border: "1px solid rgba(0,200,150,0.3)",
                borderRadius: 10, padding: "10px 14px",
                marginBottom: 20, fontSize: 13,
                color: "#00c896", fontFamily: "monospace",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                ✅ {success}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin}>
                <Field
                  icon="📧" label="Email Address" type="email" name="email"
                  value={loginForm.email} placeholder="you@example.com"
                  onChange={v => setLoginForm(f => ({ ...f, email: v }))}
                />
                <Field
                  icon="🔒" label="Password" type="password" name="password"
                  value={loginForm.password} placeholder="Enter your password"
                  onChange={v => setLoginForm(f => ({ ...f, password: v }))}
                />

                <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
                  <button type="button" style={{
                    background: "none", border: "none",
                    color: "#00c896", fontSize: 12,
                    cursor: "pointer", fontFamily: "monospace",
                  }}>
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !loginForm.email || !loginForm.password}
                  style={{
                    width: "100%", padding: "13px",
                    background: loading || !loginForm.email || !loginForm.password
                      ? "rgba(255,255,255,0.05)"
                      : "linear-gradient(135deg, #00c896, #00a3ff)",
                    border: "none", borderRadius: 10,
                    color: loading || !loginForm.email || !loginForm.password ? "#445" : "#000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14, fontWeight: 700,
                    cursor: loading || !loginForm.email || !loginForm.password ? "default" : "pointer",
                    transition: "all 0.2s",
                    letterSpacing: 0.5,
                  }}
                >
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === "register" && (
              <form onSubmit={handleRegister}>
                <Field
                  icon="👤" label="Username" name="username"
                  value={registerForm.username} placeholder="Choose a username"
                  onChange={v => setRegisterForm(f => ({ ...f, username: v }))}
                />
                <Field
                  icon="📧" label="Email Address" type="email" name="reg_email"
                  value={registerForm.email} placeholder="you@example.com"
                  onChange={v => setRegisterForm(f => ({ ...f, email: v }))}
                />
                <Field
                  icon="📱" label="Mobile Number" name="mobile"
                  value={registerForm.mobile_number} placeholder="10-digit mobile number"
                  onChange={v => setRegisterForm(f => ({ ...f, mobile_number: v.replace(/\D/g, "").slice(0, 10) }))}
                />
                <Field
                  icon="🔒" label="Password" type="password" name="reg_password"
                  value={registerForm.password} placeholder="Create a strong password"
                  onChange={v => setRegisterForm(f => ({ ...f, password: v }))}
                />
                <Field
                  icon="🔒" label="Confirm Password" type="password" name="confirm_password"
                  value={registerForm.confirmPassword} placeholder="Repeat your password"
                  onChange={v => setRegisterForm(f => ({ ...f, confirmPassword: v }))}
                />

                {/* Password strength */}
                {registerForm.password && (
                  <div style={{ marginTop: -10, marginBottom: 16 }}>
                    {(() => {
                      const p = registerForm.password;
                      const strength = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^a-zA-Z0-9]/.test(p)].filter(Boolean).length;
                      const labels = ["", "Weak", "Fair", "Good", "Strong"];
                      const colors = ["", "#ff4d6d", "#ffaa00", "#00a3ff", "#00c896"];
                      return (
                        <div>
                          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                            {[1,2,3,4].map(i => (
                              <div key={i} style={{
                                flex: 1, height: 3, borderRadius: 2,
                                background: i <= strength ? colors[strength] : "rgba(255,255,255,0.08)",
                                transition: "background 0.3s",
                              }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 10, color: colors[strength], fontFamily: "monospace", textAlign: "right" }}>
                            {labels[strength]}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !registerForm.email || !registerForm.password || !registerForm.username || !registerForm.mobile_number}
                  style={{
                    width: "100%", padding: "13px",
                    background: loading || !registerForm.email || !registerForm.password || !registerForm.username || !registerForm.mobile_number
                      ? "rgba(255,255,255,0.05)"
                      : "linear-gradient(135deg, #00c896, #00a3ff)",
                    border: "none", borderRadius: 10,
                    color: loading || !registerForm.email || !registerForm.password || !registerForm.username || !registerForm.mobile_number ? "#445" : "#000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s",
                    letterSpacing: 0.5,
                  }}
                >
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
              </form>
            )}

            {/* Footer */}
            <div style={{
              marginTop: 20, textAlign: "center",
              fontSize: 12, color: "#334", fontFamily: "monospace",
            }}>
              {mode === "login"
                ? <>Don't have an account?{" "}
                    <button onClick={() => setMode("register")} style={{ background: "none", border: "none", color: "#00c896", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>Register here</button>
                  </>
                : <>Already have an account?{" "}
                    <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "#00c896", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>Sign in</button>
                  </>
              }
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#223", fontFamily: "monospace" }}>
          🔒 Secured · NSE & BSE data · Real-time insights
        </div>
      </div>

      <style>{`
        input::placeholder { color: #334; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}