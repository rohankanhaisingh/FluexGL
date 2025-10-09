import { glMatrix, mat4 } from "gl-matrix";

import { Camera } from "./Camera";

export class PerspectiveCamera extends Camera {

    constructor(public fieldOfViewDegrees: number = 60, public aspect: number = 1, public near: number = 0.1, public far: number = 1000) {
        super();
        this.updateMatrices();
    }

    public SetFieldOfViewInDegrees(degrees: number): Camera {

        this.fieldOfViewDegrees = Math.max(1, Math.min(179, degrees));
        return this.updateMatrices();
    }

    public SetNear(near: number): Camera {

        this.near = Math.max(1e-4, near);
        return this.updateMatrices();
    }

    public SetFar(far: number): Camera {

        this.far = Math.max(this.near + 1e-3, far);
        return this.updateMatrices();
    }

    // Private and protected class members.
    
    protected override updateProjection(): Camera {
        
        const verticalFieldOfView: number = glMatrix.toRadian(this.fieldOfViewDegrees);

        mat4.perspective(this.projection, verticalFieldOfView, this.aspect, this.near, this.far);

        return this;
    }
}