import { v4 } from "uuid";

import { ThreadEventMap, ThreadEvents } from "../../typings";

export class Thread {

    public id: string = v4();

    public simulationUpdateRate: number = 60;
    public frameRate: number = 0;
    public deltaTime: number = 0;

    public currentRegisteredTimestamp: number = Date.now();
    public lastRegisteredTimestamp: number = Date.now();

    public events: ThreadEvents = {
        "idle": [],
        "start": [],
        "stop": [],
        "update": []
    };

    public isActive: boolean = false;

    private animationFrame: number = 0;
    private times: number[] = [];

    private loop(time: number) {

        this.animationFrame = window.requestAnimationFrame((_time: number) => this.loop(_time));

        const now: number = Date.now();

        this.deltaTime = (now - this.lastRegisteredTimestamp) / (1000 / this.simulationUpdateRate);
        this.lastRegisteredTimestamp = now;

        while(this.times.length > 0 && this.times[0] <= now - 1000)
            this.times.shift();

        this.times.push(now);
        this.frameRate = this.times.length;
    }

    public StartLoop() {

        if(!this.isActive)
            return console.warn("Could not start thread loop since the loop is already active.");



        // Fire start event.
        this.events["start"].forEach(ev => ev());
    }

    public StopLoop() {

    }

    public AddEventListener<K extends keyof ThreadEventMap>(event: K, cb: ThreadEventMap[K]) {
        
        this.events[event].push(cb);
    }

    public RemoveEventListener<K extends keyof ThreadEventMap>(event: K, cb: ThreadEventMap[K]) {
        
        for(let i = 0; i < this.events[event].length; i++) {
            if(this.events[event][i] === cb) 
                this.events[event].splice(i, 1);
        }
    }
}