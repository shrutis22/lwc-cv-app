import { LightningElement, api, track, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import getCertifications from "@salesforce/apex/ResumeAPI.getCertifications";

export default class ResumeCertifications extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track certifications;
    @track totalTrailheadBadges;
    
    constructor() {
        super();
        this.certifications = [];
        this.totalTrailheadBadges = null;
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
                "Contact.Total_Trailhead_Badges__c"
            ]
        }
    )
    queryContact( { data, error } ) {
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
            if( !data.fields.Total_Trailhead_Badges__c.value ) {
                this.status = {
                    hasError: true,
                    errorMessage: "Trailhead Total Badge(s) Count is missing.",
                    errorIs406: true
                };
            }
            else {
                this.totalTrailheadBadges = 
                    `${ data.fields.Total_Trailhead_Badges__c.value } Badge(s)`;
                
                this.status = {
                    hasError: false
                };

                this.queryCertifications();
            }
        }
    }

    queryCertifications() {
        getCertifications(
            {
                recordId: this.recordId
            }
        ).then( ( result ) => {
            if( result ) {
                if( !result.length ) {
                    this.certifications = [];
                    this.status = {
                        hasError: true,
                        errorMessage: "Certifications are missing.",
                        errorIs406: true
                    };
                }
                else {
                    this.certifications = result;                    
                    this.status = {
                        hasError: false
                    };
                }
            }
        } ).catch( ( error ) => {
            this.status = {
                hasError: true,
                errorMessage: error ? `${ error.status } | ${ error.statusText }` :
                    "An unexpected error has occurred."
            };
        } );
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordRelationshipPage",
                attributes: {
                    recordId: this.recordId,
                    relationshipApiName: "Certifications__r",
                    actionName: "view"
                }
            }
        );
    }
}