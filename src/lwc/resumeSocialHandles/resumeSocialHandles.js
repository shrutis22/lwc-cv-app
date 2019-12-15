import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getSocialHandles from "@salesforce/apex/ResumeAPI.getSocialHandles";

export default class ResumeSocialHandles extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track socialHandles;

    constructor() {
        super();
        this.socialHandles = [];
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    @wire(
        getSocialHandles,
        {
            recordId: "$recordId"
        }
    )
    querySocialHandles( { error, data } ) {
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
                this.socialHandles = [];
                this.status = {
                    hasError: true,
                    errorMessage: "Social Handle(s) are missing.",
                    errorIs406: true
                };
            }
            else {
                this.socialHandles = data;
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
                    relationshipApiName: "Social_Handles__r",
                    actionName: "view"
                }
            }
        );
    }
}