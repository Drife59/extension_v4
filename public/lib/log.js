/*
Projet Corail
Auteur: Benjamin GRASSART
Année: 2018

log.js

Personnalise js log, to enable filter on logging.
The reference librairie for another logging system is: 
http://log4javascript.org/docs/quickstart.html

One day use it ? 
*/


var CODE_FRONT = "Front";
var CODE_HEURISTIC = "Heurisitic";
var CODE_FRONT_DB = "FrontDB";
var CODE_LOAD = "OnLoad";
var CODE_CHANGE = "OnChange";

class Logger{
    //Enable logger regarding conf
    constructor(type_logger){
        this.type_logger = type_logger;
        if(type_logger == CODE_HEURISTIC && enable_heuristic_log){
            this.enabled = true;
        }else if (type_logger == CODE_FRONT_DB && enable_front_db_log){
            this.enabled = true;
        }else if (type_logger == CODE_LOAD && enable_load_log){
            this.enabled = true;
        }else if (type_logger == CODE_CHANGE && enable_change_log){
            this.enabled = true;
        }
    }
    //Encapsulate all log method

    log(message){
        if(this.enabled == true)
            console.log(message);
    }

    info(message){
        if(this.enabled == true)
            console.info(message);
    }

    warn(message){
        if(this.enabled == true)
            console.warn(message);
    }

    //Always display error message 
    error(message){
        console.error(message);
    }
}

FrontLogger = new Logger(CODE_FRONT);
