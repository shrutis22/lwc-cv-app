import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getReferences from "@salesforce/apex/ResumeAPI.getReferences";

export default class ResumeReferences extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track references;

    constructor() {
        super();
        this.references = [];
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    @wire(
        getReferences,
        {
            recordId: "$recordId"
        }
    )
    queryReferences( { data, error } ) {
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
        else if( data ) {
            if( !data.length ) {
                this.references = [];
                this.status = {
                    hasError: true,
                    errorMessage: "Reference(s) are missing.",
                    errorIs406: true
                };
            }
            else {
                this.references = data;
                this.status = {
                    hasError: false
                };
            }
        }
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordRelationshipPage",
                attributes: {
                    recordId: this.recordId,
                    relationshipApiName: "References__r",
                    actionName: "view"
                }
            }
        );
    }
}