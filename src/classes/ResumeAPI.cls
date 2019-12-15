public with sharing class ResumeAPI {
    public class Response {
        @AuraEnabled public Boolean isSuccess;
        @AuraEnabled public String message;
        @AuraEnabled public Object data;

        public Response( Boolean isSuccess, String message, Object data ) {
            this.isSuccess = isSuccess;
            this.message = message;
            this.data = data;
        }
    }

    public class Resume {
        @AuraEnabled public Contact basicInfo;
        @AuraEnabled public List<Reference__c> references;
        @AuraEnabled public List<Key_Expertise__c> keyExpertises;
        @AuraEnabled public List<Education__c> educations;
        @AuraEnabled public List<Social_Handle__c> socialHandles;
        @AuraEnabled public List<Competency__c> competencies;
        @AuraEnabled public List<Certification__c> certifications;
        @AuraEnabled public List<Trailhead_Superbadge__c> trailheadSuperbadges;
        @AuraEnabled public List<Work_Experience__c> workExperiences;
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Social_Handle__c> getSocialHandles( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Social_Handle__c> records = new List<Social_Handle__c>();

            records = [
                SELECT  Name
                        ,Handle_Link__c
                        ,Handle_Icon__c
                FROM    Social_Handle__c
                WHERE   Contact__c = :recordId
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Social_Handle__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Trailhead_Superbadge__c> getFavSuperbadge( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Trailhead_Superbadge__c> records = new List<Trailhead_Superbadge__c>();

            records = [
                SELECT  Name
                        ,Superbadge_Image__c
                        ,Superbadge_Description__c
                        ,Superbadge_Link__c
                FROM    Trailhead_Superbadge__c
                WHERE   Contact__c = :recordId AND
                        Favourite__c = TRUE
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Trailhead_Superbadge__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Key_Expertise__c> getKeyExpertises( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Key_Expertise__c> records = new List<Key_Expertise__c>();

            records = [
                SELECT      Name
                            ,Score__c
                FROM        Key_Expertise__c
                WHERE       Contact__c = :recordId
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Key_Expertise__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Reference__c> getReferences( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Reference__c> records = new List<Reference__c>();

            records = [
                SELECT  Name
                        ,Company__c
                        ,MailTo__c
                        ,Relationship__c
                        ,Photo_URL__c
                FROM    Reference__c
                WHERE   Contact__c = :recordId
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Reference__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Certification__c> getCertifications( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Certification__c> records = new List<Certification__c>();

            records = [
                SELECT      Name
                            ,Release__c
                FROM        Certification__c
                WHERE       Contact__c = :recordId
                ORDER BY    Order__c ASC
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Certification__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Work_Experience__c> getWorkExperiences( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Work_Experience__c> records = new List<Work_Experience__c>();

            records = [
                SELECT      Name
                            ,Company__c
                            ,Duration__c
                            ,Responsibilities__c
                FROM        Work_Experience__c
                WHERE       Contact__c = :recordId
                ORDER BY    Order__c ASC
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Work_Experience__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Education__c> getEducations( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Education__c> records = new List<Education__c>();

            records = [
                SELECT      Name
                            ,School_Name__c
                            ,Duration__c
                            ,GPA__c
                FROM        Education__c
                WHERE       Contact__c = :recordId
                ORDER BY    Order__c ASC
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Education__c>();
    }

    @AuraEnabled( cacheable = TRUE )
    public static List<Competency__c> getCompetencies( String recordId ) {
        if( !String.isBlank( recordId ) ) {
            List<Competency__c> records = new List<Competency__c>();

            records = [
                SELECT      Name
                            ,Score__c
                FROM        Competency__c
                WHERE       Contact__c = :recordId
            ];

            if( !records.isEmpty() ) {
                return records;
            }
        }

        return new List<Competency__c>();
    }

    @AuraEnabled( cacheable = FALSE )
    public static Response loadSampleData( String data ) {
        try {
            String jsonStr = EncodingUtil.base64Decode( data ).toString();

            Resume cv = ( Resume ) JSON.deserialize(
                jsonStr,
                Resume.class
            );

            Contact con = cv.basicInfo;
            con.UID__c = 1;

            Contact conRef = new Contact( UID__c = 1 );

            for( Reference__c ref : cv.references ) {
                ref.Contact__r = conRef;
            }

            for( Key_Expertise__c keyExp : cv.keyExpertises ) {
                keyExp.Contact__r = conRef;
            }

            for( Education__c edu : cv.educations ) {
                edu.Contact__r = conRef;
            }

            for( Social_Handle__c soc : cv.socialHandles ) {
                soc.Contact__r = conRef;
            }

            for( Competency__c comp : cv.competencies ) {
                comp.Contact__r = conRef;
            }

            for( Certification__c cert : cv.certifications ) {
                cert.Contact__r = conRef;
            }

            for( Trailhead_Superbadge__c th : cv.trailheadSuperbadges ) {
                th.Contact__r = conRef;
                th.Favourite__c = TRUE;
            }

            for( Work_Experience__c exp : cv.workExperiences ) {
                exp.Contact__r = conRef;
            }

            List<SObject> records = new List<SObject>();
            records.add( con );
            records.addAll( ( List<SObject> ) cv.references );
            records.addAll( ( List<SObject> ) cv.keyExpertises );
            records.addAll( ( List<SObject> ) cv.educations );
            records.addAll( ( List<SObject> ) cv.socialHandles );
            records.addAll( ( List<SObject> ) cv.competencies );
            records.addAll( ( List<SObject> ) cv.certifications );
            records.addAll( ( List<SObject> ) cv.trailheadSuperbadges );
            records.addAll( ( List<SObject> ) cv.workExperiences );

            INSERT records;

            return new Response( TRUE, 'Sample data has been loaded successfully.', NULL );
        }
        catch( Exception ex ) {
            return new Response( FALSE, 'Error - ' + ex.getMessage(), NULL );
        }
    }
}