import React from "react";
import ImageContainer from "./ImageContainer";
import { ElementRoot } from "@webiny/app-page-builder/render/components/ElementRoot";

const Image = ({ element }) => {
    return (
        <ElementRoot
            element={element}
            className={"webiny-pb-base-page-element-style webiny-pb-page-element-image"}
        >
            <ImageContainer elementId={element.id} />
        </ElementRoot>
    );
};

export default Image;
