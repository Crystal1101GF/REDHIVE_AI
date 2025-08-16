
var c = {
  mouse: {
    X: 0,
    Y: 0 },

  X: function () {return this.mouse.X;},
  Y: function () {return this.mouse.Y;},
  W: function () {return document.documentElement.clientWidth;},
  H: function () {return document.documentElement.clientHeight;},
  relX: function () {return this.X() - this.W() / 2;},
  relY: function () {return this.Y() - this.H() / 2;},
  offX: function () {
    return Math.round(Math.abs(this.relX()) / (this.W() / 2) * 100);
  },
  offY: function () {
    return Math.round(Math.abs(this.relY()) / (this.H() / 2) * 100);
  } };


window.onmousemove = function (evt) {
  c.mouse.X = evt.clientX;
  c.mouse.Y = evt.clientY;
  offX = c.relX() < 0 ? Math.abs(c.offX()) * -1 : c.offX();
  offY = c.relY() < 0 ? Math.abs(c.offY()) * -1 : c.offY();
  document.getElementById('text').style.textShadow = "\
    " + 0.25 * offX + "px " + 0.25 * offY + "px 0px #FF003D,\
    " + 0.5 * offX + "px " + 0.5 * offY + "px 0px #E8003D,\
    " + 0.75 * offX + "px " + 0.75 * offY + "px 0px #E52C50";
};
//# sourceURL=pen.js
    