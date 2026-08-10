# Macht Fotos fuer die Website fertig.
#
# Handy- und Kamerafotos sind schnell 5 MB gross. Zehn davon und die
# Seite laedt quaelend langsam - besonders am Handy im Zugsnetz. Dieses
# Skript verkleinert sie auf 1600 Pixel Breite und speichert sie als
# JPG. Aus 5 MB werden so typisch 200-400 KB, und man sieht keinen
# Unterschied.
#
# So benutzt man es:
#
#   .\werkzeuge\fotos-vorbereiten.ps1 -Quelle "C:\Users\Miaum\Downloads\instagram"
#
# Die fertigen Bilder landen in public/fotos/. Am Schluss druckt das
# Skript die Zeilen, die in Personal.tsx in die fotos-Liste gehoeren.

param(
    # Ordner mit den Originalbildern.
    [Parameter(Mandatory = $true)]
    [string]$Quelle,

    # Wohin die fertigen Bilder kommen.
    [string]$Ziel = "$PSScriptRoot\..\public\fotos",

    # Laengste Seite in Pixeln. 1600 reicht fuer die Diashow locker.
    [int]$MaxBreite = 1600
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Quelle)) {
    Write-Host "Der Ordner '$Quelle' gibt es nicht." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $Ziel)) {
    New-Item -ItemType Directory -Force -Path $Ziel | Out-Null
    Write-Host "Ordner angelegt: $Ziel"
}

# JPG mit Qualitaet 82. Der Standard von .NET waere 75 und sichtbar
# schlechter, 100 waere unnoetig gross.
$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
       Where-Object { $_.MimeType -eq 'image/jpeg' }
$einstellungen = New-Object System.Drawing.Imaging.EncoderParameters(1)
$einstellungen.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, 82)

$bilder = Get-ChildItem -Path $Quelle -Include *.jpg, *.jpeg, *.png, *.heic -Recurse -File |
          Sort-Object Name

if ($bilder.Count -eq 0) {
    Write-Host "Keine Bilder in '$Quelle' gefunden." -ForegroundColor Yellow
    exit 0
}

Write-Host "$($bilder.Count) Bilder gefunden." -ForegroundColor Cyan
$nummer = 0
$fertige = @()

foreach ($datei in $bilder) {
    $nummer++
    try {
        $bild = [System.Drawing.Image]::FromFile($datei.FullName)
    } catch {
        # HEIC kann .NET nicht. Lieber ueberspringen als abstuerzen.
        Write-Host "  uebersprungen (Format wird nicht unterstuetzt): $($datei.Name)" -ForegroundColor Yellow
        $nummer--
        continue
    }

    # Handys speichern Hochformat oft als Querformat plus einen
    # Vermerk "bitte drehen" (EXIF 0x0112). Ohne diesen Block liegen
    # solche Bilder auf der Website auf der Seite.
    if ($bild.PropertyIdList -contains 0x0112) {
        switch ($bild.GetPropertyItem(0x0112).Value[0]) {
            3 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            6 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            8 { $bild.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
    }

    # Seitenverhaeltnis behalten. Kleinere Bilder nicht aufblasen -
    # das macht sie nur unscharf und gross.
    $faktor = [Math]::Min($MaxBreite / $bild.Width, $MaxBreite / $bild.Height)
    if ($faktor -gt 1) { $faktor = 1 }
    $breite = [int]($bild.Width * $faktor)
    $hoehe  = [int]($bild.Height * $faktor)

    $neu = New-Object System.Drawing.Bitmap($breite, $hoehe)
    $zeichner = [System.Drawing.Graphics]::FromImage($neu)
    $zeichner.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $zeichner.DrawImage($bild, 0, 0, $breite, $hoehe)

    $name = "foto{0:D2}.jpg" -f $nummer
    $zielpfad = Join-Path $Ziel $name
    $neu.Save($zielpfad, $jpg, $einstellungen)

    $zeichner.Dispose(); $neu.Dispose(); $bild.Dispose()

    $vorher  = [Math]::Round($datei.Length / 1KB)
    $nachher = [Math]::Round((Get-Item $zielpfad).Length / 1KB)
    Write-Host ("  {0} -> {1}  ({2} KB -> {3} KB, {4}x{5})" -f `
        $datei.Name, $name, $vorher, $nachher, $breite, $hoehe)

    $fertige += "      '/fotos/$name',"
}

Write-Host ""
Write-Host "Fertig. Diese Zeilen gehoeren in src/pages/Personal.tsx" -ForegroundColor Green
Write-Host "in die fotos-Liste beim Hobby 'Fotografieren':" -ForegroundColor Green
Write-Host ""
$fertige | ForEach-Object { Write-Host $_ }
Write-Host ""
