import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from "@jupyterlab/application";
import { ICommandPalette } from "@jupyterlab/apputils";
import { ILauncher } from "@jupyterlab/launcher";
import { Widget } from "@lumino/widgets";
import { GLUE_DATABREW_RENDER } from "./constants";
import { LeftSideLauncher } from "./LeftSideLauncher";
import { MainLauncher } from "./MainLauncher";

/**
 * Initialize the console widget extension
 */
export const initiateExtension = (
  getPaths: (region: string) => Promise<string[]>
): JupyterFrontEndPlugin<void> => {
  const activate = async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer,
    launcher: ILauncher
  ) => {
    const consoleWidget = MainLauncher.create();

    app.commands.addCommand(GLUE_DATABREW_RENDER, {
      label: "Launch MLFlow",
      icon: "jp-databrew-logo",
      execute: () => {
        if (!consoleWidget.isAttached) {
          app.shell.add(consoleWidget as Widget, "main");

          const iframe = document.createElement("iframe");

          // TODOs: do not hard code - make it dynamic
          iframe.setAttribute("src", "https://rp24ujrrrb.execute-api.eu-central-1.amazonaws.com/");
          iframe.setAttribute("width", "1600");
          iframe.setAttribute("height", "800");
          iframe.setAttribute("allowfullscreen", "");
          consoleWidget.consoleRoot.appendChild(iframe);
        }
        app.shell.activateById(consoleWidget.id);
      },
    });

    const launcherWidget = LeftSideLauncher.create(app.commands);

    restorer.add(launcherWidget as Widget, launcherWidget.id);
    app.shell.add(launcherWidget as Widget, "left");

    // Add the command to the palette.
    palette.addItem({ command: GLUE_DATABREW_RENDER, category: "Launcher" });
    if (launcher) {
      const launcher_item: ILauncher.IItemOptions = {
        command: GLUE_DATABREW_RENDER,
        args: {
          newBrowserTab: true,
          title: "Launch MLFlow",
          id: "databrew-launcher",
        },
        category: "Other",
      };

      launcher.add(launcher_item);
    }
  };

  const extension: JupyterFrontEndPlugin<void> = {
    id: "aws_glue_databrew_jupyter",
    autoStart: true,
    requires: [ICommandPalette, ILayoutRestorer, ILauncher],
    activate: activate,
  };

  return extension;
};
