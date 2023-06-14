using { prova.db as myDataDB } from '../db/schema';

service secondService{
     entity SecondaTabella as projection on myDataDB.secondaTabelle;
}