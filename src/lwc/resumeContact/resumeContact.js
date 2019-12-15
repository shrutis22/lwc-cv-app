import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";

export default class ResumeContact extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track contact;

    constructor() {
        super();
        this.contact = {};
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }    

    @wire(
        getRecord,
        {
            recordId: "$recordId",
            fields: [
                "Contact.Email",
                "Contact.MobilePhone",
                "Contact.Formatted_Address__c"
            ]
        }
    )
    queryContact( { error, data } ) {
        if( !this.recordId ) {
            this.status = {
                hasError: true,
                errorMessage: "Please specify the Id of the Contact."
            };
        }        
        else if( error ) {
            this.status = {
                hasError: true,
                errorMessage: error ? `${ error.status } | ${ error.statusText }` :
                    "An unexpected error has occurred."
            };
        }
        else {
            this.contact = {
                email: data.fields.Email.value,
                phone: data.fields.MobilePhone.value,
                address: data.fields.Formatted_Address__c.value
            };
            
            if( !this.contact.email ||
                !this.contact.phone ||
                !this.contact.address
            ) {
                this.status = {
                    hasError: true,
                    errorMessage: "Email / Phone / Address is missing.",
                    errorIs406: true
                };
            }
            else {
                this.status = {
                    hasError: false
                };
            }
        }
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordPage",
                attributes: {
                    recordId: this.recordId,
                    actionName: "edit"
                }
            }
        );
    }
}