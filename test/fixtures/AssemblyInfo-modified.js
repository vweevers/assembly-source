import System.Reflection;
import System.Runtime.CompilerServices;
import System.Runtime.InteropServices;

[assembly: AssemblyTitleAttribute("ModifiedTitle")]
[ assembly: AssemblyDescriptionAttribute('escape\'this"')]
[assembly:AssemblyConfigurationAttribute("")]
  [assembly: AssemblyCompanyAttribute("ModifiedCompany")]
[assembly: AssemblyProductAttribute("TestProduct" )]
[assembly: AssemblyCopyrightAttribute("Copyright © TestCompany 2017") ]
[assembly: AssemblyTrademarkAttribute("ModifiedTrademark")]
[
    assembly: AssemblyCultureAttribute(""
)]

// Boolean
[assembly: ComVisibleAttribute(false)]

// Attributes in comments are igored
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersionAttribute("1.0.0")]

// In fact any other type of statement is ignored
whatever
  [assembly: InternalsVisibleToAttribute("FooBar")]
foobar
[assembly: NewAttrAAttribute(true)]
[assembly: NewAttrBAttribute("beep")]
