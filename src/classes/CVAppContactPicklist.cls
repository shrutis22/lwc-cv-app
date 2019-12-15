global class CVAppContactPicklist extends VisualEditor.DynamicPickList {
    global override VisualEditor.DataRow getDefaultValue() {
        return NULL;
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        List<Contact> contacts = new List<Contact>();

        contacts = [
            SELECT  Id
                    ,Name
            FROM    Contact
            WHERE   UID__c != NULL
            LIMIT   10
        ];

        if( !contacts.isEmpty() ) {
            VisualEditor.DynamicPickListRows rows = new VisualEditor.DynamicPickListRows();

            for( Contact con : contacts ) {
                rows.addRow( new VisualEditor.DataRow( con.Name, String.valueOf( con.Id ) ) );
            }

            return rows;
        }

        return NULL;
    }
}