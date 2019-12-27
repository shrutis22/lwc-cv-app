import { LightningElement, api } from "lwc";

export default class EditBasicInfo extends LightningElement {
    @api isOpened;
    @api recordId;
    @api objectApiName;
    @api fields;
    @api columns;

    handleSuccess() {
        this.close();
    }

    handleCancel() {
        this.close();
    }

    close() {
        this.isOpened = false;

        this.dispatchEvent(new CustomEvent("modalclose"));
    }
}