# 📊 Dokumentasi Sistem & Diagram Arsitektur — Sahabat Dengar

Dokumen ini berisi seluruh diagram sistem perancangan aplikasi **Sahabat Dengar**.

---

## 1. Use Case Diagram
```mermaid
graph TB
  subgraph Actors
    UA[👤 User Anonim]
    UL[👤 User Login]
    AD[👑 Admin]
  end

  subgraph System [Sahabat Dengar System]
    UC1[Chat dengan AI]
    UC2[Lihat token tersisa]
    UC3[Akhiri sesi & lihat ringkasan]
    UC4[Login / Register]
    UC5[Tambah token]
    UC6[Simpan riwayat chat]
    UC7[Lihat riwayat chat]
    UC8[Dashboard admin]
    UC9[Lihat gejala user]
    UC10[Lihat semua sesi aktif]
    UC11[Kelola user]
  end

  UA --> UC1
  UA --> UC2
  UA --> UC3
  UA --> UC4

  UL --> UC1
  UL --> UC2
  UL --> UC3
  UL --> UC5
  UL --> UC6
  UL --> UC7

  AD --> UC8
  AD --> UC9
  AD --> UC10
  AD --> UC11

  UC5 -.requires.-> UC4
  UC6 -.requires.-> UC4
  UC7 -.requires.-> UC4
```

---

## 2. Activity Diagram — Alur Chat Utama
```mermaid
flowchart TD
  A([Mulai]) --> B{Pilih Mode}
  B -->|Anonim| C[Generate session_id sementara]
  B -->|Login| D[Verifikasi JWT Token]
  
  C --> E[Tampilkan UI Chat + Token Counter]
  D --> E

  E --> F[User kirim pesan]
  F --> G{Cek token tersisa}
  
  G -->|Token habis & Anonim| H[Tampilkan modal: Silakan Login]
  G -->|Token cukup| I[Kurangi token counter]
  
  H --> D
  I --> J[Kirim pesan ke backend]
  J --> K[Backend proxy ke LLM API]
  K --> L[Terima respons LLM]
  
  L --> M{Is Anonim?}
  M -->|Ya| N[Simpan di state/sessionStorage saja]
  M -->|Tidak| O[Simpan message ke DB]
  
  N --> P[Tampilkan respons di UI]
  O --> P
  
  P --> Q{User klik Akhiri Sesi?}
  Q -->|Tidak| F
  Q -->|Ya| R[Trigger analisis gejala - backend]
  
  R --> S[LLM ekstrak gejala & ringkasan]
  S --> T{Is Anonim?}
  
  T -->|Ya| U[Tampilkan ringkasan saja, tidak disimpan]
  T -->|Tidak| V[Simpan ke session_summaries di DB]
  
  V --> W[Tampilkan ringkasan ke user]
  U --> W
  W --> X([Selesai])
```

---

## 3. Sequence Diagram — Kirim Pesan Chat
```mermaid
sequenceDiagram
  actor U as User
  participant FE as Frontend
  participant BE as Backend (Express)
  participant DB as PostgreSQL
  participant LLM as LLM API (External)

  U->>FE: Ketik pesan & klik Kirim
  FE->>FE: Cek token counter (local state)
  
  alt Token habis & anonim
    FE-->>U: Tampilkan modal Login
  else Token cukup
    FE->>BE: POST /api/chat/message {content, session_id}
    BE->>BE: Validasi JWT / session_id anonim
    BE->>BE: Cek & kurangi token di DB (jika login)
    BE->>LLM: POST dengan system prompt + chat history
    LLM-->>BE: Respons AI
    
    alt User Login
      BE->>DB: INSERT messages (user + assistant)
    end
    
    BE-->>FE: { reply: "...", token_remaining: N }
    FE-->>U: Tampilkan respons AI di chat bubble
  end
```

---

## 4. Sequence Diagram — Akhiri Sesi & Ekstraksi Gejala
```mermaid
sequenceDiagram
  actor U as User
  participant FE as Frontend
  participant BE as Backend (Express)
  participant DB as PostgreSQL
  participant LLM as LLM API (External)

  U->>FE: Klik "Akhiri Sesi"
  FE->>FE: Tampilkan konfirmasi dialog
  U->>FE: Konfirmasi
  
  FE->>BE: POST /api/session/end {session_id, chat_history}
  BE->>LLM: POST dengan extraction prompt + chat_history
  LLM-->>BE: JSON { gejala, risk_level, ringkasan, ... }
  
  BE->>LLM: POST dengan summary prompt + chat_history
  LLM-->>BE: Teks ringkasan untuk user
  
  alt User Login
    BE->>DB: UPDATE sessions SET ended_at, is_active=false
    BE->>DB: INSERT session_summaries (full analysis)
  end
  
  BE-->>FE: { user_summary: "...", risk_level: "..." }
  FE-->>U: Tampilkan modal ringkasan sesi
```

---

## 5. Diagram Arsitektur Sistem
```mermaid
graph TB
  subgraph Client [Client Layer]
    BR[Browser / Mobile]
  end

  subgraph Frontend [Frontend Layer]
    FE[Frontend App\nHTML+CSS+JS Vanilla]
  end

  subgraph Backend [Backend Layer - Express.js]
    direction TB
    AUTH[Auth Routes\n/api/auth]
    CHAT[Chat Routes\n/api/chat]
    SESS[Session Routes\n/api/session]
    ADM[Admin Routes\n/api/admin]
    
    MW1[JWT Middleware]
    MW2[Token Limiter Middleware]
    
    SVC1[LLM Service]
    SVC2[Analysis Service]
  end

  subgraph Data [Data Layer]
    DB[(PostgreSQL\npgAdmin - Dev)]
    SUPABASE[(Supabase\n- Prod)]
  end

  subgraph External [External Services]
    LLM[LLM API\nOpenAI / Gemini / etc\nvia .env]
  end

  BR <--> FE
  FE <--> AUTH
  FE <--> CHAT
  FE <--> SESS
  FE <--> ADM

  AUTH --> MW1
  CHAT --> MW1
  CHAT --> MW2
  SESS --> MW1
  ADM --> MW1

  MW1 --> SVC1
  MW2 --> SVC1
  SVC1 --> LLM
  SVC1 --> SVC2

  AUTH --> DB
  CHAT --> DB
  SESS --> DB
  ADM --> DB

  DB -.prod.-> SUPABASE
```
