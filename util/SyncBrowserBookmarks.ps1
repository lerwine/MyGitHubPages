Add-Type -TypeDefinition @'
namespace ValueCollections {
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    public class QueryItem {
        private string _key;
        private string _Value;
        public string Key { get { return _key; } }
        public string Value { get { return _value; } }
        public QueryItem(string key, string value) {
            if (key == null) {
                _value = null;
                _key = (string.IsNullOrEmpty(value)) ? "" : Uri.UnescapeDatastring(value);
            } else {
                _key = Uri.UnescapeDatastring(key);
                _value = (string.IsNullOrEmpty(value)) ? value : Uri.UnescapeDatastring(value);
            }
        }
    }
    public class QueryValueCollectionPair {
        private Collection<string> _innerCollection = new Collection<string>();
        private ReadOnlyCollection<string> _readOnly;
        public Collection<string> InnerCollection { get { return _innerCollection; } }
        public ReadOnlyCollection<string> ReadOnly { get { return _readOnly; } }
        public QueryValueCollection() {
            this._readOnly = new ReadOnlyCollection<string>(_innerCollection);
        }
    }
    public class QueryDictionary : IDictionary<string, ReadOnlyCollection<string>>, IList<QueryItem>, IDictionary, IList {
        private Dictionary<string, QueryValueCollectionPair> _innerDictionary = new Dictionary<string, QueryValueCollectionPair>(stringComparer.InvariantCultureIgnoreCase);
        private List<QueryItem> _innerList = new List<QueryItem>();
        public ReadOnlyCollection<string> this[string key] {
            if (key != null && _innerDictionary.ContainsKey(key))
                return _innerDictionary[key].ReadOnly;
            return null;
        }
        ReadOnlyCollection<string> IDictionary<string, ReadOnlyCollection<string>>.this[string key] {
            get { return this[key]; }
            set { throw new NotSupportedException(); }
        }
        public QueryItem this[int index] { get { return _innerList[index]; } }
        QueryItem IList<QueryItem>.this[int index]
        {
            get { return _innerList[index]; }
            set { throw new NotSupportedException(); }
        }
        object IList.Item.this[int index]
        {
            get { return _innerList[index]; }
            set { throw new NotSupportedException(); }
        }
        object IDictionary.this[object key]
        {
            get { return (key != null && key is string) ? this[(string]key] : null; }
            set { throw new NotSupportedException(); }
        }
        public ICollection<string> Keys { get { return _innerDictionary.Keys; } }
        ICollection IDictionary.Keys { get { return _innerDictionary.Keys; } }

        ICollection<ReadOnlyCollection<string>> IDictionary<string, ReadOnlyCollection<string>>.Values { get { return _innerList.Select(i => i.Value).ToList(); } }
        ICollection IDictionary.Values { get { return _innerList.Select(i => i.Value).ToList(); } }
        
        bool IList.IsReadOnly { get { return true; } }
        bool IDictionary.IsReadOnly { get { return true; } }
        bool ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.IsReadOnly { get { return true; } }
        bool ICollection<QueryItem>.IsReadOnly { get { return true; } }
        
        bool IList.IsFixedSize { get { return true; } }
        bool IDictionary.IsFixedSize { get { return true; } }
        
        public int Count { get { return _innerList.Count; } }
        public int ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.Count { get { return _innerDictionary.Count; } }
        
        object ICollection.SyncRoot { get { throw new NotSupportedException(); } }
        bool ICollection.IsSynchronized { get { return false; } }
        
        int IList.Add(object value) { throw new NotSupportedException(); }
        void IDictionary<string, ReadOnlyCollection<string>>.Add(string key, ReadOnlyCollection<string> value) { throw new NotSupportedException(); }
        void IDictionary.Add(object key, object value) { throw new NotSupportedException(); }
        void ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.Add(KeyValuePair<string, ReadOnlyCollection<string>> item) { throw new NotSupportedException(); }
        void ICollection<QueryItem>.Add(QueryItem item) { throw new NotSupportedException(); }

        void IList.Clear() { throw new NotSupportedException(); }
        void IDictionary.Clear() { throw new NotSupportedException(); }
        void ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.Clear() { throw new NotSupportedException(); }
        void ICollection<QueryItem>.Clear() { throw new NotSupportedException(); }

        public bool Contains(QueryItem item) { return item != null && _innerList.Contains(item); }
        bool IList.Contains(object value) { return item != null && item is QueryItem && _innerList.Contains((QueryItem)item); }

        public bool ContainsKey(string key) { return _innerDictionary.ContainsKey(key); }
        bool IDictionary.Contains(object key) { return key is string && _innerDictionary.ContainsKey((string)key); }
        bool ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.Contains(KeyValuePair<string, ReadOnlyCollection<string>> item) { throw new NotImplementedException(); }

