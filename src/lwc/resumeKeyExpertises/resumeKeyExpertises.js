import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getKeyExpertises from "@salesforce/apex/ResumeAPI.getKeyExpertises";

export default class ResumeKeyExpertises extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track keyExpertises;

    constructor() {
        super();
        this.keyExpertises = [];
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }
    
    @wire(
        getKeyExpertises,
        {
            recordId: "$recordId"
        }
    )
    queryKeyExpertises( { error, data } ) {
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
                this.keyExpertises = [];
                this.status = {
                    hasError: true,
                    errorMessage: "Key Expertise(s) are missing.",
                    errorIs406: true
                };
            }
            else {
                this.keyExpertises = data;
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
                    relationshipApiName: "Key_Expertises__r",
                    actionName: "view"
                }
            }
        );
    }
}