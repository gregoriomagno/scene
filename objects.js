function Ray(o, d) {
    this.o = o; //origem
    this.d = d; //direção do raio
}

Ray.prototype.show = function() {
    console.log("O" + "(" + this.o.x + "," + this.o.y + "," + this.o.z + "," + this.o.w + ")" + ", d = " + "(" + this.d.x + "," + this.d.y + "," + this.d.z + "," + this.d.w + ")")
}

Ray.prototype.get = function(t) {
    return new Vec3().sum(this.o, this.d.prod(this.d, t));
}


function Vec3() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
}

function Vec3(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vec3.prototype.set = function(v) {
    this.x = v;
    this.y = v;
    this.z = v;
}

Vec3.prototype.set = function(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}
Vec3.prototype.sum = function(p1, p2) {
    return new Vec3(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
}
Vec3.prototype.minus = function(p1, p2) {
    return new Vec3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}
Vec3.prototype.dot = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}
Vec3.prototype.cross = function(p1, p2) {
    return new Vec3(p1.y * p2.z - p1.z * p2.y, -(p1.x * p2.z - p1.z * p2.x), p1.x * p2.y - p1.y * p2.x);
}
Vec3.prototype.module = function(p) {
    return Math.sqrt(this.dot(p, p));
}
Vec3.prototype.div = function(p, k) {
    return new Vec3(p.x / k, p.y / k, p.z / k);
}
Vec3.prototype.prod = function(p, k) {
    return new Vec3(p.x * k, p.y * k, p.z * k);
}
Vec3.prototype.compond = function(p, p0) {
    return new Vec3(p.x * p0.x, p.y * p0.y, p.z * p0.z);
}
Vec3.prototype.unitary = function(p) {
    var m = this.module(p);
    return new Vec3(p.x / m, p.y / m, p.z / m);
}

Vec3.prototype.show = function() {
    console.log("x: " + this.x + ", y: " + this.y + ", z: " + this.z);
}

//ids shape
var sphere = 1;
var plane = 2;
var cylinder =3;
var cube = 4;

function Camera(eye, at, up) {
    this.eye = eye;
    this.at = at;
    this.up = up;
}

function lookAtM(eye, at, up) {
    var F = identity();
    Vec = new Vec3();
    zc = Vec.unitary(Vec.minus(eye, at));
    xc = Vec.unitary(Vec.cross(up, zc));
    yc = Vec.unitary(Vec.cross(zc, xc));
    F[0][0] = xc.x;
    F[0][1] = yc.x;
    F[0][2] = zc.x;

    F[1][0] = xc.y;
    F[1][1] = yc.y;
    F[1][2] = zc.y;

    F[2][0] = xc.z;
    F[2][1] = yc.z;
    F[2][2] = zc.z;

    F[0][3] = eye.x;
    F[1][3] = eye.y;
    F[2][3] = eye.z;
    return F;
}

//TODO: faça função que mapeia de camera para mundo de câmera para mundo e retorne uma matriz 4x4
function lookAtInverseM(eye, at, up) {
    //
}

//de mundo para camera
Camera.prototype.lookAt = function() {
    return lookAtM(this.eye, this.at, this.up);
}

//de câmera para mundo
Camera.prototype.lookAtInverse = function() {
    return lookAtInverseM(this.eye, this.at, this.up);
}

function Shape(type_shape = sphere) {
    this.geometry = type_shape;
    this.name = "";
    this.translate = new Vec3(0, 0, 0);
    this.scale = new Vec3(0, 0, 0);
    this.rotate = new Vec3(0, 0, 0);
    this.color = 0x93C47D
}

function Shape(name, type_shape = sphere) {
    this.geometry = type_shape;
    this.name = name;
    this.translate = new Vec3(0, 0, 0);
    this.scale = new Vec3(0, 0, 0);
    this.rotate = new Vec3(0, 0, 0);
    this.shine = 0.0;
    this.color = 0x93C47D
}


Shape.prototype.setScale = function(x = 0, y = 0, z = 0) {
    this.scale = new Vec3(x, y, z);
}


Shape.prototype.setTranslate = function(x = 0, y = 0, z = 0) {
    this.translate = new Vec3(x, y, z);
}

Shape.prototype.setRotateX = function(angle) {
    this.rotate.x = angle;
}

Shape.prototype.setRotateY = function(angle) {
    this.rotate.y = angle;
}

Shape.prototype.setRotateZ = function(angle) {
    this.rotate.z = angle;
}

Shape.prototype.setColor= function(value) {
    this.color = value
}

Shape.prototype.transformMatrix = function() {
    var T = translateMatrix(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(T, multMatrix(R, S));
}

Shape.prototype.transformMatrixVec = function() {
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(R, S);
}

Shape.prototype.transformMatrixInverse = function() {
    var Ti = translateMatrixI(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, multMatrix(Ri, Ti));
}

Shape.prototype.transformMatrixVecInverse = function() {
    var Ti = translateMatrixI(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, Ri);
}

Shape.prototype.testPlaneIntersection = function(ray) {
    var Vec = new Vec3();
    var n_plane = new Vec3(0, 1, 0);
    var q_plane = new Vec3(0, 0, 0);
    var denominador = Vec.dot(n_plane, ray.d);
    if (denominador != 0) {
        t = Vec.dot(n_plane, Vec.minus(q_plane, ray.o)) / denominador;
        var point = ray.get(t);
        if ((point.x >= -0.5) && (point.x <= 0.5) && (point.z >= -0.5) && (point.z <= 0.5)) {
            return t;
        }
    }

    return undefined;
}
Shape.prototype.testCylinderIntersection = function(ray) {
    var Vec = new Vec3();
    var center = new Vec3(0, 0, 0);
    var axis = new Vec3(0, 1, 0);
    var radius = 0.5;
    var height = 1;
    var a = Vec.dot(ray.d, ray.d) - Math.pow(Vec.dot(ray.d, axis), 2);
    var b = 2 * (Vec.dot(ray.d, Vec.minus(ray.o, center)) - Vec.dot(ray.d, axis) * Vec.dot(Vec.minus(ray.o, center), axis));
    var c = Vec.dot(Vec.minus(ray.o, center), Vec.minus(ray.o, center)) - Math.pow(Vec.dot(Vec.minus(ray.o, center), axis), 2) - Math.pow(radius, 2);
    var discriminant = Math.pow(b, 2) - 4 * a * c;
    if (discriminant < 0) {
        return undefined;
    } else {
        var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        var point1 = ray.get(t1);
        var point2 = ray.get(t2);
        var y1 = Vec.dot(point1, axis);
        var y2 = Vec.dot(point2, axis);
        if ((y1 >= 0) && (y1 <= height) && (y2 >= 0) && (y2 <= height)) {
            return Math.min(t1, t2);
        } else if ((y1 >= 0) && (y1 <= height)) {
            return t1;
        } else if ((y2 >= 0) && (y2 <= height)) {
            return t2;
        } else {
            return undefined;
        }
    }
}

Shape.prototype.getDataIntersection = function(ray_w, normal, point) {
    var Vec = new Vec3();
    var M = this.transformMatrix();
    point = multVec4(M, point);
    M = this.transformMatrixVec();
    normal = multVec4(M, normal);
    normal = Vec.unitary(normal);
    var t_ = Vec.module(Vec.minus(point, ray_w.o));
    return [true, point, normal, t_];
}


Shape.prototype.testCubeIntersection = function(ray) {
    const Vec = new Vec3();
    const planes = [
    {n_plane: new Vec3(0, 1, 0), q_plane: new Vec3(0, 0.5, 0)},
    {n_plane: new Vec3(0, -1, 0), q_plane: new Vec3(0, -0.5, 0)},
    {n_plane: new Vec3(-1, 0, 0), q_plane: new Vec3(-0.5, 0, 0)},
    {n_plane: new Vec3(1, 0, 0), q_plane: new Vec3(0.5, 0, 0)},
    {n_plane: new Vec3(0, 0, -1), q_plane: new Vec3(0, 0, -0.5)},
    {n_plane: new Vec3(0, 0, 1), q_plane: new Vec3(0, 0, 0.5)}
    ];
    for (const {n_plane, q_plane} of planes) {
        const denominador = Vec.dot(n_plane, ray.d);
        if (denominador === 0) continue;
        const t = Vec.dot(n_plane, Vec.minus(q_plane, ray.o)) / denominador;
        const point = ray.get(t);
        if (
            (point.x >= -0.5 && point.x <= 0.5) && 
            (point.y >= -0.5 && point.y <= 0.5) && 
            (point.z >= -0.5 && point.z <= 0.5)
        ) return {t, n_plane};
    }
    
    return {t:undefined};
}
Shape.prototype.testIntersectionRay = function(ray) {
    //salvando raio em coordenadas do mundo para calcular o parâmetro t
    var ray_w = ray;
    var M_i = this.transformMatrixInverse();
    var M_i_v = this.transformMatrixVecInverse();
    var Vec = new Vec3();
    //transformando raio para coordenadas locais do objeto
    Vec = new Vec3();
    ray.d = Vec.minus(ray.d, ray.o);
    ray.o = multVec4(M_i, ray.o);
    ray.d = multVec4(M_i_v, ray.d);

    if (this.geometry == sphere) { //testar interseção com a esfera
        //interseção com esfera na origem e raio unitário
        var a = Vec.dot(ray.d, ray.d);
        var b = 2 * (Vec.dot(ray.d, ray.o));
        var c = Vec.dot(ray.o, ray.o) - 1;
        var delta = b * b - 4 * a * c;
        if (delta >= 0) {
            var t1 = (-b + Math.sqrt(delta)) / (2 * a);
            var t2 = (-b - Math.sqrt(delta)) / (2 * a);
            t = Math.min(t1, t2);
            var point = ray.get(t);
            var normal = point;

            return this.getDataIntersection(ray_w, normal, point)
        }

    } else if (this.geometry == plane) {
        t = this.testPlaneIntersection(ray)
        if (t !== undefined) {
            var point = ray.get(t);
            var normal = new Vec3(0, 1, 0);
            return this.getDataIntersection(ray_w, normal, point)
        }

    }
    else if (this.geometry == cylinder) {
         //interseção com cilindro na origem e raio unitário
         t = this.testCylinderIntersection(ray)
         if (t !== undefined) {
            // var center = new Vec3(0, 0, 0); // centro do cilindro
            // var direction = Vec3.minus(point, center); // vetor do centro até o ponto de interseção
            // var normal =  Vec3.normalize(direction);
            var normal = new Vec3(0, 1, 0);
            var point = ray.get(t);
            return this.getDataIntersection(ray_w, normal, point);
         }
        
        }
        else if (this.geometry === cube) {
            const {t, n_plane} = this.testCubeIntersection(ray)
            if (t !== undefined) {
                const point = ray.get(t);
                return this.getDataIntersection(ray_w, n_plane, point)
            }
        }
        
        
    return [false, null];
}