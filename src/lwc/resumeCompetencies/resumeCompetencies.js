import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { loadScript } from "lightning/platformResourceLoader";
import CHART_JS from "@salesforce/resourceUrl/ChartJS";
import getCompetencies from "@salesforce/apex/ResumeAPI.getCompetencies";

export default class ResumeCompetencies extends NavigationMixin(LightningElement) {
    @api recordId;
    @api showActions;
    @track status;

    @track chartData;
    competencyChart;

    constructor() {
        super();
        this.chartData = {};
        this.competencyChart = {};
        this.status = {
            hasError: false,
            errorMessage: null
        };
    }

    renderedCallback() {
        loadScript( this, CHART_JS ).then( () => {
            this.queryCompetencies();
        } ).catch( ( error ) => {
                this.status = {
                    hasError: true,
                    errorMessage: `Error Loading Plugin: Chart JS ${ JSON.stringify( error ) }.
                        Please re-load the page.`
                };
            }
        );
    }

    queryCompetencies() {
        getCompetencies( {
            recordId: this.recordId
        } ).then( ( data ) => {
                if( !this.recordId ) {
                    this.status = {
                        hasError: true,
                        errorMessage: "Please specify the Id of the Contact."
                    };
                }
                else if( data ) {
                    if( !data.length ) {
                        this.status = {
                            hasError: true,
                            errorMessage: "Competencies are missing.",
                            errorIs406: true
                        };
                    }
                    else {
                        let numbers = [];
                        let labels = [];
            
                        data.forEach( competency => {
                            numbers.push( competency.Score__c );
                            labels.push( competency.Name );
                        } );
            
                        this.chartData = {
                            datasets: [ {
                                data: numbers
                            } ],
                            labels: labels
                        };
            
                        this.drawChart();
                    }
                }
            }
        );
    }

    drawChart() {
        this.competencyChart = new window.Chart(
            this.template.querySelector( "canvas" ), {
                type: "doughnut",
                data: this.chartData,
                options: {
                    plugins: {
                        colorschemes: {
                            scheme: "brewer.Spectral11"
                        }
                    },
                    responsive: false,
                    legend: {
                        position: "right"
                    }
                }
            }
        );
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordRelationshipPage",
                attributes: {
                    recordId: this.recordId,
                    relationshipApiName: "Competencies__r",
                    actionName: "view"
                }
            }
        );
    }
}