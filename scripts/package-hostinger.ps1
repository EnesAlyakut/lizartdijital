$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $projectRoot
$archivePath = Join-Path $projectRoot '.deployment/lizartdijital-hostinger.zip'
$entries = [System.Collections.Generic.HashSet[string]]::new()
git ls-files --cached --others --exclude-standard | ForEach-Object {
    if ($_ -notmatch '^(\.claude/|\.env|prisma/dev\.db|private-files/)' -and $_ -notmatch '\.(zip|db-journal|db-wal|db-shm)$') {
        [void]$entries.Add($_)
    }
}
Get-ChildItem -LiteralPath (Join-Path $projectRoot 'public') -File -Recurse | ForEach-Object {
    [void]$entries.Add([System.IO.Path]::GetRelativePath($projectRoot, $_.FullName).Replace('\', '/'))
}
[void]$entries.Add('prisma/bootstrap.db')
$zip = [System.IO.Compression.ZipFile]::Open($archivePath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($entry in ($entries | Sort-Object)) {
        $fullPath = Join-Path $projectRoot $entry
        if (Test-Path -LiteralPath $fullPath -PathType Leaf) {
            [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $fullPath, $entry, [System.IO.Compression.CompressionLevel]::Optimal)
        }
    }
} finally { $zip.Dispose() }
Get-Item -LiteralPath $archivePath | Select-Object FullName, Length
