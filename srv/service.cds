using { prova.db as myDataDB } from '../db/schema';

service DavidService{
    entity DavidTabellaProva as projection on myDataDB.tabellaProva;
    entity UserTable as projection on myDataDB.utenti;
}

service secondService{
     entity SecondaTabella as projection on myDataDB.secondaTabelle;
}