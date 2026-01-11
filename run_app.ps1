Write-Host "Stopping any running Python/Node processes..."
Stop-Process -Name "python" -ErrorAction SilentlyContinue
Stop-Process -Name "node" -ErrorAction SilentlyContinue

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Write-Host "Starting Backend..."
# Use cmd /k to keep window open if it crashes, and explicit path to python
Start-Process cmd -ArgumentList "/k cd /d ""$backendPath"" && venv\Scripts\python -m pip install -r requirements.txt && venv\Scripts\python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

Write-Host "Starting Frontend..."
Start-Process cmd -ArgumentList "/k cd /d ""$frontendPath"" && npm run dev"

Write-Host "Servers starting in new windows. Please Request a file upload only AFTER you see 'Application startup complete' in the Backend window."
