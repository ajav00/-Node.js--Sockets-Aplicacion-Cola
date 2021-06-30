const path = require('path');
const fs = require('fs'); 

class Ticket{
    constructor(numero, escritorio){
        this.numero = numero; 
        this.escritorio = escritorio;
    }
}

class TicketControl{

    constructor(){
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJSON(){
        return {
            ultimo  : this.ultimo,
            hoy     : this.hoy,
            tickets : this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    init(){
        const {hoy, ultimo, ultimos4, tickets} = require('../db/data.json');

        if(hoy === this.hoy){
            this.ultimo     = ultimo;
            this.hoy        = hoy;
            this.tickets    = tickets;
            this.ultimos4   = ultimos4;
        }
        else{ //Es otro día
            this.gurdarDB();
        }

    }

    gurdarDB(){
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJSON));
    }


    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.gurdarDB();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio){

        //No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }

        const ticket = this.tickets.shift(); //this.tickets[0];
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket);

        if(this.ultimos4.length > 4){
            this.ultimos4.splice(-1, 1);
        }

        this.gurdarDB();

        return ticket;
    }

}

module.exports = TicketControl;