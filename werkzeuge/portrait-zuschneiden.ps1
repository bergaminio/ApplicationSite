# Schneidet ein Portraetfoto auf Kopf und Schultern zu.
#
# Das Gegenstueck zu fotos-vorbereiten.ps1: jenes verkleinert viele
# Bilder auf einmal, dieses hier kuemmert sich um genau ein Bild und
# kann dafuer zuschneiden.
#
# So benutzt man es:
#
#   .\werkzeuge\portrait-zuschneiden.ps1
#
# Passt der Ausschnitt nicht, dreht man an -ObenAnteil (wie viel oben
# wegfaellt) und -Seitenanteil (wie viel links und rechts wegfaellt).
# Beides sind Anteile zwischen 0 und 1.

param(
    [string]$Quelle = "$PSScriptRoot\..\fotos-original\image-1786707680307.png",
    [string]$Ziel   = "$PSScriptRoot\..\public\fotos\portrait.jpg",

    # Wie viel vom oberen Rand wegfaellt. 0.10 = die obersten zehn
    # Prozent. Bei einem Foto mit viel Wand ueber dem Kopf hoeher
    # setzen, sonst schwebt der Kopf in der Mitte.
    [double]$ObenAnteil = 0.10,

    # Wie viel links und rechts zusammen wegfaellt.
    [double]$Seitenanteil = 0.28,

    # Seitenverhaeltnis des Ausschnitts. 0.8 entspricht 4:5, dem
    # ueblichen Hochformat fuer Portraets.
    [double]$Verhaeltnis = 0.8,

    # Wie breit das fertige Bild wird.
    #
    # Die Seite zeigt es 160 px breit an, auf einem feinen Bildschirm
    # also 320 px. 600 px sind reichlich und lassen Luft, falls es
    # spaeter groesser dargestellt wird. Ein Foto direkt vom Handy
    # waere hier ueber 1000 px breit und damit ein Vielfaches der
    # Dateigroesse, ohne dass man etwas davon sieht.
    #
    # Vergroessert wird nie: ist der Ausschnitt schmaler als dieser
    # Wert, bleibt er wie er ist. Hochgerechnet wird ein Bild nur
    # unscharf.
    [int]$Zielbreite = 600
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Quelle)) {
    Write-Host "Datei nicht gefunden: $Quelle" -ForegroundColor Red
    exit 1
}

$original = [System.Drawing.Image]::FromFile($Quelle)
Write-Host "Original: $($original.Width) x $($original.Height) px"

# Den Ausschnitt berechnen.
$obenWeg   = [int]($original.Height * $ObenAnteil)
$breite    = [int]($original.Width * (1 - $Seitenanteil))
$hoehe     = [int]($breite / $Verhaeltnis)

# Passt die gewuenschte Hoehe nicht mehr ins Bild, wird stattdessen
# die Breite aus der verfuegbaren Hoehe gerechnet. Ohne diese Zeile
# wuerde das Zuschneiden mit einem Fehler abbrechen.
if (($obenWeg + $hoehe) -gt $original.Height) {
    $hoehe  = $original.Height - $obenWeg
    $breite = [int]($hoehe * $Verhaeltnis)
}

$links = [int](($original.Width - $breite) / 2)
$feld = New-Object System.Drawing.Rectangle($links, $obenWeg, $breite, $hoehe)
Write-Host "Ausschnitt: $breite x $hoehe px, ab ($links, $obenWeg)"

# Auf die Zielbreite bringen. Verkleinert wird beim Zeichnen gleich
# mit, das spart einen zweiten Durchgang und bleibt schaerfer.
#
# Nie vergroessern: ein hochgerechnetes Bild wird unscharf, und
# unscharf faellt auf einer Bewerbungsseite staerker auf als klein.
$endBreite = [Math]::Min($Zielbreite, $breite)
$endHoehe  = [int]($endBreite / $Verhaeltnis)
Write-Host "Fertige Groesse: $endBreite x $endHoehe px"

$neu = New-Object System.Drawing.Bitmap($endBreite, $endHoehe)
$zeichner = [System.Drawing.Graphics]::FromImage($neu)
$zeichner.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$zeichner.DrawImage($original, (New-Object System.Drawing.Rectangle(0, 0, $endBreite, $endHoehe)), $feld, [System.Drawing.GraphicsUnit]::Pixel)

$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$einstellungen = New-Object System.Drawing.Imaging.EncoderParameters(1)
$einstellungen.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88)

$zielOrdner = Split-Path $Ziel -Parent
if (-not (Test-Path $zielOrdner)) { New-Item -ItemType Directory -Force -Path $zielOrdner | Out-Null }
$neu.Save($Ziel, $jpg, $einstellungen)

$zeichner.Dispose(); $neu.Dispose(); $original.Dispose()

$kb = [math]::Round((Get-Item $Ziel).Length / 1KB)
Write-Host "Fertig: $Ziel  ($kb KB)" -ForegroundColor Green
Write-Host "Groesser als $([int]($endBreite/2)) px sollte es auf der Seite nicht angezeigt werden, sonst wird es unscharf."