        public void CopyTo(QueryItem[] array, int arrayIndex) { _innerList.CopyTo(array, arrayIndex); }
        void ICollection.CopyTo(Array array, int index) { _innerList.ToArray().CopyTo(array, arrayIndex); }
        void ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.CopyTo(KeyValuePair<string, ReadOnlyCollection<string>>[] array, int arrayIndex) {
            KeyValuePair<string, QueryValueCollectionPair>[] arr = new QueryValueCollectionPair[(arrayIndex < array.Length) ? array.Length = arrayIndex : 0];
            _innerDictionary.CopyTo(arr, 0);
            arr.Select(kvp => new KeyValuePair<string, ReadOnlyCollection<string>>(kvp.Key, kvp.Value.ReadOnly)).ToArray().CopyTO(array, arrayIndex);
        }

        public IEnumerator<QueryItem> GetEnumerator() { return _innerList.GetEnumerator(); }
        IDictionaryEnumerator IDictionary.GetEnumerator() { throw new NotImplementedException(); }
        IEnumerator<KeyValuePair<string, ReadOnlyCollection<string>>> IEnumerable<KeyValuePair<string, ReadOnlyCollection<string>>>.GetEnumerator() { throw new NotImplementedException(); }
        IEnumerator IEnumerable.GetEnumerator() { throw new NotImplementedException(); }
        
        public int IndexOf(QueryItem item) { throw new NotImplementedException(); }
        int IList.IndexOf(object value) { throw new NotImplementedException(); }
        
        void IList<QueryItem>.Insert(int index, QueryItem item) { throw new NotSupportedException(); }
        void IList.Insert(int index, object value) { throw new NotSupportedException(); }
                
        bool ICollection<QueryItem>.Remove(QueryItem item) { throw new NotSupportedException(); }
        bool IDictionary<string, ReadOnlyCollection<string>>.Remove(string key) { throw new NotSupportedException(); }
        void IList.Remove(object value) { throw new NotSupportedException(); }
        void IDictionary.Remove(object key) { throw new NotSupportedException(); }
        bool ICollection<KeyValuePair<string, ReadOnlyCollection<string>>>.Remove(KeyValuePair<string, ReadOnlyCollection<string>> item) { throw new NotSupportedException(); }
        
        void IList<QueryItem>.RemoveAt(int index) { throw new NotSupportedException(); }
        void IList.RemoveAt(int index) { throw new NotSupportedException(); }

        public bool TryGetValue(string key, out ReadOnlyCollection<string> value)
        {
            QueryValueCollectionPair coll;
            if (_innerDictionary.TryGetValue(key, out coll))
            {
                value = coll.ReadOnly;
                return true;
            }
            value = null;
            return false;
        }
        

        public static QueryDictionary Parse(string query) {
            QueryDictionary result = new QueryDictionary();
            if (string.IsNullOrEmpty(query))
                _innerList.Add(new QueryItem("", null));
            else {
                foreach (string[] p in ((query.StartsWith("?")) ? query.Substring(1) : query).Split(new char[] { '&' }).Select(p => p.Split(new char[] { '=' }, 2)))
                    _innerList.Add(new QueryItem(Uri.UnescapeDatastring(p[0]), (p.Length == 2) ? Uri.UnescapeDatastring(p[1]) : null));
            }
            foreach (QueryItem item in _innerList) {
                QueryValueCollectionPair values;
                if (_innerDictionary.ContainsKey(item.Key)) {
                    values = _innerDictionary[item.Key];
                    if (!values.InnerCollection.Contains(item.Value))
                        values.InnerCollection.Add(item.Value);
                } else {
                    values = new QueryValueCollection();
                    values.InnerCollection.Add(item.Value);
                    _innerDictionary.Add(item.Key, values);
                }   
            }
            return result;
        }
    }
}
'@;
[System.Collections.ObjectModel.ReadOnlyCollection
Function Get-GoogleBookmarksPath {
    Param()
    @([System.Environment+SpecialFolder]::ApplicationData, [System.Environment+SpecialFolder]::LocalApplicationData) | ForEach-Object {
        $p = [System.Environment]::GetFolderPath($_);
        if (-not [string]::IsNullOrEmpty($p)) {
            $p = $p | Join-Path -ChildPath 'Google\Chrome\User Data\Default\Bookmarks';
            if (Test-Path -LiteralPath $p -PathType Leaf) { $p | Write-Output }
        }
    } | Select-Object -First 1;
}

Function ConvertFrom-GoogleBookmarksJSON {
}

Function ConvertTo-CsTypeName {
    Param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [System.Type[]]$Type
    )

    Process {
        $Type | ForEach-Object {
            if ($Type.IsGenericType) {
                "$($Type.Name -replace '`\d+$', '')<$(($_.GetGenericArguments() | ConvertTo-CsTypeName) -join ', ')>" | Write-Output;
            } else {
                $Type.Name | Write-Output;
            }
        }
    }
}



