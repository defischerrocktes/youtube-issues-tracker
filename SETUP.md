# 🚀 Setup Guide - YouTube Issues Tracker auf GitHub deployen

Diese Anleitung zeigt dir, wie du den YouTube Issues Tracker auf GitHub einrichtest.

## 📋 Voraussetzungen

- GitHub Account
- Git installiert
- Node.js 18+ installiert

## 🔧 Schritt 1: GitHub Repository erstellen

### 1.1 Neues Repository auf GitHub erstellen

1. Gehe zu: https://github.com/new
2. **Repository Name:** `youtube-issues-tracker`
3. **Description:** `Automated tracker for YouTube platform issues`
4. **Visibility:** Public (empfohlen, damit GitHub Actions kostenlos ist)
5. **NICHT** initialisieren mit README, .gitignore oder License (haben wir bereits)
6. Klicke auf "Create repository"

### 1.2 Lokales Repository mit GitHub verbinden

```bash
cd /home/user/youtube-issues-tracker

# Remote hinzufügen (ersetze USERNAME mit deinem GitHub-Username)
git remote add origin https://github.com/defischerrocktes/youtube-issues-tracker.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Ersten Push
git push -u origin main
```

## 🔧 Schritt 2: GitHub Actions aktivieren

### 2.1 Workflow-Permissions setzen

1. Gehe zu deinem Repository auf GitHub
2. Settings → Actions → General
3. Scroll runter zu "Workflow permissions"
4. Wähle: **"Read and write permissions"**
5. Aktiviere: **"Allow GitHub Actions to create and approve pull requests"**
6. Speichern

### 2.2 GitHub Actions aktivieren

1. Gehe zum "Actions" Tab in deinem Repository
2. Falls eine Warnung erscheint, klicke "I understand my workflows, go ahead and enable them"
3. Der Workflow "Update YouTube Issues" sollte jetzt sichtbar sein

### 2.3 Ersten Workflow manuell starten

1. Actions Tab → "Update YouTube Issues"
2. Klicke "Run workflow" → "Run workflow"
3. Warte ~30-60 Sekunden
4. Das Workflow sollte grün werden ✅
5. Gehe zurück zum Code Tab
6. Die Datei `YOUTUBE_ISSUES.md` sollte jetzt aktualisiert sein!

## 🔧 Schritt 3: Code lokal testen

```bash
cd /home/user/youtube-issues-tracker

# Dependencies installieren
npm install

# Test-Run (Development - readable code)
npm run dev

# Ergebnis anschauen
cat YOUTUBE_ISSUES.md
```

**Erwartetes Ergebnis:**
- `YOUTUBE_ISSUES.md` wurde generiert
- Issues von 3 Quellen wurden gefunden
- `cache/issues-cache.json` wurde erstellt

## 🔧 Schritt 4: Obfuscation testen

```bash
# Obfuscated Version bauen
npm run build

# Dist Ordner sollte jetzt existieren
ls -la dist/

# Obfuscated Version testen
npm start
```

**Was passiert:**
- Code in `src/` wird obfusciert
- Obfuscated Code landet in `dist/`
- `npm start` führt die obfuscated Version aus

## 📊 Schritt 5: README anpassen (Optional)

Passe das README an deine Bedürfnisse an:

```bash
# README bearbeiten
nano README.md

# Oder mit einem Editor deiner Wahl
code README.md
```

**Wichtige Anpassungen:**
- [ ] Eigene Beschreibung hinzufügen
- [ ] Screenshots hinzufügen (optional)
- [ ] Roadmap anpassen
- [ ] Kontaktdaten aktualisieren

## 🔧 Schritt 6: Update-Frequenz ändern (Optional)

Die Standard-Frequenz ist **alle 6 Stunden**.

Um das zu ändern, editiere `.github/workflows/update-issues.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Ändere diese Zeile
```

**Beispiele:**
- Stündlich: `'0 * * * *'`
- Alle 12 Stunden: `'0 */12 * * *'`
- Täglich um Mitternacht: `'0 0 * * *'`
- Alle 3 Stunden: `'0 */3 * * *'`

Nach der Änderung:
```bash
git add .github/workflows/update-issues.yml
git commit -m "Change update frequency"
git push
```

## 🎯 Schritt 7: Badge zum README hinzufügen (Optional)

Füge einen Status-Badge hinzu, der zeigt ob der Workflow läuft:

