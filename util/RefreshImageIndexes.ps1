$Source = @'
namespace MyGitHubPages
{
    using System;
    using System.Collections.ObjectModel;
    using System.Drawing;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Xml;
    public class ContentIndex
    {
        private readonly DirectoryInfo _webRootDir;
        private readonly DirectoryInfo _indexRootDir;
        private readonly XmlDocument _document;
        private readonly Uri _webRootUri;
        private readonly Uri _indexRootUri;
        private readonly Uri _rootPageUri;
        private readonly XmlElement _mainSection;

        public string SourcePath { get { return _indexRootDir.FullName; } }
        
        private ContentIndex(DirectoryInfo webRootDir, DirectoryInfo indexRootDir)
        {
            _webRootDir = webRootDir;
            _indexRootDir = indexRootDir;
            Uri webRootUri = new Uri(webRootDir.FullName);
            _webRootUri = (webRootUri.AbsolutePath.EndsWith("/")) ? webRootUri : new Uri(webRootUri, "./");
            Uri indexRootUri = new Uri(indexRootDir.FullName);
            _indexRootUri = (indexRootUri.AbsolutePath.EndsWith("/")) ? indexRootUri : new Uri(indexRootUri, "./");
            _rootPageUri = new Uri(_indexRootUri, "index.html");
            _document = new XmlDocument();
            _mainSection = Initialize();
        }

        public ContentIndex(DirectoryInfo webRoot, string relativePath)
        {
            if (relativePath == null)
                throw new ArgumentNullException("relativePath");
            if (webRoot == null)
                throw new ArgumentNullException("webRoot");
            if (!webRoot.Exists)
                throw new ArgumentOutOfRangeException("webRoot", "Web root directory does not exist");
            _indexRootDir = (relativePath.Length > 0 && relativePath != ".") ? new DirectoryInfo(Path.Combine(webRoot.FullName, relativePath)) : webRoot;
            Uri webRootUri = new Uri(webRoot.FullName);
            _webRootUri = (webRootUri.AbsolutePath.EndsWith("/")) ? webRootUri : new Uri(webRootUri, "./");
            if (!_indexRootDir.Exists)
                throw new ArgumentOutOfRangeException("relativePath", "Relative directory does not exist");
            Uri indexRootUri = new Uri(_indexRootDir.FullName);
            _indexRootUri = (indexRootUri.AbsolutePath.EndsWith("/")) ? indexRootUri : new Uri(indexRootUri, "./");
            _rootPageUri = new Uri(_indexRootUri, "index.html");
            if (_webRootUri.MakeRelativeUri(_rootPageUri).ToString().StartsWith(".."))
                throw new ArgumentOutOfRangeException("relativePath", "Relative directory cannot refer outside the web root directory");
            _document = new XmlDocument();
            _mainSection = Initialize();
        }

