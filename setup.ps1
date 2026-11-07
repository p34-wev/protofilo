# ============================================================
# Portfolio Project Setup Script
# Downloads Maven, sets JAVA_HOME, compiles and runs the backend
# ============================================================

$ErrorActionPreference = "Continue"

$JAVA_HOME = "C:\Program Files\Java\jdk17"
$MVN_DIR   = "C:\maven\apache-maven-3.9.6"
$MVN_EXE   = "$MVN_DIR\bin\mvn.cmd"
$BACKEND   = "C:\Users\HP\Desktop\protofolio\backend"

# ---- 1. Set JAVA_HOME ----
$env:JAVA_HOME = $JAVA_HOME
$env:PATH      = "$JAVA_HOME\bin;$env:PATH"
$jv = & "$JAVA_HOME\bin\java.exe" -version 2>&1
Write-Host "[1/4] Java: $($jv[0])" -ForegroundColor Cyan

# ---- 2. Download Maven if not present ----
if (-not (Test-Path $MVN_EXE)) {
    Write-Host "[2/4] Downloading Maven 3.9.6..." -ForegroundColor Cyan
    $zip = "$env:TEMP\maven.zip"
    Invoke-WebRequest `
        -Uri "https://downloads.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" `
        -OutFile $zip `
        -UseBasicParsing
    Expand-Archive -Path $zip -DestinationPath "C:\maven" -Force
    Remove-Item $zip
    Write-Host "[2/4] Maven installed at $MVN_DIR" -ForegroundColor Green
} else {
    Write-Host "[2/4] Maven already present." -ForegroundColor Green
}

$env:PATH = "$MVN_DIR\bin;$env:PATH"
Write-Host "Maven: $( & $MVN_EXE --version 2>&1 | Select-Object -First 1 )"

# ---- 3. Compile ----
Write-Host "[3/4] Compiling backend..." -ForegroundColor Cyan
Set-Location $BACKEND
& $MVN_EXE compile -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compile FAILED. Running again with full output..." -ForegroundColor Red
    & $MVN_EXE compile
    exit 1
}
Write-Host "[3/4] Compile SUCCESS" -ForegroundColor Green

# ---- 4. Run ----
Write-Host "[4/4] Starting Spring Boot app (Ctrl+C to stop)..." -ForegroundColor Cyan
Write-Host "NOTE: Make sure MySQL is running and application.properties DB credentials are correct." -ForegroundColor Yellow
& $MVN_EXE spring-boot:run
