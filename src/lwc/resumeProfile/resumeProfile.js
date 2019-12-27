import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

import PHOTO from "@salesforce/schema/Contact.Photo__c";
import PHOTO_URL from "@salesforce/schema/Contact.Photo_URL__c";
import PROFILE from "@salesforce/schema/Contact.Profile__c";

export default class ResumeProfile extends LightningElement {
    @api recordId;
    @api showActions;
    @track status;

    @track contact;
    @track openEditDialog;

    editableFields;

    constructor() {
        super();
        this.contact = {};
        this.status = {
            hasError: false,
            errorMessage: null
        };

        this.openEditDialog = false;
        this.editableFields = [PHOTO, PHOTO_URL, PROFILE];
    }

    @wire(getRecord, {
        recordId: "$recordId",
        fields: [PHOTO_URL, PROFILE]
    })
    queryContact({ error, data }) {
        if (!this.recordId) {
            this.status = {
                hasError: true,
                errorMessage: "Please specify the Id of the Contact."
            };
        } else if (error) {
            this.status = {
                hasError: true,
                errorMessage: error
                    ? `${error.status} | ${error.statusText}`
                    : "An unexpected error has occurred."
            };
        } else {
            this.contact = {
                photoURL: data.fields.Photo_URL__c.value,
                profile: data.fields.Profile__c.value
            };

            if (!this.contact.photoURL || !this.contact.profile) {
                this.status = {
                    hasError: true,
                    errorMessage: "Photo URL / Profile is missing.",
                    errorIs406: true
                };
            } else {
                this.status = {
                    hasError: false
                };
            }
        }
    }

    handleEdit() {
        this.openEditDialog = true;
    }

    handleModalClose() {
        this.openEditDialog = false;
    }
}