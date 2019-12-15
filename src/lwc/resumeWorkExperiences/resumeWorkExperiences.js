import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getWorkExperiences from "@salesforce/apex/ResumeAPI.getWorkExperiences";

export default class ResumeWorkExperiences extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track experiences;

    constructor() {
        super();
        this.experiences = [];
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    @wire(
        getWorkExperiences,
        {
            recordId: "$recordId"
        }
    )
    queryExperiences( { error, data } ) {
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
                this.experiences = [];
                this.status = {
                    hasError: true,
                    errorMessage: "Work Experience(s) are missing.",
                    errorIs406: true
                };
            }
            else {
                this.experiences = data;
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
                    relationshipApiName: "Work_Experiences__r",
                    actionName: "view"
                }
            }
        );
    }
}