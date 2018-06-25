Param(
    [string]$SourcePath,
    [string]$TargetPath,
    [bool]$GenerateCliXml = $false
)

Function ConvertTo-CodeToken {
    Param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [System.Management.Automation.PSToken]$Token,

        [Parameter(Mandatory = $true)]
        [string]$SourceText
    )

    Process {
        $Text = $SourceText.Substring($Token.Start, $Token.Length);
        New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
            Type = [Enum]::GetName([System.Management.Automation.PSTokenType], $Token.Type);
            Start = $Start;
            Length = $Text.Length;
            Text = $Text;
            NextIndex = $Start + $Text.Length;
        }
    }
}

if ($GenerateCliXml) {
    if ($psISE -eq $null -or $psISE.Options -eq $null -or $Host.Name -ne 'Windows PowerShell ISE Host') {
        Write-Error -Message 'This must be executed within the Windows PowerShell ISE Host to generate a new PsTokenColors.xml file.' -Category ResourceUnavailable -ErrorAction Stop;
    }
    Function ConvertTo-ColorHexRgb {
        [OutputType([string])]
        Param(
            [Parameter(Mandatory = $true)]
            [System.Windows.Media.Color]$Color
        )
        return $Color.R.ToString('x2') + $Color.G.ToString('x2') + $Color.B.ToString('x2');
    }
    Function ConvertTo-ColorHexRgbDictionary {
        [OutputType([Hashtable])]
        Param(
            [Parameter(Mandatory = $true)]
            [System.Collections.Generic.IDictionary[System.Management.Automation.PSTokenType, System.Windows.Media.Color]]$Dictionary
        )
        $ColorHexRgbDictionary = @{};
        $Dictionary.Keys | ForEach-Object { $ColorHexRgbDictionary.Add([Enum]::GetName([System.Management.Automation.PSTokenType], $_), (ConvertTo-ColorHexRgb -Color $Dictionary[$_])) }
        ,$ColorHexRgbDictionary | Write-Output;
    }
    $Script:ColorSettings = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
        ConsolePane = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
            Foreground = ConvertTo-ColorHexRgb -Color $psISE.Options.ConsolePaneForegroundColor;
            Background = ConvertTo-ColorHexRgb -Color $psISE.Options.ConsolePaneBackgroundColor;
            TokenColors = ConvertTo-ColorHexRgbDictionary -Dictionary $psISE.Options.ConsoleTokenColors;
        };
        ScriptPane = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
            Foreground = ConvertTo-ColorHexRgb -Color $psISE.Options.ScriptPaneForegroundColor;
            Background = ConvertTo-ColorHexRgb -Color $psISE.Options.ScriptPaneBackgroundColor;
            TokenColors = ConvertTo-ColorHexRgbDictionary -Dictionary $psISE.Options.TokenColors;
        };
    }
    $ColorSettings | Export-Clixml -LiteralPath ($PSScriptRoot | Join-Path -ChildPath 'TokenColors.xml');
} else {
    $Script:ColorSettings = Import-Clixml -LiteralPath ($PSScriptRoot | Join-Path -ChildPath 'TokenColors.xml');
}

