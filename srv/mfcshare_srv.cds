using {mfcShare as db} from '../db/mfcshare';
using V_MFC from '../db/mfcshare';

@requires: 'authenticated-user'
service CatalogService @(path: '/CatalogService') {

  entity Anagrafica_Utenti        as projection on db.Anagrafica_Utenti;
  entity Anagrafica_Ruoli         as projection on db.Anagrafica_Ruoli;
  entity Anagrafica_Flussi        as projection on db.Anagrafica_Flussi;
  entity Anagrafica_Moduli        as projection on db.Anagrafica_Moduli;
  entity Anagrafica_Errori        as projection on db.Anagrafica_Errori;
  entity Anagrafica_Stato_Errori  as projection on db.Anagrafica_Stato_Errori;
  entity Anagrafica_Utente_Flusso as projection on db.Anagrafica_Utente_Flusso;

  @readonly
  entity V_Mfc                    as projection on V_MFC;
}
