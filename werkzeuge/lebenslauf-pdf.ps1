# Macht aus werkzeuge/lebenslauf.html ein PDF.
#
#   .\werkzeuge\lebenslauf-pdf.ps1
#
# Das Ergebnis landet als lebenslauf.pdf im Projektordner. Von dort
# laedt man es im Admin-Bereich als Dokument im Bereich "Lebenslauf"
# hoch - dann liefert der Server es nur an Angemeldete aus.
#
# Bewusst NICHT nach public/: was dort liegt, gibt der Webserver an
# jeden heraus, der die Adresse kennt.
#
# Gedruckt wird mit einem Chromium-Browser im Hintergrund. Der ist auf
# diesem Rechner ohnehin installiert, und er setzt die Seite genauso
# wie beim normalen Drucken - nur ohne dass jemand Strg+P druecken muss.

param(
    # Zweite Fassung MIT Telefonnummer, zum Direktverschicken.
    [switch]$MitTelefon,

    # Die Nummer steht bewusst nicht im Skript, denn das Repository ist
    # oeffentlich. Beim Aufruf mitgeben:
    #   .\werkzeuge\lebenslauf-pdf.ps1 -MitTelefon -Telefon "+41 ..."
    [string]$Telefon = ""
)

$basis = Split-Path $PSScriptRoot -Parent
$quelle = Join-Path $PSScriptRoot "lebenslauf.html"
$ziel = Join-Path $basis "lebenslauf.pdf"

if ($MitTelefon) {
    if (-not $Telefon) {
        Write-Host "Ohne Nummer geht das nicht. So aufrufen:" -ForegroundColor Red
        Write-Host '  .\werkzeuge\lebenslauf-pdf.ps1 -MitTelefon -Telefon "+41 79 123 45 67"'
        exit 1
    }

    # Eine Kopie anlegen, Telefonzeile einsetzen, daraus drucken.
    # Doppelte Anfuehrungszeichen beim Here-String, damit $Telefon
    # wirklich eingesetzt wird - bei einfachen bliebe der Name stehen.
    $quelle = Join-Path $env:TEMP "lebenslauf-mit-telefon.html"
    $zeile = @"
      <div class="zeile">
        <svg viewBox="0 0 24 24"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3z"/></svg>
        <span>$Telefon</span>
      </div>
"@
    $inhalt = Get-Content (Join-Path $PSScriptRoot "lebenslauf.html") -Raw -Encoding UTF8
    $inhalt = $inhalt -replace '(?s)(<h2>Sprachen</h2>)', "$zeile`n`n      `$1"
    Set-Content $quelle $inhalt -Encoding UTF8
    $ziel = Join-Path $basis "lebenslauf-mit-telefon.pdf"
}

# Einen Chromium-Browser suchen. Reihenfolge egal, alle koennen es.
$browser = @(
    "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
    Write-Host "Kein Chromium-Browser gefunden (Brave, Edge oder Chrome)." -ForegroundColor Red
    exit 1
}

Write-Host "Drucke mit $(Split-Path $browser -Leaf) ..."

# file:/// braucht Schraegstriche statt Backslashes.
$adresse = "file:///" + ($quelle -replace '\', '/')

& $browser --headless --disable-gpu --no-pdf-header-footer `
    "--print-to-pdf=$ziel" $adresse 2>$null | Out-Null

Start-Sleep -Seconds 2

if (Test-Path $ziel) {
    $kb = [math]::Round((Get-Item $ziel).Length / 1KB)
    Write-Host "Fertig: $ziel ($kb KB)" -ForegroundColor Green
    Write-Host "Jetzt im Admin-Bereich als Dokument im Bereich 'Lebenslauf' hochladen."
} else {
    Write-Host "Es ist kein PDF entstanden." -ForegroundColor Red
    exit 1
}