        private XmlElement Initialize()
        {
            _document.AppendChild(_document.CreateElement("html"));
            _document.DocumentElement.Attributes.Append(_document.CreateAttribute("lang")).Value = "en";
            _document.DocumentElement.Attributes.Append(_document.CreateAttribute("xmlns")).Value = ContentExtensions.Xmlns_xhtml;
            _document.DocumentElement.Attributes.Append(_document.CreateAttribute("xmlns", "xlink", ContentExtensions.Xmlns_xmlns)).Value = ContentExtensions.Xmlns_xlink;
            XmlElement head = _document.DocumentElement.AddTag("head");
            head.AddTag("meta").AddAttribute("name", "viewport").AddAttribute("content", "width=1024, initial-scale=1.0");
            head.AddTag("meta").AddAttribute("http-equiv", "X-UA-Compatible").AddAttribute("content", "ie=edge");
            head.AddTag("meta").AddAttribute("charset", "utf-8");
            string title = "Catalog for " + _indexRootDir.Name + " folder";
            head.AddTag("title", title);
            head.AddTag("link").AddAttribute("rel", "stylesheet").AddAttribute("type", "text/css").AddAttribute("media", "screen").AddAttribute("href", _rootPageUri.MakeRelativeUri(new Uri(_webRootUri, "lib/twitter-bootstrap/css/bootstrap.css")).ToString());
            head.AddTag("link").AddAttribute("rel", "stylesheet").AddAttribute("type", "text/css").AddAttribute("media", "screen").AddAttribute("href", _rootPageUri.MakeRelativeUri(new Uri(_webRootUri, "theme.css")).ToString());
            head.AddTag("link").AddAttribute("type", "text/javascript").AddAttribute("src", _rootPageUri.MakeRelativeUri(new Uri(_webRootUri, "lib/jquery/jquery.js")).ToString());
            head.AddTag("link").AddAttribute("type", "text/javascript").AddAttribute("src", _rootPageUri.MakeRelativeUri(new Uri(_webRootUri, "lib/twitter-bootstrap/js/bootstrap.bundle.js")).ToString());
            XmlElement mainSection = _document.DocumentElement.AddTag("body", "");
            mainSection.AddTag("header").AddAttribute("class", "container-fluid p-1").AddTag("h1", title);
            mainSection = mainSection.AddTag("section").AddAttribute("class", "container-fluid");
            FileInfo[] files = _indexRootDir.GetFiles().Where(f => _extensions.Any(e => string.Equals(f.Extension, e, StringComparison.InvariantCultureIgnoreCase))).ToArray();
            if (files.Length == 0)
                mainSection.IsEmpty = true;
            else
            {
                _isEmpty = false;
                XmlElement table = mainSection.AddTag("table").AddAttribute("class", "table table-bordered");
                XmlElement tr = table.AddTag("thead").AddTag("tr");
                tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Name";
                tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Image";
                tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Width";
                tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Height";
                XmlElement tbody = table.AddTag("tbody");
                foreach (FileInfo f in files)
                {
                    tr = tbody.AddTag("tr");
                    if (string.Equals(f.Extension, ".svg", StringComparison.InvariantCultureIgnoreCase))
                        AddSvgRow(f, tr);
                    else
                        AddImgRow(f, tr);
                }
            }

            return mainSection;
        }

        private void AddSvgRow(FileInfo file, XmlElement tr)
        {
            XmlDocument svgDocument = new XmlDocument();
            try { svgDocument.Load(file.FullName); }
            catch (Exception exc)
            {
                AddErrorRow("Error loading SVG file", file, exc, tr);
                return;
            }
            if (svgDocument.DocumentElement == null)
                AddErrorRow("Root document element not found", file, null, tr);
            else if (svgDocument.DocumentElement.LocalName != "svg" || svgDocument.DocumentElement.NamespaceURI != ContentExtensions.Xmlns_svg)
                AddErrorRow("Unexpected root element \"" + svgDocument.DocumentElement.Name + " (xmlns=\"" + svgDocument.DocumentElement.NamespaceURI + "\")", file, null, tr);
            else
            {
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(svgDocument.NameTable);
                nsmgr.AddNamespace("s", ContentExtensions.Xmlns_svg);
                XmlNodeList symbols = svgDocument.DocumentElement.SelectNodes("s:defs/s:symbol[not(count(@id)=0)]", nsmgr);
                XmlElement td = tr.AddTag("th").AddAttribute("scope", "row");
                if (symbols.Count > 0)
                {
                    td.InnerText = file.Name;
                    td = tr.AddTag("td").AddAttribute("colspan", "3").AddTag("table");
                    tr = td.AddTag("thead").AddTag("tr");
                    tr.AddTag("th").AddAttribute("scope", "col").InnerText = "ID";
                    tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Image";
                    tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Width";
                    tr.AddTag("th").AddAttribute("scope", "col").InnerText = "Height";
                    td = td.AddTag("tbody");
                    foreach (XmlElement se in symbols)
                        AddSvgSymbolRow(se, file.Name, td.AddTag("tr"));
                }
                else
                {
                    td.AddTag("a", file.Name).AddAttribute("href", Uri.EscapeUriString(file.Name)).AddAttribute("target", "_blank");
                    td = tr.AddTag("td").AddTag("img").AddAttribute("src", Uri.EscapeUriString(file.Name)).AddAttribute("alt", "Thumbnail for " + file.Name);
                    int width, height;
                    AddWidthAndHeightColumns(tr, svgDocument.DocumentElement, out width, out height);
                    SetImageWidthAndHeight(td, width, height, true);
                }
            }
        }

