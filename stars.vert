attribute vec4 a_position;

varying float alpha;

void main() {
    gl_Position = a_position;
    gl_PointSize = 1.0;
    alpha = (a_position.y + 1.0) / 2.0;
}