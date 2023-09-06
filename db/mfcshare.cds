//namespace mfcShare;

context mfcShare {
    type Varchar           : String(30);
    type SDate             : DateTime;
    type LText             : String(20);
    type Bolla             : Boolean;
    type Messaggio         : String(1000);
    type email             : String(40);
    type Descrizioneflusso : String(50);
    type Varbinary         : Binary(1);
    type Cid               : Integer;

    // type CHIAVE          : UUID  @odata.Type : 'Edm.Int32';
    entity Anagrafica_Utenti {
        key ID_UTENTE       : Integer;
            COGNOME_UTENTE  : Varchar not null;
            NOME_UTENTE     : Varchar not null;
            EMAIL_UTENTE    : email not null;
            ID_RUOLO        : Association to Anagrafica_Ruoli not null;
            TELEFONO_UTENTE : LText not null;
            CID             : Cid;
    };

    entity Anagrafica_Flussi {
        key ID_FLUSSO          : Integer not null;
            NOME_FLUSSO        : Varchar not null;
            DESCRIZIONE_FLUSSO : Descrizioneflusso;
            ID_MODULO          : Association to Anagrafica_Moduli not null;
    };

    entity Anagrafica_Utente_Flusso {
        key ID_UTENTE_FLUSSO : Integer not null;
            ID_UTENTE        : Association to Anagrafica_Utenti not null;
            ID_FLUSSO        : Association to Anagrafica_Flussi not null;

    };


    entity Anagrafica_Ruoli {
        key ID_RUOLO : Integer not null;
            RUOLO    : LText not null;

    };


    entity Anagrafica_Moduli {

        key ID_MODULO : Integer not null;
            MODULO    : LText not null;

    };

    entity Anagrafica_Stato_Errori {
        key ID_STATO_ERRORE : Integer not null;
            Stato_Errore    : Varchar not null;
    };

    entity Anagrafica_Errori {
        key ID_ERRORE           : Integer not null;
            ID_FLUSSO           : Association to Anagrafica_Flussi not null;
            NOME_FLUSSO         : Varchar not null;
            MESSAGGIO_ERRORE    : Messaggio not null;
            DATA_ERRORE         : SDate not null;
            ID_STATO_ERRORE     : Association to Anagrafica_Stato_Errori not null;
            ID_UTENTE           : Association to Anagrafica_Utenti;
            ID_UTENTE_TECHNICAL : Association to Anagrafica_Utenti;
            STATO_BOTTONE       : Bolla not null;
    };


}

@cds.persistence.exists
@cds.persistence.calcview
entity V_MFC {
    key ID_UTENTE           : Integer    @title: 'ID_UTENTE: ID_UTENTE';
        COGNOME_UTENTE      : String(30) @title: 'COGNOME_UTENTE: COGNOME_UTENTE';
        NOME_UTENTE         : String(30) @title: 'NOME_UTENTE: NOME_UTENTE';
        EMAIL_UTENTE        : String(40) @title: 'EMAIL_UTENTE: EMAIL_UTENTE';
        ID_FLUSSO_ID_FLUSSO : Integer    @title: 'ID_FLUSSO_ID_FLUSSO: ID_FLUSSO_ID_FLUSSO';
        NOME_FLUSSO         : String(30) @title: 'NOME_FLUSSO: NOME_FLUSSO';
        DESCRIZIONE_FLUSSO  : String(50) @title: 'DESCRIZIONE_FLUSSO: DESCRIZIONE_FLUSSO';
}
