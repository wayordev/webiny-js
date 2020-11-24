import { TogglePluginActionArgsType } from "./types";
import { EventActionCallableType } from "@webiny/app-page-builder/editor/recoil/eventActions";
import { plugins } from "@webiny/plugins";

export const togglePluginAction: EventActionCallableType<TogglePluginActionArgsType> = (
    state,
    meta,
    args
) => {
    const { name, params = {}, closeOtherInGroup = false } = args;
    const plugin = plugins.byName(name);
    if (!plugin) {
        throw new Error(`There is no plugin with name "${name}".`);
    }
    const { plugins: pluginsAtomValue } = state;
    const activePluginsByType = pluginsAtomValue[plugin.type] || [];
    const isAlreadyActive = activePluginsByType.some(pl => pl.name === name);

    let newPluginsList;
    if (isAlreadyActive) {
        newPluginsList = activePluginsByType.filter(pl => pl.name !== name);
    } else if (closeOtherInGroup) {
        newPluginsList = [{ name, params }];
    } else {
        newPluginsList = activePluginsByType.concat([{ name, params }]);
    }

    return {
        state: {
            plugins: {
                ...pluginsAtomValue,
                [plugin.type]: newPluginsList
            }
        }
    };
};
