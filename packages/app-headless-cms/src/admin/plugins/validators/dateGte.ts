import { validation } from "@webiny/validation";
import { CmsModelFieldValidatorPlugin } from "@webiny/app-headless-cms/types";

export default (): CmsModelFieldValidatorPlugin => ({
    type: "cms-model-field-validator",
    name: "cms-model-field-validator-date-gte",
    validator: {
        name: "dateGte",
        validate: (value, validator) => {
            const gteValue = validator.settings.value;
            if (typeof gteValue === "undefined") {
                return;
            }
            return validation.validate(value, `dateGte:${gteValue}`);
        }
    }
});