param([int]$IntervalSec = 20)

$repo = "D:\Alice\projects\chat-app"
$log  = Join-Path $repo ("logs\autonomy-{0}.log" -f (Get-Date -Format yyyyMMdd))

function Log($msg){
  $ts  = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "$ts | $msg"
  Add-Content -Path $log -Value $line -Encoding utf8
}

function Test-Port($port){ [bool](netstat -ano | Select-String -Quiet (":$port\s")) }

function Ensure-Up(){
  if (-not (Test-Port 3001)){
    Log "start | server"
    Start-Process powershell -ArgumentList '-NoExit','-Command', 'cd "'+$repo+'"; node .\src\server\index.cjs' | Out-Null
    Start-Sleep -s 1
  }
  if (-not (Test-Port 5174)){
    Log "start | vite"
    Start-Process powershell -ArgumentList '-NoExit','-Command', 'cd "'+$repo+'"; $env:VITE_PORT=5174; npx vite' | Out-Null
    Start-Sleep -s 1
  }
  $hasElectron = (Get-Process electron -ErrorAction SilentlyContinue) -ne $null
  if (-not $hasElectron){
    Log "start | electron"
    Start-Process powershell -ArgumentList '-NoExit','-Command', 'cd "'+$repo+'"; $env:VITE_PORT=5174; npx electron .' | Out-Null
  }
}

function PostJson($url, $obj){
  $json = $obj | ConvertTo-Json -Depth 12
  Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $json -TimeoutSec 120
}

function Run-PlanFile(){
  $planPath = Join-Path $repo 'plan.json'
  if (-not (Test-Path $planPath)) { return $false }

  $plan = Get-Content $planPath -Raw | ConvertFrom-Json
  if ($null -eq $plan -or -not $plan.tasks -or $plan.tasks.Count -eq 0) { return $false }

  $planName = if ($plan.PSObject.Properties.Name -contains 'name' -and $plan.name) { $plan.name } else { 'unnamed' }
  $taskCount = ($plan.tasks | Measure-Object).Count
  Log ("plan | begin | {0} | {1} tasks" -f $planName, $taskCount)

  try {
    $resp = PostJson 'http://localhost:3001/run' @{ tasks = $plan.tasks }
    Log "plan | posted | ok"
    $done = Join-Path $repo ("plan.done_{0}.json" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
    Move-Item $planPath $done -Force
    return $true
  } catch {
    Log ("plan | error | " + $_.Exception.Message)
    return $false
  }
}

Log "autonomy | loop start"
while ($true){
  try {
    Ensure-Up
    try { Invoke-WebRequest http://localhost:3001/health -UseBasicParsing -TimeoutSec 2 | Out-Null } catch {}
    $executed = Run-PlanFile
    if (-not $executed) {
      $maint = @{
        tasks = @(
          @{ kind="cmd";   cmd="git add -A" },
          @{ kind="cmd";   cmd='git commit -m "chore(auto): periodic snapshot"' },
          @{ kind="cmd";   cmd="npm run smoke" }
        )
      }
      try {
        PostJson 'http://localhost:3001/run' $maint | Out-Null
        Log "maint | ok"
      } catch { Log ("maint | error | " + $_.Exception.Message) }
    }
  } catch { Log ("loop | error | " + $_.Exception.Message) }
  Start-Sleep -Seconds $IntervalSec
}

