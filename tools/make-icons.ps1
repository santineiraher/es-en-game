# Iconos PWA — ES → EN
Add-Type -AssemblyName System.Drawing

function New-Icon {
  param([int]$Size, [string]$OutPath, [bool]$Maskable = $false)

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $bg = [System.Drawing.Color]::FromArgb(26, 63, 235)
  $accent = [System.Drawing.Color]::FromArgb(255, 255, 255)
  $g.Clear($bg)

  if (-not $Maskable) {
    $g.Clear([System.Drawing.Color]::Transparent)
    $radius = [int]($Size * 0.18)
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
    $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
    $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
    $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $brushBg = New-Object System.Drawing.SolidBrush $bg
    $g.FillPath($brushBg, $path)
    $brushBg.Dispose()
    $path.Dispose()
  } else {
    $g.Clear($bg)
  }

  $inner = if ($Maskable) { [int]($Size * 0.8) } else { $Size }
  $offset = [int](($Size - $inner) / 2)
  $fontFamily = "Segoe UI"
  $sizeES = [single]($inner * 0.28)
  $sizeArrow = [single]($inner * 0.2)
  $sizeEN = [single]($inner * 0.28)

  $fontES = New-Object System.Drawing.Font $fontFamily, $sizeES, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $fontArrow = New-Object System.Drawing.Font $fontFamily, $sizeArrow, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $fontEN = New-Object System.Drawing.Font $fontFamily, $sizeEN, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

  $brushW = New-Object System.Drawing.SolidBrush $accent
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

  $cx = $Size / 2.0
  $yTop = $offset + ($inner * 0.22)
  $yMid = $offset + ($inner * 0.50)
  $yBot = $offset + ($inner * 0.78)

  $rectES = New-Object System.Drawing.RectangleF ($cx - $inner / 2), ($yTop - $sizeES / 1.6), $inner, ($sizeES * 1.4)
  $rectArr = New-Object System.Drawing.RectangleF ($cx - $inner / 2), ($yMid - $sizeArrow / 1.6), $inner, ($sizeArrow * 1.4)
  $rectEN = New-Object System.Drawing.RectangleF ($cx - $inner / 2), ($yBot - $sizeEN / 1.6), $inner, ($sizeEN * 1.4)

  $g.DrawString("ES", $fontES, $brushW, $rectES, $sf)
  $g.DrawString([char]0x2192, $fontArrow, $brushW, $rectArr, $sf)
  $g.DrawString("EN", $fontEN, $brushW, $rectEN, $sf)

  $brushW.Dispose()
  $fontES.Dispose()
  $fontArrow.Dispose()
  $fontEN.Dispose()
  $sf.Dispose()
  $g.Dispose()

  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Generated: $OutPath"
}

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root "icons"
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

New-Icon -Size 192 -OutPath (Join-Path $iconsDir "icon-192.png") -Maskable $false
New-Icon -Size 512 -OutPath (Join-Path $iconsDir "icon-512.png") -Maskable $false
New-Icon -Size 512 -OutPath (Join-Path $iconsDir "icon-maskable-512.png") -Maskable $true
