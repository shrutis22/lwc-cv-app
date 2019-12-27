import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { SAMPLE_DATA } from "./sampleData.js";
import loadSampleData from "@salesforce/apex/ResumeAPI.loadSampleData";

import NAME from "@salesforce/schema/Contact.Name";
import FIRST_NAME from "@salesforce/schema/Contact.FirstName";
import LAST_NAME from "@salesforce/schema/Contact.LastName";
import TITLE from "@salesforce/schema/Contact.Title";

export default class ResumeHeader extends LightningElement {
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
            errorMessage: null,
            errorIs404: false
        };

        this.openEditDialog = false;
        this.editableFields = [FIRST_NAME, LAST_NAME, TITLE];
    }

    @wire(getRecord, {
        recordId: "$recordId",
        fields: [NAME, TITLE]
    })
    queryContact({ error, data }) {
        if (!this.recordId) {
            this.status = {
                hasError: true,
                errorMessage: "Please specify the Id of the Contact.",
                errorIs404: true
            };
        } else if (error) {
            this.status = {
                hasError: true,
                errorMessage: error
                    ? `${error.status} | ${error.statusText}`
                    : "An unexpected error has occurred.",
                errorIs404: error ? error.status === 404 : false
            };
        } else {
            this.contact = {
                name: data.fields.Name.value,
                title: data.fields.Title.value
            };

            if (!this.contact.name || !this.contact.title) {
                this.status = {
                    hasError: true,
                    errorMessage: "Name / Title is missing.",
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

    load() {
        loadSampleData({
            data: SAMPLE_DATA
        })
            .then(result => {
                if (result.isSuccess) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            message: result.message,
                            variant: "success"
                        })
                    );
                } else {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error",
                            message: result.message,
                            variant: "error"
                        })
                    );
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error",
                        message: error.message,
                        variant: "error"
                    })
                );
            });
    }
}