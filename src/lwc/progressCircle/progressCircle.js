import { LightningElement, api } from "lwc";

const RADIUS = 35;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default class ProgressCircle extends LightningElement {
    @api value;
    @api label;

    renderedCallback() {
        this.setProgress( parseInt( this.value, 10 ) );
    }
        
    setProgress( value ) {
        let progress = value / 100;
        let dashoffset = CIRCUMFERENCE * ( 1 - progress );
        
        let progressValue = this.template.querySelector( ".progress__value" );

        progressValue.style.strokeDasharray = CIRCUMFERENCE;
        progressValue.style.strokeDashoffset = dashoffset;
    }
}