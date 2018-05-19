import System.Runtime.CompilerServices;
import System.Runtime.InteropServices;

[assembly: AssemblyTitleAttribute('Test"Product')]
[ assembly: AssemblyDescriptionAttribute('escape\'this"')]
[assembly:AssemblyConfigurationAttribute("")]
  [assembly: AssemblyCompanyAttribute( "")]
[assembly: AssemblyProductAttribute("TestProduct" )]
[assembly: AssemblyCopyrightAttribute("Copyright © TestCompany 2017") ]
[   assembly: AssemblyTrademarkAttribute ("")
]
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
