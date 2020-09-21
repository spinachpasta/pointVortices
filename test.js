window.onload=function(){
    let canvas = document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.padding = "0px";
    document.body.style.margin = "0px";
    const system=new VortexGroup();
    var line=[];
    for(var x=-200;x<200;x++){
        line.push(system.vortices.length);
        system.add(new Vortex(x,0,1));
    }
    //system.lines.push(line);
    console.log(system);
    /*
    for(var i=0;i<80;i++){
        system.move(1);
    }
    system.draw(ctx,canvas);*/
    
    setInterval(() => {
        system.move(1);
        system.draw(ctx,canvas);
    }, 10);
}
class Vortex {
    constructor(x, y, Gamma) {
        this.x = x;
        this.y = y;
        this.Gamma = Gamma;
    }
    getVelocity(x, y) {
        let dx = this.x - x;
        let dy = this.y - y;
        let rsq = dx * dx + dy * dy;
        const vx = -this.Gamma * dy / (rsq * 2 * Math.PI);
        const vy = this.Gamma * dx / (rsq * 2 * Math.PI);
        return { x: vx, y: vy };
    }
}
class VortexGroup {
    constructor() {
        this.bound={w:window.innerWidth,h:window.innerHeight};
        this.vortices = [];
        this.lines=[];
        this.origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.zoom=1;
    }
    add(vortex) {
        this.vortices.push(vortex);
    }
    getVelocityOfVortex(i){
        const vortex = this.vortices[i];
        return this.getVelocityAt({x:vortex.x,y:vortex.y},i);
    }
    getVelocityAt(r,i) {
        let vx = 0;
        let vy = 0;
        for (var j = 0; j < this.vortices.length; j++) {
            if (j == i) {
                continue;
            }
            const other = this.vortices[j];
            const vel = other.getVelocity(r.x, r.y);
            vx += vel.x;
            vy += vel.y;
        }
        return { x: vx, y: vy };
    }
    move(dt) {
        const next = [];
        for (var i = 0; i < this.vortices.length; i++) {
            const vel = this.getVelocityOfVortex(i);
            next.push(vel);
        }
        for (var i = 0; i < this.vortices.length; i++) {
            this.vortices[i].x += next[i].x * dt;
            this.vortices[i].y += next[i].y * dt;
        }
    }
    transformToCanvas(x,y){
        let x1=x*this.zoom+this.origin.x;
        let y1=y*this.zoom+this.origin.y;
        return {x:x1,y:y1};
    }
    draw(ctx, canvas) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        for (var i = 0; i < this.vortices.length; i++) {
            const vortex = this.vortices[i];
            let x=vortex.x*this.zoom+this.origin.x;
            let y=vortex.y*this.zoom+this.origin.y;
            ctx.fillRect(x - 5, y - 5, 10, 10);
        }
        ctx.strokeStyle="#000";

        for(var l of this.lines){
            ctx.beginPath();
            if(l.length==0){
                continue;
            }
            let r0=this.transformToCanvas(this.vortices[l[0]].x,this.vortices[l[0]].y);
            ctx.moveTo(r0.x,r0.y);
            for(var i=0;i<l.length;i++){
                let r=this.transformToCanvas(this.vortices[l[i]].x,this.vortices[l[i]].y);
                ctx.lineTo(r.x,r.y);
            }
            ctx.stroke();
        }
    }
}