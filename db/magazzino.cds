namespace magazzino;

using {Country} from '@sap/cds/common';

type Varchar           : String(100);
type SDate             : DateTime;
type Bolla             : Boolean;
type Messaggio         : String(1000);
type email             : String(40);
type Descrizioneflusso : String(50);
type Varbinary         : Binary(1);
type Id                : UUID;
type cid               : Integer;

entity Anagrafica_Materiale {
    key ID         : Integer;
        Materiale  : Varchar not null;
        Ubicazione : Varchar not null;
        Quantita   : Varchar not null;
};

entity Anagrafica_Magazzino {
    key ID        : Integer;
        Indirizzo : Country;

};

entity TipoSpesaSet {
    key ID                  : Integer;
        TIPO_SPESA          : Varchar not null;
        RIMBORSO            : Association to RimborsoSet;
        VISIBILITA          : Varchar not null;
        PAGATO_AZIENDA      : Varbinary;
        LIMITE_MAX          : Integer not null;
        CHIAVE_TRASFERTA    : Varchar not null;
        FATTURABILITA_SPESA : Varchar;

};

entity RimborsoSet {
    key ID_RIMBORSO      : Integer;
        TIPO_VEICOLO     : Varchar not null;
        KM               : Varchar not null;
        IMPORTO          : Varchar not null;
        CHIAVE_TRASFERTA : Varchar not null;

};

entity ActivitySet {
    key ID              : Integer;
        CODICE_ATTIVITA : Varchar not null;
        DESCRIZIONE     : Varchar not null;
        RIMBORSO        : Association to RimborsoSet;

};
