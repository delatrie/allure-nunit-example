[CmdletBinding()]
Param ()

If (-not $IsWindows)
{
    Write-Error "Can't run this script on $($PSVersionTable.Platform). Windows is required"
    Return
}

$VsInstallPath = vswhere.exe -latest -property installationPath
$LaunchDevToolPath = Join-Path $VsInstallPath 'Common7\Tools\Launch-VsDevShell.ps1'

if (-not (Test-Path -PathType Leaf $LaunchDevToolPath))
{
    Write-Error "Can't find the Developer PowerShell launch script at '$LaunchDevToolPath'"
    Return
}

$SnExe = Invoke-Command -ScriptBlock {
    & $Args[0] | Out-Null
    If (-not $?)
    {
        Return
    }
    (Get-Command -CommandType Application -ErrorAction SilentlyContinue "sn.exe").Source
} -ArgumentList @(,$LaunchDevToolPath)

If (-not $SnExe)
{
    Write-Error "Can't find sn.exe"
    Return
}

$SnExe