Function Load-GoogleBookmarks {
  [CmdletBinding(DefaultParameterSetName = 'Path')]
  Param(
      [Parameter(Mandatory = $true, ValueFromPipeline = $true, ParameterSetName = 'Object')]
      [PSObject[]]$InputObject,

      [Parameter(Mandatory = $true, ParameterSetName = 'JSONstring')]
      [string]$JSONstring,

      [Parameter(ParameterSetName = 'Path')]
      [string]$Path,

      [Parameter(Mandatory = $true, ParameterSetName = 'LiteralPath')]
      [string]$LiteralPath
  )

  Process {
      if ($PSCmdlet.ParameterSetName -ne 'Object') {
          $LoadFrom = $null;
          if ($PSCmdlet.ParameterSetName -eq 'Path') {
              if ([string]::IsNullOrEmpty($Path)) {
                  $LoadFrom = @([System.Environment+SpecialFolder]::ApplicationData, [System.Environment+SpecialFolder]::LocalApplicationData) | ForEach-Object {
                      $p = [System.Environment]::GetFolderPath($_);
                      if (-not [string]::IsNullOrEmpty($p)) {
                          $p = $p | Join-Path -ChildPath 'Google\Chrome\User Data\Default\Bookmarks';
                          if (Test-Path -LiteralPath $p -PathType Leaf) { $p | Write-Output }
                      }
                  } | Select-Object -First 1;
              } else {
                  if (Test-Path -Path $Path -PathType Leaf) {
                      $LoadFrom = ($Path | Resolve-Path) | Select-Object -First 1;
                  } else {
                      if (Test-Path -Path $Path) {
                          Write-Error -Message 'Path does not refer to a file' -Category InvalidType -ErrorId 'NotAFile' -TargetObject $Path;
                      } else {
                          Write-Error -Message 'Path does not exist' -Category ObjectNotFound -ErrorId 'FileNotFound' -TargetObject $Path;
                      }
                  }
              }
          } else {
              if ($PSBoundParameters.ContainsKey('LiteralPath')) {
                  if (Test-Path -LiteralPath $LiteralPath -PathType Leaf) {
                      $LoadFrom = $LiteralPath;
                  } else {
                      if (Test-Path -LiteralPath $LiteralPath) {
                          Write-Error -Message 'Literal Path does not refer to a file' -Category InvalidType -ErrorId 'NotAFile' -TargetObject $LiteralPath;
                      } else {
                          Write-Error -Message 'Literal Path does not exist' -Category ObjectNotFound -ErrorId 'FileNotFound' -TargetObject $LiteralPath;
                      }
                  }
              }
          }
          if (-not [string]::IsNullOrEmpty($LoadFrom)) {
              $Content = Get-Content -LiteralPath $LoadFrom;
              if ($null -ne $Content -and $Content.Length -gt 0) { $JSONstring = $Content | Out-string; }
          }
          if (-not [string]::IsNullOrEmpty($JSONstring)) { [PSObject[]]$InputObject = @($Content | ConvertFrom-Json) }
          if ($null -eq $InputObject -or 0 -eq $InputObject.Length) {
              [PSObject[]]$InputObject = @(New-Object -TypeName 'System.Management.Automation.PSObject');
          }
      }

      foreach ($Item in $InputObject) {
          $Properties = @{ };
          ($Item | Get-Member -MemberType NoteProperty) | ForEach-Object {
              $Value = $Item.($_.Name);
              if ($null -eq $Value) {
                  $Properties[$_.Name] = $Value
              } else {
                  switch ($_.Name) {
                      'children' {
                          $Properties['children'] = @($Value | Load-GoogleBookmarks);
                          break;
                      }
                      'url' {
                          $Uri = $null;
                          if ([System.Uri]::TryCreate($Value, [System.UriKind]::RelativeOrAbsolute, [ref]$Uri)) { $Properties['url'] = $Uri } else { $Properties['url'] = $Value }
                          break;
                      }
                      { $_ -eq 'id' -or $_ -eq 'sync_transaction_version' } {
                          if ($Value -is [string]) {
                              if ($Value.Contains('.')) {
                                  [float]$f = 0.0;
                                  if ([float]::TryParse($Value.Trim(), [ref]$f)) { $Properties[$_] = $f } else { $Properties[$_] = $Value }
                              } else {
                                  $n = 0;
                                  if ([int]::TryParse($Value.Trim(), [ref]$n)) { $Properties[$_] = $n } else { $Properties[$_] = $Value }
                              }
                          } else {
                              if ($Value -is [byte] -or $Value -is [sbyte] -or $Value -is [Int16] -or $Value -is [UInt16] -or $Value -is [int] -or ($Value -is [Int64] -and $Value -le [int]::MaxValue -and $Value -ge [int]::MinValue) -or ($Value -is [UInt64] -and $Value -le [int]::MaxValue)) {
                                  $Properties[$_] = ([int]($Value));
                              } else {
                                  try { $Properties[$_] = ([float]($Value)) } catch { $Properties[$_] = $Value }
                              }
                          }
                          break;
                      }
                      { $_ -eq 'date_added' -or $_ -eq 'date_modified' -or $_ -eq 'last_visited' } {
                          [long]$n = 0;
                          if ($Value -is [string]) {
                              if ([long]::TryParse($Value.Trim(), [ref]$n)) { $Properties[$_] = $n } else { $Properties[$_] = $Value }
                          } else {
                              if ($Value -is [DateTime]) {
                                  $Properties[$_] = $Value;
                              } else {
                                  try { $Properties[$_] = ([long]($Value)) } catch { $Properties[$_] = $Value }
                              }
                          }
                          if ($Properties[$_] -is [long]) {
                              try { $Properties[$_] = [DateTime]::SpecifyKind((New-Object -TypeName 'System.DateTime' -ArgumentList ($Properties[$_] * 10)).AddDays(584388), [DateTimeKind]::Utc) } catch { $Properties[$_] = $Value }
                          } else {
                              if ($Properties[$_] -is [string]) {
                                  try {
                                      $Properties[$_] = New-Object -TypeName 'System.DateTime' -ArgumentList $Properties[$_];
                                      if ($Properties[$_].Kind -eq [System.DateTimeKind]::Local) {
                                          $Properties[$_] = $Properties[$_].ToUniversalTime();
                                      } else {
                                          if ($Properties[$_].Kind -eq [System.DateTimeKind]::Unspecified) { $Properties[$_] = [DateTime]::SpecifyKind($Properties[$_]) }
                                      }
                                  } catch { $Properties[$_] = $Value }
                              }
                          }
                          break;
                      }
                      { $_ -eq 'roots' -or $_ -eq 'bookmark_bar' -or $_ -eq 'other' -or $_ -eq 'synced' -or $_ -eq 'meta_info' } {
                          $Properties[$_] = $Value | Load-GoogleBookmarks;
                          break;
                      }
                      default {
                          if ($_ -ne 'checksum' -and $_ -ne 'version') {
                              $Properties[$_] = $Value;
                          }
                          break;
                      }
                  }
              }
          }
          New-Object -TypeName 'System.Management.Automation.PSObject' -Property $Properties;
      }
  }
}

