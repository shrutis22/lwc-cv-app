import { LightningElement, api } from "lwc";

export default class Award extends LightningElement {
    @api awardIcon;
    @api awardTitle;
    @api awardSubtitle;
}