        public const int Thumbnail_Width = 32;

        private void AddWidthAndHeightColumns(XmlElement tr, XmlElement source, out int width, out int height)
        {
            XmlAttribute attr = (XmlAttribute)source.SelectSingleNode("@width");
            string txt = (attr == null) ? "" : attr.Value.Trim();
            width = height = -1;
            if (txt.Length == 0)
                tr.AddTag("td").AddAttribute("class", "text-warning text-sm-left").InnerText = "(no width)";
            else
            {
                try
                {
                    if ((width = XmlConvert.ToInt32(txt)) < 1)
                        tr.AddTag("td").AddAttribute("class", "text-warning text-sm-left").InnerText = txt;
                    else
                        tr.AddTag("td", width);
                }
                catch { tr.AddTag("td").AddAttribute("class", "text-danger text-sm-left").InnerText = txt; }
            }

            attr = (XmlAttribute)source.SelectSingleNode("@height");
            txt = (attr == null) ? "" : attr.Value.Trim();
            if (txt.Length == 0)
                tr.AddTag("td").AddAttribute("class", "text-warning text-sm-left").InnerText = "(no width)";
            else
            {
                try
                {
                    if ((height = XmlConvert.ToInt32(txt)) < 1)
                        tr.AddTag("td").AddAttribute("class", "text-warning text-sm-left").InnerText = txt;
                    else
                        tr.AddTag("td", height);
                }
                catch { tr.AddTag("td").AddAttribute("class", "text-danger text-sm-left").InnerText = txt; }
            }

            if (width < 1)
            {
                if (height < 1)
                    width = height = Thumbnail_Width;
                else
                    width = height;
            }
            else if (height < 1)
                height = width;
        }

        private void SetImageWidthAndHeight(XmlElement target, int width, int height, bool isSvg)
        {
            if (width < height)
            {
                if (height > Thumbnail_Width || (isSvg && width < Thumbnail_Width))
                {
                    width = Convert.ToInt32(Math.Round(32.0 / Convert.ToDouble(height)));
                    height = Thumbnail_Width;
                }
            }
            else if (width > Thumbnail_Width || (isSvg && height < Thumbnail_Width))
            {
                height = Convert.ToInt32(Math.Round(32.0 / Convert.ToDouble(width)));
                width = Thumbnail_Width;
            }
            target.AddAttribute("width", width);
            target.AddAttribute("height", height);
        }

        private void AddSvgSymbolRow(XmlElement symbol, string fileName, XmlElement tr)
        {
            string id = symbol.SelectSingleNode("@id").Value;
            fileName = Uri.EscapeUriString(fileName) + "#" + Uri.EscapeUriString(id);
            tr.AddTag("th").AddAttribute("scope", "row").AddTag("a", id).AddAttribute("href", Uri.EscapeUriString(fileName)).AddAttribute("target", "_blank");
            XmlElement svgElement = tr.AddTag("svg").AddAttribute("class", "fill-light stroke-dark");
            XmlElement useElement = svgElement.AddTag("use", "");
            useElement.Attributes.Append(useElement.OwnerDocument.CreateAttribute("href", ContentExtensions.Xmlns_xlink)).Value = fileName;
            int width, height;
            AddWidthAndHeightColumns(tr, symbol, out width, out height);
            SetImageWidthAndHeight(svgElement, width, height, true);
        }

        private void AddImgRow(FileInfo file, XmlElement tr)
        {
            Image image;
            try
            {
                image = Image.FromFile(file.FullName);
            }
            catch (Exception exc)
            {
                AddErrorRow("Error loading image file", file, exc, tr);
                return;
            }
            tr.AddTag("th").AddAttribute("scope", "row").AddTag("a", file.Name).AddAttribute("href", Uri.EscapeUriString(file.Name)).AddAttribute("target", "_blank");
            XmlElement img = tr.AddTag("td").AddTag("img").AddAttribute("src", Uri.EscapeUriString(file.Name)).AddAttribute("alt", "Thumbnail for " + file.Name);
            tr.AddTag("td", image.Width);
            tr.AddTag("td", image.Height);
            SetImageWidthAndHeight(img, image.Width, image.Height, true);
        }

