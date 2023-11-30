const cds = require("@sap/cds");
const SequenceHelper = require("./lib/SequenceHelper");
const SequenceHelperAssociazioneUtenteFlusso = require("./lib/SequenceHelperAssociazioneUtenteFlusso");

module.exports = cds.service.impl(async (service) => {
  const db = await cds.connect.to("db");
  const { Anagrafica_Utenti } = service.entities;
  const { Anagrafica_Utente_Flusso } = service.entities;

  service.before("CREATE", Anagrafica_Utenti, async (context) => {
    const utenteId = new SequenceHelper({
      db: db,
      sequence: "UTENTE_ID",
      table: "Anagrafica_Utenti",
      field: "ID_UTENTE",
    });

    context.data.ID_UTENTE = await utenteId.getNextNumber();
  });
  
  service.before("CREATE", Anagrafica_Utente_Flusso, async (context) => {
    const assCommUtent = new SequenceHelperAssociazioneUtenteFlusso({
      db: db,
      sequence: "UTENTE_FLUSSO",
      table: "Anagrafica_Utente_Flusso",
      field: "ID_UTENTE_FLUSSO",
    });

    context.data.ID_UTENTE_FLUSSO = await assCommUtent.getNextNumber2();
  });
});
