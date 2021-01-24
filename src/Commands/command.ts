// Dependencies
import { commands } from "..";

// Commands Class
export class Commands {
    // Vars
    commands: Array<Command> = [];

    // Add a command
    new(command: Command){
        if (command != undefined){
            this.commands.push(command);
            console.log(`[+] Added command: ${command.name}`);
        };     
    };

    // Resolve command
    resolve(commandName: string){
        var returnValue: Command | undefined = undefined;

        for (const command of this.commands){
            if (command.name == commandName){
                returnValue = command;
            };
        };

        return returnValue;
    };

    // Check if command exists
    exists(commandName: string){
        return this.resolve(commandName) != null;
    };
}

// Command Class
export class Command {
    // Vars
    name: string;
    execute: Function;

    // Constructor
    constructor(name: string, execute: Function){
        this.name = name;
        this.execute = execute;

        commands.new(this);
    }
};