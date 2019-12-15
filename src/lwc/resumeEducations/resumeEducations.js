import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getEducations from "@salesforce/apex/ResumeAPI.getEducations";

const COLS = [
    { label: "Course",       fieldName: "Name",              type: "text"   },
    { label: "School Name",  fieldName: "School_Name__c",    type: "text"   },
    { label: "Duration",     fieldName: "Duration__c",       type: "text"   },
    { label: "GPA",          fieldName: "GPA__c",            type: "number" }
];

export default class ResumeEducations extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @api columns;
    @track educations;

    constructor() {
        super();
        this.columns = COLS;
        this.educations = [];
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    @wire(
        getEducations,
        {
            recordId: "$recordId"
        }
    )
    queryEducations( { error, data } ) {
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
                this.educations = [];
                this.status = {
                    hasError: true,
                    errorMessage: "Education(s) are missing.",
                    errorIs406: true
                };
            }
            else {
                this.educations = data;
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
                    relationshipApiName: "Educations__r",
                    actionName: "view"
                }
            }
        );
    }
}