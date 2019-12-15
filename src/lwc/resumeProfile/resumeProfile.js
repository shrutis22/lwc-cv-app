import { LightningElement, api, wire, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getRecord } from "lightning/uiRecordApi";

export default class ResumeProfile extends NavigationMixin(LightningElement) {
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
                "Contact.Photo_URL__c",
                "Contact.Profile__c"
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
                photoURL: data.fields.Photo_URL__c.value,
                profile: data.fields.Profile__c.value
            };
            
            if( !this.contact.photoURL ||
                !this.contact.profile
            ) {
                this.status = {
                    hasError: true,
                    errorMessage: "Photo URL / Profile is missing.",
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