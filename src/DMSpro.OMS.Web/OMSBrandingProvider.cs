using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace DMSpro.OMS.Web;

[Dependency(ReplaceServices = true)]
public class OMSBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "OMS";
}
