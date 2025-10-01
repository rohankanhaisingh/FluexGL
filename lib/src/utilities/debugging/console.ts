export namespace Debug {

    export function Log(message: string, additionalDetails?: string[]) {

        let outputString: string = `%c[INFO]: %c${message} %c`;

        additionalDetails && additionalDetails.forEach(function(detail: string) {
            outputString += `\n &#9;&#9; > ${detail}`
        });

        return console.log(outputString, "color: white;", "color: gray", "color: yellow")
    }

    export function Warn(message: string, additionalDetails?: string) {

    }

    export function Error(message: string, additionalDetails?: string) {
        
    }
}