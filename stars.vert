attribute vec4 a_position;

varying vec4 v_color;

void main() {
    gl_Position = a_position;
    gl_PointSize = 1.0;
    float alpha = (a_position.y + 1.0) / 2.0;
    v_color = vec4(1.0,1.0,1.0,alpha);
}