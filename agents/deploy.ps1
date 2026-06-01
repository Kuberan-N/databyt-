# DataByt Support Agent — Cloud Run Deployment
# Usage: .\deploy.ps1 -ProjectId YOUR_GCP_PROJECT_ID
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated (gcloud auth login)
#   2. Cloud Run API enabled: gcloud services enable run.googleapis.com
#   3. Cloud Build API enabled: gcloud services enable cloudbuild.googleapis.com

param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectId,
  [string]$Region = "us-central1",
  [string]$ServiceName = "databyt-support-agent"
)

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
  --min-instances 0 `
  --max-instances 5 `
  --set-env-vars "GOOGLE_GENAI_USE_VERTEXAI=FALSE,GOOGLE_API_KEY=AIzaSyCIk2_F9ELn8K5gzpCU-2_UZjrlQlGMkTc,SUPABASE_URL=https://szcgnccuazmzxbudtbyw.supabase.co,SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Y2duY2N1YXptenhidWR0Ynl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTEwMjQyNywiZXhwIjoyMDk0Njc4NDI3fQ.wYe7i3qf733Je81TO-psX66iH7qSMJSpLIMj2PacRvQ" `
  --project $ProjectId

if (-not $?) {
  Write-Host "Deployment failed." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "==> Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEP: Copy the Cloud Run URL printed above, then add it to your .env.local:"
Write-Host "  SUPPORT_AGENT_URL=https://databyt-support-agent-xxxx-uc.a.run.app"
Write-Host ""
Write-Host "Then redeploy your Next.js app to Vercel/Cloud Run."