        private void AddErrorRow(string message, FileInfo file, Exception exc, XmlElement tr)
        {
            tr.AddTag("th").AddAttribute("scope", "row").AddTag("a", file.Name).AddAttribute("href", Uri.EscapeUriString(file.Name)).AddAttribute("target", "_blank");
            XmlElement td = tr.AddTag("td", message).AddAttribute("colspan", "3").AddAttribute("class", "text-danger");
            if (exc != null)
                td.AddTag("div", exc.ToString()).AddAttribute("class", "pre-wrap text-sm-left");
        }

        private static readonly string[] _extensions = new string[] { ".gif", ".jpg", ".jpeg", ".png", ".svg" };

        private bool _isEmpty = true;
        public bool IsEmpty { get { return _isEmpty; } }

        public Collection<ContentIndex> Crawl()
        {
            Collection<ContentIndex> result = new Collection<ContentIndex>();
            DirectoryInfo directory = new DirectoryInfo(_indexRootUri.LocalPath);
            DirectoryInfo[] subDirs = directory.GetDirectories();
            if (subDirs.Length > 0)
            {
                _isEmpty = false;
                XmlElement container = ((_mainSection.IsEmpty) ? _mainSection.AddTag("div") : (XmlElement)_mainSection.InsertBefore(_document.CreateElement("div"), _mainSection.FirstChild)).AddAttribute("class", "card");
                container.AddTag("div").AddAttribute("class", "card-header").AddTag("h2", "Subdirectories");
                container = container.AddTag("div").AddAttribute("class", "card-body").AddTag("ul");
                foreach (DirectoryInfo subDir in directory.GetDirectories())
                {
                    ContentIndex item = new ContentIndex(_webRootDir, subDir);
                    result.Add(item);
                    item._mainSection.AddTag("a", "Up").AddAttribute("class", "btn btn-secondary").AddAttribute("href", "../index.html");
                    container.AddTag("li").AddTag("a", subDir.Name).AddAttribute("href", Uri.EscapeUriString(subDir.Name));
                }
            }
            if (!_isEmpty)
            {
                ((XmlElement)(_mainSection.ParentNode)).AddTag("footer").AddAttribute("class", "container-fluid").AddText("Generated On ").AddText(DateTime.Now);
                XmlWriterSettings settings = new XmlWriterSettings();
                settings.CheckCharacters = false;
                settings.Encoding = new UTF8Encoding(false, false);
                settings.Indent = true;
                using (XmlWriter writer = XmlWriter.Create(Path.Combine(_indexRootDir.FullName, "index.html")))
                {
                    _document.WriteTo(writer);
                    writer.Flush();
                }
            }
            return result;
        }
    }

    public static class ContentExtensions
    {
        public const string Xmlns_xhtml = "http://www.w3.org/1999/xhtml";
        public const string Xmlns_svg = "http://www.w3.org/2000/svg";
        public const string Xmlns_xlink = "http://www.w3.org/1999/xlink";
        public const string Xmlns_angular = "http://angularjs.org";
        public const string Xmlns_xmlns = "http://www.w3.org/2000/xmlns/";

        public static XmlElement AddTag(this XmlElement parent, string name) { return (XmlElement)parent.AppendChild(parent.OwnerDocument.CreateElement(name, Xmlns_xhtml)); }

        private static XmlElement _AddTag(XmlElement parent, string name, string value)
        {
            XmlElement result = (XmlElement)parent.AppendChild(parent.OwnerDocument.CreateElement(name, Xmlns_xhtml));
            result.AppendChild(parent.OwnerDocument.CreateTextNode(value));
            return result;
        }

        public static XmlElement AddTag(this XmlElement parent, string name, string value)
        {
            XmlElement result = (XmlElement)parent.AppendChild(parent.OwnerDocument.CreateElement(name, Xmlns_xhtml));
            if (value == null)
                result.IsEmpty = true;
            else
                result.AppendChild(parent.OwnerDocument.CreateTextNode(value));
            return result;
        }

