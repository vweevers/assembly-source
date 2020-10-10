using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

[assembly: AssemblyTitle("ModifiedTitle")]
[ assembly: AssemblyDescription('escape\'this"')]
[assembly:AssemblyConfiguration("")]
  [assembly: AssemblyCompany("ModifiedCompany")]
[assembly: AssemblyProduct("TestProduct" )]
[assembly: AssemblyCopyright("Copyright © TestCompany 2017") ]
[assembly: AssemblyTrademark("ModifiedTrademark")]
[
    assembly: AssemblyCulture(""
)]
[assembly: SuppressIldasm]

// Boolean
[assembly: ComVisible(false)]

// Attributes in comments are igored
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.0.0")]

// In fact any other type of statement is ignored
#if DEBUG
  [assembly: InternalsVisibleTo("FooBar")]
#endif
[assembly: NewAttrA(true)]
[assembly: NewAttrB("beep")]
