import { LightningElement, api } from "lwc";

export default class WorkExp extends LightningElement {
    @api first;
    @api designation;
    @api company;
    @api duration;
    @api responsibilities;

    get applyActiveIfFirst() {
        if( this.first ) return "slds-progress__item slds-is-active";
        
        return "slds-progress__item";
    }
}