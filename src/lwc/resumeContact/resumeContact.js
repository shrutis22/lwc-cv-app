import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";

import EMAIL from "@salesforce/schema/Contact.Email";
import PHONE from "@salesforce/schema/Contact.MobilePhone";
import FORMATTED_ADDRESS from "@salesforce/schema/Contact.Formatted_Address__c";
import STREET from "@salesforce/schema/Contact.MailingStreet";
import CITY from "@salesforce/schema/Contact.MailingCity";
import STATE from "@salesforce/schema/Contact.MailingState";
import COUNTRY from "@salesforce/schema/Contact.MailingCountry";
import POSTAL_CODE from "@salesforce/schema/Contact.MailingPostalCode";

export default class ResumeContact extends LightningElement {
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
        this.editableFields = [
            STREET,
            CITY,
            STATE,
            COUNTRY,
            POSTAL_CODE,
            EMAIL,
            PHONE
        ];
    }

    @wire(getRecord, {
        recordId: "$recordId",
        fields: [EMAIL, PHONE, FORMATTED_ADDRESS]
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
                email: data.fields.Email.value,
                phone: data.fields.MobilePhone.value,
                address: data.fields.Formatted_Address__c.value
            };

            if (
                !this.contact.email ||
                !this.contact.phone ||
                !this.contact.address
            ) {
                this.status = {
                    hasError: true,
                    errorMessage: "Email / Phone / Address is missing.",
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