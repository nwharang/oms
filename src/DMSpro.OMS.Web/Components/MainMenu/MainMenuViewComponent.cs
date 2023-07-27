using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonX.Navigation;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonX.Themes.LeptonX.Components;

namespace DMSpro.OMS.Web.Components.Components.MainMenu;

public class MainMenuViewComponent : LeptonXViewComponentBase
{
    protected MenuViewModelProvider MenuViewModelProvider { get; }

    public MainMenuViewComponent(MenuViewModelProvider menuViewModelProvider)
    {
        MenuViewModelProvider = menuViewModelProvider;
    }

    public virtual async Task<IViewComponentResult> InvokeAsync()
    {
        var viewModel = await MenuViewModelProvider.GetMenuViewModelAsync();

        return View(
			"/Components/MainMenu/Default.cshtml",
            viewModel
        );
    }
}