```markdown
# YouTube Known Issues Tracker

![Update Status](https://github.com/defischerrocktes/youtube-issues-tracker/actions/workflows/update-issues.yml/badge.svg)
```

## 🔍 Schritt 8: Verifikation

### 8.1 Prüfen ob alles funktioniert

✅ **Checklist:**
- [ ] Repository ist auf GitHub sichtbar
- [ ] `YOUTUBE_ISSUES.md` ist im Repository
- [ ] GitHub Actions Workflow läuft erfolgreich
- [ ] Workflow updated die Datei automatisch
- [ ] Obfuscation funktioniert lokal (`npm run build`)

### 8.2 GitHub Actions Logs prüfen

1. Actions Tab → "Update YouTube Issues"
2. Klicke auf den letzten Run
3. Klicke auf "update" Job
4. Prüfe die Logs:

```
📡 Fetching from YouTube Community...
   Found X issues
📡 Fetching from Creator Insider...
   Found X updates
📡 Fetching from Google Issue Tracker...
   Found X issues
✅ Issues written to YOUTUBE_ISSUES.md
```

## 🐛 Troubleshooting

### Problem: Workflow committed nicht

**Lösung:** Workflow Permissions prüfen
- Settings → Actions → General
- "Read and write permissions" muss aktiviert sein

### Problem: npm install schlägt fehl

**Lösung:** Node.js Version prüfen
- Workflow verwendet Node.js 20
- Lokal solltest du auch Node.js 18+ verwenden

### Problem: "No issues found"

**Mögliche Ursachen:**
1. YouTube hat die Seitenstruktur geändert
2. Crawling wurde geblockt (Rate Limiting)
3. Netzwerk-Timeout

**Lösung:**
- Warte ein paar Stunden und versuche es erneut
- Prüfe die Logs auf spezifische Fehler
- Passe die Crawler-Logik in `src/crawler.js` an falls nötig

### Problem: Build schlägt fehl

**Fehler:** `Cannot find module 'javascript-obfuscator'`

**Lösung:**
```bash
npm install javascript-obfuscator --save-dev
```

### Problem: Git Push schlägt fehl

**Fehler:** `Authentication failed`

**Lösung 1 - HTTPS mit Token:**
```bash
# Personal Access Token erstellen
# GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# Scope: repo (alle)

git remote set-url origin https://YOUR_TOKEN@github.com/defischerrocktes/youtube-issues-tracker.git
```

**Lösung 2 - SSH:**
```bash
# SSH Key zu GitHub hinzufügen
# Dann Remote ändern:
git remote set-url origin git@github.com:defischerrocktes/youtube-issues-tracker.git
```

## 🔒 Sicherheit & Code-Schutz

### Warum Obfuscation?

Die Crawler-Logik ist obfuscated um:
- ✅ Crawling-Strategien zu schützen
- ✅ Schwieriger zu blocken
- ✅ Geistiges Eigentum zu schützen

### Was ist obfuscated?

- **Obfuscated:** `dist/` Ordner (Production)
- **Readable:** `src/` Ordner (Development, nur lokal)

**Wichtig:** Nur `dist/` wird im Workflow verwendet!

### dist/ Ordner gitignored?

Nein! Der `dist/` Ordner **muss** im Git sein, weil GitHub Actions ihn braucht.

Aber: `.gitattributes` markiert `dist/*` als binary, sodass keine Diffs angezeigt werden.

## 📊 Monitoring

### GitHub Insights nutzen

1. Insights Tab → Traffic
   - Sieh wer dein Repo besucht
   - Clone/Fork statistiken

2. Insights Tab → Community
   - Sieh wie viele Sterne/Forks du hast

### Issues tracken

Aktiviere Issues im Repository:
1. Settings → Features
2. Aktiviere "Issues"

Dann können User Bugs/Features vorschlagen.

## 🎉 Fertig!

Dein YouTube Issues Tracker läuft jetzt automatisch!

**Was passiert jetzt:**
- Alle 6 Stunden crawlt GitHub Actions die Issues
- `YOUTUBE_ISSUES.md` wird automatisch updated
- Commits erscheinen automatisch im Repository

**Nächste Schritte:**
- [ ] Repository mit anderen teilen
- [ ] README mit Screenshots erweitern
- [ ] Zusätzliche Datenquellen hinzufügen
- [ ] Discord/Slack Integration (Roadmap)

---

**Support:**
- Issues: https://github.com/defischerrocktes/youtube-issues-tracker/issues
- Website: https://defischerrocktes.de

**Viel Erfolg! 🚀**