        public static XmlElement AddTag(this XmlElement parent, string name, int value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, Guid value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, double value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, DateTime value, XmlDateTimeSerializationMode dateTimeOption) { return _AddTag(parent, name, XmlConvert.ToString(value, dateTimeOption)); }

        public static XmlElement AddTag(this XmlElement parent, string name, DateTime value) { return _AddTag(parent, name, XmlConvert.ToString(value, XmlDateTimeSerializationMode.Local)); }

        public static XmlElement AddTag(this XmlElement parent, string name, sbyte value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, short value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, char value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, byte value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, ushort value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, uint value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, ulong value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, float value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, TimeSpan value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }

        public static XmlElement AddTag(this XmlElement parent, string name, long value) { return _AddTag(parent, name, XmlConvert.ToString(value)); }
        
        private static XmlElement _AddText(XmlElement element, string value)
        {
            element.AppendChild(element.OwnerDocument.CreateTextNode(value));
            return element;
        }

        public static XmlElement AddText(this XmlElement parent, string value, bool asCData)
        {
            if (value == null)
                return parent;
            if (value.Length > 0)
            {
                if (asCData)
                    parent.AppendChild(parent.OwnerDocument.CreateCDataSection(value));
                else
                    return _AddText(parent, value);
            }
            else if (parent.IsEmpty)
                parent.InnerText = value;
            return parent;
        }

        public static XmlElement AddText(this XmlElement element, string value) { return AddText(element, value, false); }

        public static XmlElement AddText(this XmlElement element, int value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, Guid value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, double value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, DateTime value, XmlDateTimeSerializationMode dateTimeOption) { return _AddText(element, XmlConvert.ToString(value, dateTimeOption)); }

        public static XmlElement AddText(this XmlElement element, DateTime value) { return _AddText(element, XmlConvert.ToString(value, XmlDateTimeSerializationMode.Local)); }

        public static XmlElement AddText(this XmlElement element, sbyte value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, short value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, char value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, byte value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, ushort value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, uint value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, ulong value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, float value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, TimeSpan value) { return _AddText(element, XmlConvert.ToString(value)); }

        public static XmlElement AddText(this XmlElement element, long value) { return _AddText(element, XmlConvert.ToString(value)); }

        private static XmlElement _AddAttribute(this XmlElement element, string name, string value)
        {
            XmlAttribute attribute = element.Attributes[name];
            if (attribute == null)
                element.Attributes.Append(element.OwnerDocument.CreateAttribute(name)).Value = value;
            else
                attribute.Value = value;
            return element;
        }

        public static XmlElement AddAttribute(this XmlElement element, string name, string value)
        {
            XmlAttribute attribute = element.Attributes[name];
            if (attribute == null)
            {
                if (value != null)
                    element.Attributes.Append(element.OwnerDocument.CreateAttribute(name)).Value = value;
            }
            else if (value == null)
                element.Attributes.Remove(attribute);
            else
                attribute.Value = value;
            return element;
        }

        public static XmlElement AddAttribute(this XmlElement element, string name, int value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, Guid value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, double value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, DateTime value, XmlDateTimeSerializationMode dateTimeOption) { return _AddAttribute(element, name, XmlConvert.ToString(value, dateTimeOption)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, DateTime value) { return _AddAttribute(element, name, XmlConvert.ToString(value, XmlDateTimeSerializationMode.Local)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, sbyte value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, short value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, char value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, byte value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, ushort value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, uint value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, ulong value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, float value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, TimeSpan value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }

        public static XmlElement AddAttribute(this XmlElement element, string name, long value) { return _AddAttribute(element, name, XmlConvert.ToString(value)); }
    }
}
'@

Add-Type -Path 'C:\Users\lerwi\GitHub\MyGitHubPages\bin\MyGitHubPages.dll' -ErrorAction Stop;

$ContentIndex = [MyGitHubPages.ContentIndex]::new([System.IO.DirectoryInfo]::new(($PSScriptRoot | Join-Path -ChildPath '..\gh-pages')), 'images');
$ContentIndex.Crawl() | ForEach-Object {
    $_.SourcePath;
    $_.Crawl() | ForEach-Object {
        $_.SourcePath;
        $_.Crawl() | ForEach-Object { $_.SourcePath }
    }
}