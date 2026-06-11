# Start the development server for device-refurbishing

Set-Location $PSScriptRoot

# Install dependencies if node_modules is missing
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

# Launch the Vite dev server in the background
Write-Host "Starting development server..." -ForegroundColor Green
$server = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -PassThru -NoNewWindow

# Wait for the server to become available, then open the browser
$url = "http://localhost:5173"
Write-Host "Waiting for server at $url ..." -ForegroundColor Cyan
$maxAttempts = 30
$attempt = 0
do {
    Start-Sleep -Seconds 1
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $ready = $true
    } catch {
        $ready = $false
    }
} while (-not $ready -and $attempt -lt $maxAttempts)

if ($ready) {
    Write-Host "Server is ready. Opening browser..." -ForegroundColor Green
    Start-Process $url
} else {
    Write-Host "Server did not respond in time. Open $url manually." -ForegroundColor Yellow
}

# Keep the script alive so the server keeps running
$server | Wait-Process
