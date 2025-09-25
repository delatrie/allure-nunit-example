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

& $LaunchDevToolPath

$SnExe = (Get-Command -CommandType Application -ErrorAction SilentlyContinue "sn.exe").Source
If (-not $SnExe)
{
    Write-Error "Can't find sn.exe"
    Return
}

$SnExe