Function Convert-GoogleBookmarksToXml {
  [CmdletBinding(DefaultParameterSetName = 'Xml')]
  Param(
      [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
      [PSObject]$InputObject,

      [Parameter(ParameterSetName = 'Xml')]
      [System.Xml.XmlElement]$ParentElement,

      [Parameter(Mandatory = $true, ParameterSetName = 'Html')]
      [switch]$Html
  )

  Begin {
      $XmlDocument = $null;
      if ($PSBoundParameters.ContainsKey('ParentElement')) {
          $XmlDocument = $ParentElement.OwnerDocument;
      } else {
          [xml]$XmlDocument = '<Bookmarks />';
          $ParentElement = $XmlDocument.DocumentElement;
      }
  }

  Process {
      ($InputObject | Get-Member -MemberType NoteProperty) | ForEach-Object {
          $LocalName = [System.Xml.XmlConvert]::EncodeLocalName($_.Name);
          if ($LocalName -eq 'children') { $LocalName = 'bookmark' }
          if ($LocalName -eq 'url' -and $ParentElement.LocalName -eq 'url') { $LocalName = 'href' }
          $Value = $InputObject.($_.Name);
          if ($null -ne $Value -and $_.Name -ne 'type' -and $_.Name -ne 'type') {
              $NoteProperties = @();
              if ($Value -is [PSObject]) { $NoteProperties = @(($Value | Get-Member -MemberType NoteProperty) | ForEach-Object { $_.Name }) }
              if ($NoteProperties.Count -gt 0) {
                  if ($Value.type -is [string] -and $Value.type.Length -gt 0) { $LocalName = [System.Xml.XmlConvert]::EncodeLocalName($Value.type) }
                  Convert-GoogleBookmarksToXml -InputObject $Value -ParentElement $ParentElement.AppendChild($XmlDocument.CreateElement($LocalName));
              } else {
                  if ($Value -is [System.Collections.IList]) {
                      @($Value) | ForEach-Object {
                          $ElementName = $LocalName;
                          if ($_.type -is [string] -and $_.type.Length -gt 0) { $ElementName = [System.Xml.XmlConvert]::EncodeLocalName($_.type) }
                          $XmlElement = $ParentElement.AppendChild($XmlDocument.CreateElement($ElementName));
                          $NoteProperties = @();
                          if ($_ -is [PSObject]) { $NoteProperties = @(($_ | Get-Member -MemberType NoteProperty) | ForEach-Object { $_.Name }) }
                          if ($NoteProperties.Count -gt 0) {
                              Convert-GoogleBookmarksToXml -InputObject $_ -ParentElement $XmlElement;
                          } else {
                              if ($_ -is [string]) {
                                  $XmlElement.InnerText = $_;
                              } else {
                                  if ($_ -is [DateTime]) {
                                      $XmlElement.InnerText = [System.Xml.XmlConvert]::Tostring($_, 'yyyy-MM-ddTHH:mm:ss.ffffffzzzzzz');
                                  } else {
                                      if ($_ -is [Uri]) {
                                          $XmlElement.InnerText = $_.Tostring();
                                      } else {
                                          if ($_ -is [bool] -or $_ -is [char] -or $_ -is [decimal] -or $_ -is [sbyte] -or $_ -is [int16] -or $_ -is [int] -or $_ -is [long] -or $_ -is [byte] -or $_ -is [uint16] -or $_ -is [uint32] -or $_ -is [uint64] -or $_ -is [float] -or $_ -is [double] -or $_ -is [timespan] -or $_ -is [guid]) {
                                              $XmlElement.InnerText = [System.Xml.XmlConvert]::Tostring($_);
                                          } else {
                                              $XmlElement.InnerText = $_ | Out-string -Stream;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  } else {
                      $XmlAttribute = $ParentElement.Attributes.Append($XmlDocument.CreateAttribute($LocalName));
                      if ($Value -is [string]) {
                          $XmlAttribute.Value = $Value;
                      } else {
                          if ($Value -is [DateTime]) {
                              $XmlAttribute.Value = [System.Xml.XmlConvert]::Tostring($Value, 'yyyy-MM-ddTHH:mm:ss.ffffffzzzzzz');
                          } else {
                              if ($Value -is [Uri]) {
                                  $XmlAttribute.Value = $Value.Tostring();
                              } else {
                                  if ($Value -is [bool] -or $Value -is [char] -or $Value -is [decimal] -or $Value -is [sbyte] -or $Value -is [int16] -or $Value -is [int] -or $Value -is [long] -or $Value -is [byte] -or $Value -is [uint16] -or $Value -is [uint32] -or $Value -is [uint64] -or $Value -is [float] -or $Value -is [double] -or $Value -is [timespan] -or $Value -is [guid]) {
                                      $XmlAttribute.Value = [System.Xml.XmlConvert]::Tostring($Value);
                                  } else {
                                      $XmlAttribute.Value = $Value | Out-string -Stream;
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
  }

  End {
    if (-not $PSBoundParameters.ContainsKey('ParentElement')) { $XmlDocument | Write-Output }
  }
}

Function Open-HtmlFragment {
    Param(
        [Parameter(Mandatory = $true)]
        [string]$LiteralPath
    )
    if (Test-Path -LiteralPath $LiteralPath -PathType Leaf) {
        $Content = Get-Content -LiteralPath $LiteralPath -Encoding UTF8;
        if ($null -ne $Content) {
            $XmlDocument = New-Object -TypeName 'System.Xml.XmlDocument';
            $HtmlFragment = $XmlDocument.CreateDocumentFragment();
            $HtmlFragment.InnerXml = $Content -join "`n";
            if ($null -ne $HtmlFragment.FirstChild) {
                $HtmlFragment | Write-Output;
            } else {
                Write-Error -Message "Error reading HTML file contents" -Category InvalidData -ErrorId 'ParseError' -TargetObject $InputPath;
            }
        } else {
            Write-Error -Message "Error parsing HTML" -Category ReadError -ErrorId 'ReadError' -TargetObject $InputPath;
        }
    } else {
        Write-Error -Message "HTML file not found" -Category ObjectNotFound -ErrorId 'FileNotFound' -TargetObject $InputPath;
    }
}

Function Open-JSONData {
    Param(
        [Parameter(Mandatory = $true)]
        [string]$LiteralPath
    )
    if (Test-Path -LiteralPath $LiteralPath -PathType Leaf) {
        $Content = Get-Content -LiteralPath $LiteralPath -Encoding UTF8;
        if ($null -ne $Content) {
            $JSONData = ($Content -join "`n") | ConvertFrom-Json;
            if ($null -ne $JSONData) {
                $JSONData | Write-Output;
            } else {
                Write-Error -Message "Error reading JSON file contents" -Category InvalidData -ErrorId 'ParseError' -TargetObject $InputPath;
            }
        } else {
            Write-Error -Message "Error parsing JSON" -Category ReadError -ErrorId 'ReadError' -TargetObject $InputPath;
        }
    } else {
        Write-Error -Message "JSON file not found" -Category ObjectNotFound -ErrorId 'FileNotFound' -TargetObject $InputPath;
    }
}

Function ConvertFrom-GoogleBookmarksDateTime {
    Param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [AllowNull()]
        [AllowEmptystring()]
        [AllowEmptyCollection()]
        [object[]]$Value
    )

    Process {
        if ($null -ne $Value -and $Value.Length -gt 0) {
            foreach ($v in $Value) {
                if ($null -ne $v) {
                    $t = $null;
                    if ($v -is [string]) {
                        [long]$n = 0;
                        if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($v.Trim(), [long], [ref]$n)) {
                            ConvertFrom-GoogleBookmarksDateTime -Value $n;
                        } else {
                            if ($v.Trim().Length -gt 0) {
                                $d = [DateTime]::Now;
                                if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($v.Trim(), [System.DateTime], [ref]$d)) {
                                    if ($d.Kind -eq [System.DateTimeKind]::Utc) {
                                        $d | Write-Output;
                                    } else {
                                        if ($d.Kind -eq [System.DateTimeKind]::Local) {
                                            $d.ToUniversalTime() | Write-Output;
                                        } else {
                                            [System.DateTime]::SpecifyKind($d, [System.DateTimeKind]::Utc) | Write-Output;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        [long]$n = 0;
                        if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($v, [long], [ref]$n)) {
                            [DateTime]::SpecifyKind((New-Object -TypeName 'System.DateTime' -ArgumentList ($v * 10)).AddDays(584388), [DateTimeKind]::Utc);
                        } else {
                            $d = [DateTime]::Now;
                            if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($v, [System.DateTime], [ref]$d)) {
                                if ($d.Kind -eq [System.DateTimeKind]::Utc) {
                                    $d | Write-Output;
                                } else {
                                    if ($d.Kind -eq [System.DateTimeKind]::Local) {
                                        $d.ToUniversalTime() | Write-Output;
                                    } else {
                                        [System.DateTime]::SpecifyKind($d, [System.DateTimeKind]::Utc) | Write-Output;
                                    }
                                }
                            } else {
                                $s = '';
                                if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($v, [string], [ref]$s)) {
                                    ConvertFrom-GoogleBookmarksDateTime -Value $s;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

Function Get-DevelopmentGoogleBookmarks {
    Param(
        [Parameter(Mandatory = $true)]
        [PSObject]$JSONData
    )
    if ($null -ne $JSONData) {
        $GoogleBookmarks = $JSONData.roots;
        if ($null -ne $GoogleBookmarks) {
            $GoogleBookmarks = $JSONData.bookmark_bar;
            if ($null -ne $GoogleBookmarks) {
                if ($null -ne $GoogleBookmarks.children) {
                    $GoogleBookmarks = $GoogleBookmarks.children | Where-Object { $_.name -eq 'Development' } | Select-Object -First 1;
                    if ($null -ne $GoogleBookmarks) {
                        if ($null -ne $GoogleBookmarks.children) {
                            $GoogleBookmarks.children | Write-Output;
                        } else {
                            Write-Error -Message 'Item named "Development" in "roots.bookmark_bar.children" property does not ahve a "children" property.' -Category ObjectNotFound -ErrorId 'PropertyNotFound:roots.bookmark_bar.children[name="Development"].children' -TargetObject $JSONData;
                        }
                    } else {
                        Write-Error -Message 'Item named "Development" not found in "roots.bookmark_bar.children"' -Category ObjectNotFound -ErrorId 'PropertyNotFound:roots.bookmark_bar.children[name="Development"]' -TargetObject $JSONData;
                    }
                } else {
                    Write-Error -Message '"roots.bookmark_bar.children" property not found' -Category ObjectNotFound -ErrorId 'PropertyNotFound:roots.bookmark_bar.children' -TargetObject $JSONData;
                }
            } else {
                Write-Error -Message '"roots.bookmark_bar" property not found' -Category ObjectNotFound -ErrorId 'PropertyNotFound:roots.bookmark_bar' -TargetObject $JSONData;
            }
        } else {
            Write-Error -Message '"roots" property not found' -Category ObjectNotFound -ErrorId 'PropertyNotFound:roots' -TargetObject $JSONData;
        }
    }
}

Function Import-GoogleBookmarks {
    Param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [PSObject[]]$JSONData,

        [Parameter(Mandatory = $true)]
        [System.Xml.XmlDocumentFragment]$AppHomeComponentHtml,

        [System.Xml.XmlElement]$CurrentFolder
    )

    Process {
        foreach ($Item in $JSonData) {
            if ($null -ne $Item.type) {
                if ($Item.type -is [string]) {
                    switch ($Item.type) {
                        'url' {
                            if ($null -ne $Item.url) {
                                [string]$url = '';
                                if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($Item.url, [System.string], [ref]$url) -and ($url = $url.Trim()).Length -gt 0) {
                                    [System.Xml.XmlElement]$AnchorElement = $null;
                                    $name = '';
                                    if ($Item.name -ne $null -and [System.Management.Automation.LanguagePrimitives]::TryConvertTo($Item.name, [System.string], [ref]$name)) {
                                        $name = $name.Trim();
                                    }
                                    $dateAdded = '';
                                    if ($null -ne $Item.date_added) {
                                        $d = ConvertFrom-GoogleBookmarksDateTime -Value $Item.date_added;
                                        if ($null -ne $d) {
                                            $dateAdded = [System.Xml.XmlConvert]::Tostring('yyyy-MM-dd HH:mm:ss.fff');
                                        }
                                    }
                                }
                            } else {
                                Write-Debug -Message "Null property value: url";
                            }
                            break;
                        }
                        'folder' {
                            break;
                        }
                        default {
                            Write-Debug -Message "Unknown type: $($Item.type)";
                            break;
                        }
                    }
                } else {
                    Write-Debug -Message "Unexpected type property $([System.Management.Automation.LanguagePrimitives]::ConvertTypeNameToPSTypeName($Item.type.GetType().FullName)): $($Item.type)";
                }
            } else {
                Write-Debug -Message 'Item does not contain a "type" property';
            }
        }
    }
}

Function Convert-UriToPSObject {
    Param(
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [AllowNull()]
        [AllowEmptystring()]
        [object[]]$InputObject
    )

    Process {
        if ($InputObject -eq $null) {
            Convert-UriToPSObject -InputObject "";
        } else {
            $InputObject | ForEach-Object {
                [System.Uri]$Uri = '';
                $s = '';
                if (-not [System.Management.Automation.LanguagePrimitives]::TryConvertTo($_, [System.Uri], [ref]$Uri)) {
                    if (-not [System.Management.Automation.LanguagePrimitives]::TryConvertTo($_, [System.string], [ref]$s)) { $s = '' }
                    if (-not [System.Uri]::TryCreate($s, [System.UriKind]::RelativeOrAbsolute, [ref]$Uri)) { $Uri = $null }
                }
                $Components = @{ Query = New-Object -TypeName 'System.Collections.Generic.Dictionary[System.string, System.Collections.ObjectModel.Collection[System.string]]' -ArgumentList ([System.stringComparer]::InvariantCultureIgnoreCase) };
                if ($Uri -ne $null -and -not $Uri.IsAbsoluteUri) {
                    $s = $Uri.Tostring();
                    $Uri = $null;
                }
                $Query = '';
                if ($Uri -ne $null) {
                    $Components['Scheme'] = $Uri.Scheme;
                    $Components['UserInfo'] = $Uri.UserInfo;
                    $Components['Host'] = $Uri.Host;
                    $Components['Port'] = $Uri.Port;
                    $Components['Path'] = $Uri.PathAndQuery;
                    $i = $Components['Path'].IndexOf('?');
                    if ($i -lt 0) {
                        $Query = '';
                    } else {
                        $Query = $Components['Path'].Substring($i + 1);
                        $Components['Path'] = $Components['Path'].Substring(0, $i);
                    }
                    $Components['Fragment'] = $Uri.Fragment;
                } else {
                    $Components['Scheme'] = '';
                    $Components['UserInfo'] = '';
                    $Components['Host'] = '';
                    $Components['Port'] = -1;
                    $Components['Path'] = $s;
                    $i = $Components['Path'].IndexOf('#');
                    if ($i -lt 0) {
                        $Components['Fragment'] = '';
                    } else {
                        $Components['Fragment'] = $Components['Path'].Substring($i + 1);
                        $Components['Path'] = $Components['Path'].Substring(0, $i);
                        $i = $Components['Path'].IndexOf('?');
                        if ($i -lt 0) {
                            $Query = '';
                        } else {
                            $Query = $Components['Path'].Substring($i + 1);
                            $Components['Path'] = $Components['Path'].Substring(0, $i);
                        }
                    }
                }

                if ($Query.StartsWith('?')) { $Query = $Query.Substring(1) }
                $Query.Split('&') | ForEach-Object {
                    $i = $_.IndexOf('=');
                    $key = '';
                    $value = $null;
                    if ($i -ge 0) {
                        $key = [System.Uri]::UnescapeDatastring($_.Substring(0, $i));
                        $value = [System.Uri]::UnescapeDatastring($_.Substring($i + 1));
                    } else {
                        $key = [System.Uri]::UnescapeDatastring($_);
                    }
                    [System.Collections.Generic.ObjectModel.Collection[System.string]]$List = $null;
                    if ($Components.Query.ContainsKey($key)) {
                        [System.Collections.ObjectModel.Collection[System.string]]$List = $Components.Query[$key];
                        if ($value -eq $null) {
                        } else {
                        }
                    } else {
                        [System.Collections.ObjectModel.Collection[System.string]]$List = @();
                        $List.Add($value);
                        $Components.Query[$key] = $List;
                    }
                }
                if ($Components['Fragment'].StartsWith('#')) { $Components['Fragment'] = $Components['Fragment'].Substring(1) }
            }
        }
    }
}

Function Test-Uri {
    Param(
        [Parameter(Mandatory = $true)]
        [System.Uri]$x,
        
        [Parameter(Mandatory = $true)]
        [System.Uri]$y
    )

    if ($x.Tostring() -ieq $y.Tostring()) { return $true }
    $a = ''; $b = '';
    if ($x.IsAbsoluteUri) {
        if (-not ($y.IsAbsoluteUri -and $x.Scheme -ieq $y.Scheme -and $x.UserInfo -ieq $y.UserInfo -and $x.Host -ieq $y.Host -and $x.Port -ieq $y.Port)) { return $false }
        $a = $x.PathAndQuery;
        $b = $y.PathAndQuery;
    } else {
        if ($y.IsAbsoluteUri) { return $false }
        $a = $x;
        $b = $y;
    }
    if ($a -ieq $b) { return $true }
    $q1 = '';
    $q2 = '';
    $i = $a.IndexOf('?');
    if ($i -ge 0) {
        $q1 = $a.Substring($i + 1);
        $a = $a.Substring(0, $i);
    }
    $i = $b.IndexOf('?');
    if ($i -ge 0) {
        $q2 = $b.Substring($i + 1);
        $b = $b.Substring(0, $i);
    }
    $a = $a.Replace('\', '/');
    $b = $b.Replace('\', '/');
    if (-not $a.StartsWith('/')) { $a = "/$a" }
    if (-not $a.EndsWith('/')) { $a = "$a/" }
    if (-not $b.StartsWith('/')) { $b = "/$b" }
    if (-not $b.EndsWith('/')) { $b = "$b/" }
    if ($a -ine $b) { return $false }
    $f1 = '';
    $f2 = '';
    $i = $a.IndexOf('?');
    if ($i -ge 0) {
        $q1 = $a.Substring($i + 1);
        $a = $a.Substring(0, $i);
    }
    $i = $b.IndexOf('?');
    if ($i -ge 0) {
        $q2 = $b.Substring($i + 1);
        $b = $b.Substring(0, $i);
    }
}

Function Import-AppHomeComponentBookmarks {
    Param(
        [Parameter(Mandatory = $true, ParameterSetName = 'Root')]
        [System.Xml.XmlDocumentFragment]$AppHomeComponentHtml,
        
        [Parameter(Mandatory = $true, ValueFromPipeline = $true, ParameterSetName = 'Nested')]
        [PSObject[]]$CurrentFolder
    )

    Process {
        if ($PSBoundParameters.ContainsKey('AppHomeComponentHtml')) {
            $Element = $AppHomeComponentHtml.SelectSingleNode('section/div[@class="card"]/div[@class="card-body"]|div[@class="card"]/div[@class="card-body"]');
            if ($Element -eq $null) { $Element = $AppHomeComponentHtml.OwnerDocument.CreateElement('div') }
            $CurrentFolder = @(New-Object -TypeName ([PSObject]) -Property @{
                Element = $Element;
                LinkAnchors = @($Element.SelectNodes('ul/li/descendant::a[not(count(@href)=0 or string-length(normalize-space(@href))=0)]'));
            });
            $CurrentFolder | Add-Member -MemberType ScriptMethod -Name 'HasLink' -Value {
                Param(
                    [Parameter(Mandatory = $true)]
                    [string]$Uri
                )
                $this.Element.SelectNodes('ul/li/descendant::a[not(count(@href)=0 or string-length(normalize-space(@href))=0)]')
            };
            $Element = $Element.SelectSingleNode('div[@class="card"]/div[@class="card-body"]');
            if ($Element -eq $null) { $Element = $AppHomeComponentHtml.OwnerDocument.CreateElement('div') }
            $CurrentFolder | Add-Member -MemberType NoteProperty -Name 'Element' -Value $Element;
            $CurrentFolder | Add-Member -MemberType NoteProperty -Name 'Root' -Value $CurrentFolder[0];
        }
        foreach ($Folder in $CurrentFolder) {
            @($Folder.SelectNodes('li/*'));
            if ($null -ne $Item.type) {
                if ($Item.type -is [string]) {
                    switch ($Item.type) {
                        'url' {
                            if ($null -ne $Item.url) {
                                [string]$url = '';
                                if ([System.Management.Automation.LanguagePrimitives]::TryConvertTo($Item.url, [System.string], [ref]$url) -and ($url = $url.Trim()).Length -gt 0) {
                                    [System.Xml.XmlElement]$AnchorElement = $null;
                                    $name = '';
                                    if ($Item.name -ne $null -and [System.Management.Automation.LanguagePrimitives]::TryConvertTo($Item.name, [System.string], [ref]$name)) {
                                        $name = $name.Trim();
                                    }
                                    $dateAdded = '';
                                    if ($null -ne $Item.date_added) {
                                        $d = ConvertFrom-GoogleBookmarksDateTime -Value $Item.date_added;
                                        if ($null -ne $d) {
                                            $dateAdded = [System.Xml.XmlConvert]::Tostring('yyyy-MM-dd HH:mm:ss.fff');
                                        }
                                    }
                                }
                            } else {
                                Write-Debug -Message "Null property value: url";
                            }
                            break;
                        }
                        'folder' {
                            break;
                        }
                        default {
                            Write-Debug -Message "Unknown type: $($Item.type)";
                            break;
                        }
                    }
                } else {
                    Write-Debug -Message "Unexpected type property $([System.Management.Automation.LanguagePrimitives]::ConvertTypeNameToPSTypeName($Item.type.GetType().FullName)): $($Item.type)";
                }
            } else {
                Write-Debug -Message 'Item does not contain a "type" property';
            }
        }
    }
}

$AppHomeComponentHtml = Open-HtmlFragment -LiteralPath ($PSScriptRoot | Join-Path -ChildPath "../src/app/app-home/app-home.component.html") -ErrorAction Stop;
#$DevelopmentGoogleBookmarks = Get-DevelopmentGoogleBookmarks -JSONData (Open-JSONData -LiteralPath (Get-GoogleBookmarksPath -ErrorAction Stop) -ErrorAction Stop) -ErrorAction Stop;
#$DevelopmentGoogleBookmarks | Import-GoogleBookmarks -AppHomeComponentHtml $AppHomeComponentHtml;
$AppHomeComponentHtml.SelectNodes('(section/div[@class="card"]/div[@class="card-body"]|div[@class="card"]/div[@class="card-body"])/ul/li/descendant::a[not(count(@href)=0 or string-length(normalize-space(@href))=0)]')