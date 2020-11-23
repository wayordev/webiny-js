import React from "react";
import { Cell } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { validation } from "@webiny/validation";
import { i18n } from "@webiny/app/i18n";
import {
    SecurityInstallationFormPlugin,
    SecurityUserAccountFormPlugin,
    SecurityUserFormPlugin
} from "@webiny/app-security-tenancy/types";

const t1 = i18n.ns("cognito/user-management/installation-form");
const t2 = i18n.ns("cognito/user-management/user-account-form");
const t3 = i18n.ns("cognito/user-management/user-form");

export default () => [
    {
        type: "security-installation-form",
        render({ Bind }) {
            return (
                <Cell span={12}>
                    <Bind name="password" validators={validation.create("required")}>
                        <Input autoComplete="off" type="password" label={t1`Password`} />
                    </Bind>
                </Cell>
            );
        }
    } as SecurityInstallationFormPlugin,
    {
        type: "security-user-account-form",
        render({ Bind, data }) {
            return (
                <Cell span={12}>
                    <Bind name="password">
                        <Input
                            autoComplete="off"
                            description={data.id && t2`Type a new password to reset it.`}
                            type="password"
                            label={t2`Password`}
                        />
                    </Bind>
                </Cell>
            );
        }
    } as SecurityUserAccountFormPlugin,
    {
        type: "security-user-form",
        render({ Bind, data }) {
            return (
                <Cell span={12}>
                    <Bind
                        name="password"
                        validators={data.id ? undefined : validation.create("required")}
                    >
                        <Input
                            autoComplete="off"
                            description={data.id && t3`Type a new password to reset it.`}
                            type="password"
                            label={t3`Password`}
                        />
                    </Bind>
                </Cell>
            );
        }
    } as SecurityUserFormPlugin
];
