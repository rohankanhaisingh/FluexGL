export namespace Debug {

    export function Log(message: string, additionalDetails?: string[]) {

        let outputString: string = `%c[INFO]: %c${message} %c`;

        additionalDetails && additionalDetails.forEach(function(detail: string) {
            outputString += `\n\u0009  > ${detail}`
        });

        return console.log(outputString, "color: white;", "color: gray", "color: gray");
    }

    export function Warn(message: string, additionalDetails?: string[]) {

        let outputString: string = `%c[WARNING]: %c${message} %c`;

        additionalDetails && additionalDetails.forEach(function(detail: string) {
            outputString += `\n\u0009  > ${detail}`
        });

        return console.log(outputString, "color: yellow;", "color: white", "color: gray");
    }

    export function Error(message: string, additionalDetails?: string) {
        
    }
}