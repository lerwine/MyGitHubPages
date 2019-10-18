Add-Type -AssemblyName 'System.Web.Extensions' -ErrorAction Stop;

$Script:IncludeExtensions = @('.js', '.html', '.htm', '.css'
Function Copy-WebContent {
    Param(
        [Parameter(Mandatory = $true)]
        [System.IO.DirectoryInfo]$Source,

        [Parameter(Mandatory = $true)]
        [System.IO.DirectoryInfo]$Target,

        [string[]]$IncludeExtension,

        [string[]]$ExcludeExtension,
        
        [string[]]$ExcludeFileName,

        [string[]]$IncludeFileName,

        [string[]]$ExcludeDirName,

        [string[]]$IncludeDirName,

        [int]$MaxDepth = 32,

        [Parameter(Mandatory = $true)]
        [System.IO.DirectoryInfo]$BaseDir
    )

    [System.IO.FileInfo[]]$Files = $Source.GetFiles();
    if ($PSBoundParameters.ContainsKey('IncludeExtension')) { $Files = $Files | Where-Object { $IncludeExtension -icontains $_.Extension } }
    if ($PSBoundParameters.ContainsKey('ExcludeExtension')) { $Files = $Files | Where-Object { $ExcludeExtension -inotcontains $_.Extension } }
    if ($PSBoundParameters.ContainsKey('IncludeFileName')) { $Files = $Files | Where-Object { $IncludeFileName -icontains $_.Name } }
    if ($PSBoundParameters.ContainsKey('ExcludeFileName')) { $Files = $Files | Where-Object { $ExcludeFileName -inotcontains $_.Name } }

}


$SourcePath = $PSScriptRoot | Join-Path -ChildPath 'src';
$TargetPath = $PSScriptRoot | Join-Path -ChildPath 'gh-pages';

$JavaScriptSerializer = New-Object -TypeName 'System.Web.Script.Serialization.JavaScriptSerializer';

$TsConfig = $JavaScriptSerializer.DeserializeObject([System.IO.File]::ReadAllText(($SourcePath | Join-Path -ChildPath 'tsconfig.json')));