$Path = Read-Host -Prompt 'Enter path to script file';
$Script:Code = (Get-Content -Path $Path | Out-String).Trim();
if ($Script:Code -eq $null -or $Script:Code.Length -eq 0) { throw 'Nothing to parse'; }
$ParseErrors = New-Object -TypeName 'System.Collections.ObjectModel.Collection[System.Management.Automation.PSParseError]';
$ParsedTokens = @([System.Management.Automation.PSParser]::Tokenize($Script:Code, [ref]$ParseErrors) | ConvertTo-CodeToken -SourceText $Script:Code);
if ($ParseErrors.Count -gt 0) {
    $lastIdx = $ParseErrors.Count;
    for ($i = 1; $i -lt $lastIdx; $i++) {
        Write-Error -Message $ParseErrors[$i].Message -Category ParserError -TargetObject $ParseErrors[$i].Token -ErrorAction Continue;
    }
    Write-Error -Message $ParseErrors[$lastIdx].Message -Category ParserError -TargetObject $ParseErrors[$lastIdx].Token -ErrorAction Stop;
}
$Path = Read-Host -Prompt 'Enter path to output file';
$Settings = New-Object -TypeName 'System.Xml.XmlWriterSettings';
$Settings.CheckCharacters = $false;
$Settings.Indent = $false;
$Settings.OmitXmlDeclaration = $true;
$Settings.WriteEndDocumentOnClose = $true;
$Script:XmlWriter = [System.Xml.XmlWriter]::Create($Path, $Settings);
$Script:XmlWriter.WriteStartElement('html');
$Script:XmlWriter.WriteStartElement('head');
$Script:XmlWriter.WriteStartElement('style');
$Script:XmlWriter.WriteAttributeString('type', 'text/css');
$Script:XmlWriter.WriteString(@"

.console-pane,
.script-pane {
    border: 2px double var(--secondary);
    padding: 4pt;
    display: block;
    overflow: scroll;
    white-space: nowrap;
}
.console-pane,
.script-pane,
.console-pane code,
.script-pane code,
.console-pane var,
.script-pane var {
    font: var(--font-family-monospace);
    font-size: small;
    font-weight: normal;
}
"@);

$ScriptTokenTypeMap = @{};
$ConsoleTokenTypeMap = @{};
((@(
    (New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
        ClassName = 'script-pane';
        ParentSelector = '';
        TagName = '';
        Color = $Script:ColorSettings.ScriptPane.Foreground;
    }), (New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
        ClassName = 'code';
        ParentSelector = '.script-pane';
        TagName = '';
        Color = $Script:ColorSettings.ScriptPane.Foreground;
    }), (New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
        ClassName = 'console-pane';
        ParentSelector = '';
        TagName = '';
        Color = $Script:ColorSettings.ConsolePane.Foreground;
    }), (New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
        ClassName = 'code';
        ParentSelector = '.console-pane';
        TagName = '';
        Color = $Script:ColorSettings.ConsolePane.Foreground;
    })
) + @($Script:ColorSettings.ScriptPane.TokenColors.Keys | ForEach-Object {
    $Color = $Script:ColorSettings.ScriptPane.TokenColors[$_];
    switch ($_) {
        'String' {
            $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                ClassName = '';
                ParentSelector = '.script-pane';
                TagName = 'q';
                Color = $Color
            };
            $ScriptTokenTypeMap[$_] = $RenderInfo;
            $RenderInfo | Write-Output;
            break;
        }
        'Variable' {
            $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                ClassName = '';
                ParentSelector = '.script-pane';
                TagName = 'var';
                Color = $Color;
            };
            $ScriptTokenTypeMap[$_] = $RenderInfo;
            $RenderInfo | Write-Output;
            break;
        }
        default {
            if ($Color -ne $Script:ColorSettings.ScriptPane.Foreground) {
                $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                    ClassName = 'script-' + $_.ToLower();
                    ParentSelector = '.script-pane';
                    TagName = '';
                    Color = $Color;
                };
                $ScriptTokenTypeMap[$_] = $RenderInfo;
                $RenderInfo | Write-Output;
            }
            break;
        }
    }
}) + @($Script:ColorSettings.ConsolePane.TokenColors.Keys | ForEach-Object {
    $Color = $Script:ColorSettings.ConsolePane.TokenColors[$_];
    switch ($_) {
        'String' {
            $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                ClassName = '';
                ParentSelector = '.console-pane';
                TagName = 'q';
                Color = $Color
            };
            $ConsoleTokenTypeMap[$_] = $RenderInfo;
            $RenderInfo | Write-Output;
            break;
        }
        'Variable' {
            $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                ClassName = '';
                ParentSelector = '.console-pane';
                TagName = 'var';
                Color = $Color
            };
            $ConsoleTokenTypeMap[$_] = $RenderInfo;
            $RenderInfo | Write-Output;
            break;
        }
        default {
            if ($Color -ne $Script:ColorSettings.ConsolePane.Foreground) {
                $RenderInfo = New-Object -TypeName 'System.Management.Automation.PSObject' -Property @{
                    ClassName = 'console-' + $_.ToLower();
                    ParentSelector = '.console-pane';
                    TagName = '';
                    Color = $Color;
                };
                $ConsoleTokenTypeMap[$_] = $RenderInfo;
                $RenderInfo | Write-Output;
            }
            break;
        }
    }
})) | Group-Object -Property 'Color') | ForEach-Object {
    $Selectors = @($_.Group | ForEach-Object {
        if ($_.ParentSelector.Length -gt 0) {
            if ($_.TagName.Length -gt 0) { "$($_.ParentSelector) $($_.TagName)" } else { "$($_.ParentSelector) .$($_.ClassName)" }
        } else {
            if ($_.TagName.Length -gt 0) { $_.TagName } else { ".$($_.ClassName)" }
        }
    });
    $Rules = @("color: #$($_.Name)");
    if (@($_.Group | Where-Object { $_.ParentSelector.Length -eq 0 -and $_.ClassName -eq 'script-pane' }).Count -gt 0) { $Rules = $Rules + @("background-color: #$($Script:ColorSettings.ScriptPane.Background)"); }
    if (@($_.Group | Where-Object { $_.ParentSelector.Length -eq 0 -and $_.ClassName -eq 'console-pane' }).Count -gt 0) { $Rules = $Rules + @("background-color: #$($Script:ColorSettings.ConsolePane.Background)") }
    if ($Rules.Count -eq 1) {
        $Script:XmlWriter.WriteString("`r`n$($Selectors -join ", ") { $($Rules[0]); }");
    } else {
        $Script:XmlWriter.WriteString(@"

$($Selectors -join ",`r`n") {
    $($Rules -join ";`r`n    ");
}
"@);
    }
}
$Script:XmlWriter.WriteString(@"

.script-pane q:before, .console-pane q:before { content: no-open-quote; }
.script-pane q:after, .console-pane q:after { content: no-close-quote; }

"@);

$Script:XmlWriter.WriteEndElement();
$Script:XmlWriter.WriteEndElement();
$Script:XmlWriter.WriteStartElement('body');
$Script:XmlWriter.WriteString("`r`n");
$Script:XmlWriter.WriteStartElement('pre');
$Script:XmlWriter.WriteAttributeString('class', 'script-pane');
$Script:XmlWriter.WriteStartElement('code');
try {
    $StartIndex = 0;
    $ParsedTokens | ForEach-Object {
        $Token = $_;
        if ($ScriptTokenTypeMap.ContainsKey($Token.Type)) {
            if ($Token.Start -gt $StartIndex) { $Script:XmlWriter.WriteString($Script:Code.Substring($StartIndex, $Token.Start - $StartIndex)) }
            if ($ScriptTokenTypeMap[$Token.Type].TagName.Length -gt 0) {
                $XmlWriter.WriteStartElement($ScriptTokenTypeMap[$Token.Type].TagName);
                $Script:XmlWriter.WriteString($Token.Text);
                $XmlWriter.WriteEndElement();
            } else {
                $XmlWriter.WriteStartElement('span');
                $XmlWriter.WriteAttributeString('class', $ScriptTokenTypeMap[$Token.Type].ClassName);
                $Script:XmlWriter.WriteString($Token.Text);
                $XmlWriter.WriteEndElement();
            }
            $StartIndex = $NextIndex;
        }
    }
    if ($StartIndex -lt $Script:Code.Length) { $Script:XmlWriter.WriteString($Script:Code.Substring($StartIndex)) }
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.WriteString("`r`n");
    $Script:XmlWriter.WriteStartElement('pre');
    $Script:XmlWriter.WriteAttributeString('class', 'console-pane');
    $Script:XmlWriter.WriteStartElement('code');
    $StartIndex = 0;
    $ParsedTokens | ForEach-Object {
        [System.Management.Automation.PSToken]$Token = $_;
        $Token.Type = [Enum]::GetName([System.Management.Automation.PSTokenType], $Token.Type);
        if ($ConsoleTokenTypeMap.ContainsKey($Token.Type)) {
            if ($Token.Start -gt $StartIndex) { $Script:XmlWriter.WriteString($Script:Code.Substring($StartIndex, $Token.Start - $StartIndex)) }
            if ($ConsoleTokenTypeMap[$Token.Type].TagName.Length -gt 0) {
                $XmlWriter.WriteStartElement($ConsoleTokenTypeMap[$Token.Type].TagName);
                $Script:XmlWriter.WriteString($Script:Code.Substring($Token.Start, $Token.Length));
                $XmlWriter.WriteEndElement();
            } else {
                $XmlWriter.WriteStartElement('span');
                $XmlWriter.WriteAttributeString('class', $ConsoleTokenTypeMap[$Token.Type].ClassName);
                $Script:XmlWriter.WriteString($Script:Code.Substring($Token.Start, $Token.Length));
                $XmlWriter.WriteEndElement();
            }
            $StartIndex = $Token.Start + $Token.Length;
        }
    }
    if ($StartIndex -lt $Script:Code.Length) { $Script:XmlWriter.WriteString($Script:Code.Substring($StartIndex)) }
} finally {
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.WriteString("`r`n");
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.WriteEndElement();
    $Script:XmlWriter.Flush();
    $XmlWriter.Close();
}
Write-Host "Code written to $Path";