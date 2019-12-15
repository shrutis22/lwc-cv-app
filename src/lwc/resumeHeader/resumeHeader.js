import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { SAMPLE_DATA } from "./sampleData.js";
import loadSampleData from "@salesforce/apex/ResumeAPI.loadSampleData";

export default class ResumeHeader extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track contact;

    constructor() {
        super();
        this.contact = {};
        this.status = {
            hasError: false,
            errorMessage: null,
            errorIs404: false
        };
    }

    @wire(
        getRecord,
        {
            recordId: "$recordId",
            fields: [
                "Contact.Name",
                "Contact.Title"
            ]
        }
    )
    queryContact( { error, data } ) {
        if( !this.recordId ) {
            this.status = {
                hasError: true,
                errorMessage: "Please specify the Id of the Contact.",
                errorIs404: true
            };
        }        
        else if( error ) {
            this.status = {
                hasError: true,
                errorMessage: error ? `${ error.status } | ${ error.statusText }` :
                    "An unexpected error has occurred.",
                    errorIs404: error ? error.status === 404 : false
            };
        }
        else {
            this.contact = {
                name: data.fields.Name.value,
                title: data.fields.Title.value
            };
            
            if( !this.contact.name ||
                !this.contact.title
            ) {
                this.status = {
                    hasError: true,
                    errorMessage: "Name / Title is missing.",
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

    load() {
        loadSampleData(
            {
                data: SAMPLE_DATA
            }
        ).then( ( result ) => {
            if( result.isSuccess ) {
                this.dispatchEvent(
                    new ShowToastEvent(
                        {
                            title: "Success",
                            message: result.message,
                            variant: "success"
                        }
                    )
                );
            }
            else {
                this.dispatchEvent(
                    new ShowToastEvent(
                        {
                            title: "Error",
                            message: result.message,
                            variant: "error"
                        }
                    )
                );
            }
        } ).catch( ( error ) => {
            this.dispatchEvent(
                new ShowToastEvent(
                    {
                        title: "Error",
                        message: error.message,
                        variant: "error"
                    }
                )
            );
        } );
    }
}