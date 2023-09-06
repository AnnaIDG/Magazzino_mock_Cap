const cds = require("@sap/cds");
const SequenceHelper = require("./lib/SequenceHelper");

module.exports = cds.service.impl(async (service) => {
	const db = await cds.connect.to("db");
	const { Anagrafica_Utenti } = service.entities;

	service.before("CREATE", Anagrafica_Utenti, async (context) => {
		const utenteId = new SequenceHelper({
			db: db,
			sequence: "UTENTE_ID",
			table: "Anagrafica_Utenti",
			field: "ID_UTENTE"
		});

		context.data.ID_UTENTE = await utenteId.getNextNumber();
	});
});