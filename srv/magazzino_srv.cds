using {magazzino as db} from '../db/magazzino';
service CatalogService @(path:'/CatalogService') {

   entity Anagrafica_Utenti as projection on db.Anagrafica_Utenti;
   entity TipoSpesaSet as projection on db.TipoSpesaSet;
   entity RimborsoSet as projection on db.RimborsoSet;
   entity ActivitySet as projection on db.ActivitySet;
}