# 🍎 Apple Dev MCP Server - Aktivasyon Rehberi

Bu rehber, MCP sunucusunu farklı istemcilerle nasıl kullanacağınızı adım adım açıklar.

---

## 📋 Ön Gereksinimler

1. **Node.js 18+** yüklü olmalı
2. Proje build edilmiş olmalı (`npm run build`)

---

## 🖥️ Claude Desktop ile Kullanım

### Adım 1: Konfigürasyon Dosyasını Aç

```bash
# macOS
open ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Dosya yoksa oluştur
mkdir -p ~/Library/Application\ Support/Claude
touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Adım 2: MCP Sunucusunu Ekle

`claude_desktop_config.json` dosyasına ekleyin:

```json
{
  "mcpServers": {
    "apple-dev": {
      "command": "node",
      "args": ["/Users/erdincyilmaz/Desktop/apple-dev-mcp-server/dist/index.js"]
    }
  }
}
```

### Adım 3: Claude Desktop'ı Yeniden Başlat

Claude Desktop'ı tamamen kapatıp tekrar açın.

### Adım 4: Doğrulama

Claude ile konuşurken şunları sorabilirsiniz:
- "SwiftUI NavigationStack dokümantasyonunu getir"
- "Bu Xcode hatasını analiz et: cannot find type 'MyClass' in scope"
- "nonisolated(unsafe) Swift 5.10'da kullanılabilir mi?"

---

## 💻 VS Code + GitHub Copilot ile Kullanım

### Adım 1: VS Code Settings'i Aç

`Cmd + ,` ile ayarları açın veya `.vscode/settings.json` düzenleyin.

### Adım 2: MCP Sunucusunu Ekle

```json
{
  "github.copilot.chat.mcpServers": {
    "apple-dev": {
      "command": "node",
      "args": ["/Users/erdincyilmaz/Desktop/apple-dev-mcp-server/dist/index.js"]
    }
  }
}
```

### Adım 3: VS Code'u Yeniden Yükle

`Cmd + Shift + P` → "Developer: Reload Window"

---

## 🛠️ Manuel Test

Sunucuyu terminalde test edebilirsiniz:

```bash
cd ~/Desktop/apple-dev-mcp-server
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

---

## 🔧 Araç Kullanım Örnekleri

### 1. fetch_latest_apple_docs

**Açıklama:** Apple Developer Documentation'dan güncel bilgileri çeker.

**Örnek Sorgular:**
- "NavigationStack için Apple dokümanlarını getir"
- "SwiftData @Model macro'su nasıl kullanılır?"
- "RealityKit visionOS örnekleri"

**Parametreler:**
| Parametre | Zorunlu | Açıklama |
|-----------|---------|----------|
| query | ✅ | Aranacak API/framework adı |
| framework | ❌ | Belirli bir framework ile sınırla |
| includeExamples | ❌ | Kod örnekleri dahil edilsin mi (varsayılan: true) |

---

### 2. xcode_diagnostic_analyzer

**Açıklama:** Xcode build hatalarını analiz eder ve çözüm önerir.

**Örnek Sorgular:**
- "Bu hatayı analiz et: cannot find type 'MyView' in scope"
- "Linker error: Undefined symbols for architecture arm64"
- "Actor isolation error ne anlama geliyor?"

**Parametreler:**
| Parametre | Zorunlu | Açıklama |
|-----------|---------|----------|
| buildLog | ✅ | Xcode build log veya hata mesajı |
| errorCode | ❌ | Spesifik hata kodu |
| context | ❌ | Ek bağlam (Swift versiyonu, platform) |

**Desteklenen Hata Türleri:**
- Type/Symbol Not Found
- Type Mismatch
- Protocol Conformance Errors
- Actor Isolation Errors
- Sendable Errors
- Linker Errors
- Mutability Errors
- ve daha fazlası...

---

### 3. swift_evolution_check

**Açıklama:** Swift Evolution proposal'larını kontrol eder.

**Örnek Sorgular:**
- "nonisolated(unsafe) hangi Swift versiyonunda geldi?"
- "typed throws Swift 6'da mı?"
- "Parameter packs nasıl kullanılır?"
- "@Observable macro'su ne zaman eklendi?"

**Parametreler:**
| Parametre | Zorunlu | Açıklama |
|-----------|---------|----------|
| feature | ✅ | Kontrol edilecek özellik adı |
| swiftVersion | ❌ | Hedef Swift versiyonu |

**Desteklenen Özellikler:**
- `@Observable` (SE-0395, Swift 5.9)
- `nonisolated(unsafe)` (SE-0412, Swift 5.10)
- Typed throws (SE-0413, Swift 6.0)
- Parameter packs (SE-0393, Swift 5.9)
- Noncopyable types (SE-0390, Swift 5.9)
- if/switch expressions (SE-0380, Swift 5.9)
- Macros (SE-0382, SE-0389, Swift 5.9)
- Actor isolation (SE-0414, SE-0420, SE-0423, Swift 6.0)

---

## ⚠️ Önemli Notlar

1. **Gerçek Xcode Entegrasyonu:** Bu sunucu, varsayımsal "Xcode 26.3 Agentic Coding" değil, gerçek MCP protokolü kullanır. Xcode ile doğrudan entegrasyon **henüz mevcut değildir**.

2. **API Limitleri:** Apple Developer Documentation API'si bazen yavaş yanıt verebilir veya rate limit uygulayabilir.

3. **Offline Kullanım:** Swift Evolution checker offline çalışır (local database). Documentation fetcher internet gerektirir.

---

## 🔄 Güncellemeler

Sunucuyu güncellemek için:

```bash
cd ~/Desktop/apple-dev-mcp-server
git pull  # Eğer git repo ise
npm install
npm run build
```

Ardından Claude Desktop/VS Code'u yeniden başlatın.

---

## 🐛 Sorun Giderme

### Sunucu Başlamıyor
```bash
# Node versiyonunu kontrol et
node --version  # >= 18 olmalı

# Build'i tekrar yap
npm run build
```

### Claude'da Görünmüyor
1. Konfigürasyon dosyasındaki path'in doğru olduğundan emin olun
2. JSON syntax'ını kontrol edin (trailing comma yok mu?)
3. Claude Desktop'ı tamamen kapatıp açın

### Araçlar Çalışmıyor
```bash
# Log'ları kontrol et
cd ~/Desktop/apple-dev-mcp-server
node dist/index.js 2>&1
```

---

## 📁 Proje Yapısı

```
apple-dev-mcp-server/
├── src/
│   ├── index.ts                          # Ana sunucu
│   └── tools/
│       ├── fetch-apple-docs.ts           # Doküman aracı
│       ├── xcode-diagnostic-analyzer.ts  # Hata analiz aracı
│       └── swift-evolution-check.ts      # Swift Evolution aracı
├── dist/                                  # Derlenmiş JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

---

**Hazırlayan:** GitHub Copilot  
**Tarih:** Şubat 2026
