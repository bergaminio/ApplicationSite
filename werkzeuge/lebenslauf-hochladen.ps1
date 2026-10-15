# Schickt die lokale lebenslauf.json auf den Server.
#
#   .\werkzeuge\lebenslauf-hochladen.ps1
#
# Wofuer das gut ist: die Lebenslauf-Angaben liegen als Datei auf dem
# Server und nicht im Quelltext, weil das Repository oeffentlich ist.
# Aendern kann man sie im Admin-Bereich der Website. Wenn die Datei
# dort aber noch leer ist oder Platzhalter enthaelt, ist es schneller,
# die fertige Datei von hier aus hinaufzuschicken, als dreissig Felder
# von Hand abzutippen.
#
# Das Passwort wird verdeckt eingegeben und nirgends gespeichert.

param(
    [string]$Api = "https://api.bergamin.ch",
    [string]$Datei = "$PSScriptRoot\..\lebenslauf.json"
)

if (-not (Test-Path $Datei)) {
    Write-Host "Datei nicht gefunden: $Datei" -ForegroundColor Red
    exit 1
}

# Erst pruefen, ob das ueberhaupt gueltiges JSON ist. Der Server wuerde
# es auch abweisen, aber dann hat man schon das Passwort eingetippt.
try {
    $inhalt = Get-Content $Datei -Raw -Encoding UTF8
    $null = $inhalt | ConvertFrom-Json
} catch {
    Write-Host "Die Datei ist kein gueltiges JSON: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Ziel: $Api"
Write-Host "Datei: $Datei"
Write-Host ""

$benutzer = Read-Host "Anmeldename"
$geheim   = Read-Host "Passwort" -AsSecureString

# SecureString in Klartext, nur fuer den einen Aufruf. PowerShell 5.1
# kennt ConvertFrom-SecureString -AsPlainText noch nicht.
$zeiger = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($geheim)
try {
    $passwort = [Runtime.InteropServices.Marshal]::PtrToStringAuto($zeiger)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($zeiger)
}

# ---- Anmelden ----
$anmeldung = @{ username = $benutzer; password = $passwort } | ConvertTo-Json -Compress
try {
    $antwort = Invoke-RestMethod -Uri "$Api/api/auth/login" -Method Post `
        -ContentType "application/json" `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($anmeldung))
} catch {
    $code = $null
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    if ($code -eq 401) {
        Write-Host "Anmeldung abgelehnt (401): Name oder Passwort stimmt nicht." -ForegroundColor Red
        Write-Host "Der Server sagt absichtlich nicht, welches von beidem." -ForegroundColor Yellow
    } elseif ($code) {
        Write-Host "Anmeldung fehlgeschlagen, HTTP $code" -ForegroundColor Red
    } else {
        Write-Host "Server nicht erreichbar: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
}
$passwort = $null
$token = $antwort.token
Write-Host "Angemeldet als $($antwort.displayName) [$($antwort.role)]" -ForegroundColor Green

if ($antwort.role -ne "ADMIN") {
    Write-Host "Dieses Konto darf den Lebenslauf nicht aendern." -ForegroundColor Red
    exit 1
}

# ---- Hochschicken ----
# Als Bytes und nicht als Zeichenkette: sonst verstuemmelt PowerShell
# 5.1 die Umlaute auf dem Weg.
try {
    $null = Invoke-RestMethod -Uri "$Api/api/admin/cv" -Method Put `
        -ContentType "application/json; charset=utf-8" `
        -Headers @{ Authorization = "Bearer $token" } `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($inhalt))
} catch {
    # Die Begruendung steht im Koerper der Antwort. PowerShell zeigt
    # von sich aus nur "500 Internal Server Error" - das hilft keinem.
    $meldung = $_.Exception.Message
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
        $meldung = $_.ErrorDetails.Message
    } elseif ($_.Exception.Response) {
        try {
            $leser = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $roh = $leser.ReadToEnd()
            $leser.Close()
            if ($roh) { $meldung = $roh }
        } catch { }
    }
    Write-Host "Speichern fehlgeschlagen: $meldung" -ForegroundColor Red
    Write-Host ""
    Write-Host "Haeufigste Ursache: auf dem Server liegt keine lebenslauf.json," -ForegroundColor Yellow
    Write-Host "oder sie ist mit :ro eingehaengt. Siehe DEPLOY.md." -ForegroundColor Yellow
    exit 1
}

# ---- Nachschauen, was jetzt wirklich dort steht ----
$jetzt = Invoke-RestMethod -Uri "$Api/api/cv" -Method Get `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host ""
Write-Host "Gespeichert. Auf dem Server steht jetzt:" -ForegroundColor Green
foreach ($r in $jetzt.referenzen) {
    Write-Host "  Referenz: $($r.name), $($r.betrieb)"
}
foreach ($s in $jetzt.sprachen) {
    Write-Host "  Sprache:  $($s.name.de) - $($s.niveau.de)"
}
