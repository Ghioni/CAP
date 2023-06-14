using {sap} from '@sap/cds/common';
namespace prova.db;

entity tabellaProva{
    key Id  : Int16;
        Name: String(50);
        Date: Timestamp;       
}

entity secondaTabelle{
    key Id : Int16;
        Username: String(50);
        Password: String(50);
        Email: String(50);
}

entity utenti{
    key Id : Int16;
    Username: String(50);
    Name: String(50);
    Surname: String(50);
}