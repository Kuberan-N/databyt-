# DataByt Support Agent — Cloud Run Deployment
# Usage: .\deploy.ps1 -ProjectId YOUR_GCP_PROJECT_ID
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated (gcloud auth login)
#   2. Cloud Run API enabled: gcloud services enable run.googleapis.com
#   3. Cloud Build API enabled: gcloud services enable cloudbuild.googleapis.com
#
# Secrets are read from support_agent/.env — never hardcoded here.

param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectId,
  [string]$Region = "us-central1",
  [string]$ServiceName = "databyt-support-agent"
)

# Read secrets from .env file — keeps keys out of this script and out of git
$envFile = Join-Path $PSScriptRoot "support_agent\.env"
if (-not (Test-Path $envFile)) {
  Write-Host "ERROR: support_agent/.env not found." -ForegroundColor Red
  exit 1
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match "^\s*([^#][^=]+)=(.+)$") {
    $envVars[$matches[1].Trim()] = $matches[2].Trim()
  }
}

$envString = ($envVars.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ","
$ImageName = "gcr.io/$ProjectId/$ServiceName"

Write-Host "==> Building DataByt Support Agent image via Cloud Build..."
gcloud builds submit --tag $ImageName --project $ProjectId

if (-not $?) {
  Write-Host "Build failed. Check the Cloud Build logs above." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "==> Deploying to Cloud Run ($Region)..."

gcloud run deploy $ServiceName `
  --image $ImageName `
  --region $Region `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 1Gi `
  --min-instances 1 `
  --max-instances 5 `
  --set-env-vars $envString `
  --project $ProjectId

if (-not $?) {
  Write-Host "Deployment failed." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "==> Deployment complete!" -ForegroundColor Green
Write-Host "NEXT STEP: Add SUPPORT_AGENT_URL to Vercel environment variables."
