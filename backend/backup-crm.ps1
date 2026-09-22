$BackupFolder = "C:\Users\sumit\OneDrive\Desktop\backend\crm-backups"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = "$BackupFolder\crm_backup_$Date.sql"

New-Item -ItemType Directory -Force $BackupFolder | Out-Null

docker exec -t business-crm-db pg_dump -U crm_user -d small_business_crm > $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "CRM backup created successfully:"
    Write-Host $BackupFile
}
else {
    Write-Host "Backup failed."
}