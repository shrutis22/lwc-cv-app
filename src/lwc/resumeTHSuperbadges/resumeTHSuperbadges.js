import { LightningElement, api, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getFavSuperbadge from "@salesforce/apex/ResumeAPI.getFavSuperbadge";

export default class ResumeTHSuperbadges extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track superbadge;

    constructor() {
        super();
        this.superbadge = {};
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    @wire(
        getFavSuperbadge,
        {
            recordId: "$recordId"
        }
    )
    querySuperbadge( { error, data } ) {
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
                this.superbadge = {};
                this.status = {
                    hasError: true,
                    errorMessage: "Favourite Superbadge is missing.",
                    errorIs406: true
                };
            }
            else {
                this.superbadge = data[0];
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
                    relationshipApiName: "Trailhead_Superbadges__r",
                    actionName: "view"
                }
            }
        );
    }
}