const Gradient = window.Gradient || {};
(function(ns) {
  function generateHexColor() {
    const hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];

    function generateColor() {
      let color = '';
      for (let i = 0; i < 6; i++) {
        const x = Math.round(Math.random() * 14);
        const y = hexValues[x];
        color += y;
      }
      return color;
    }
    return `#${generateColor()}`;
  }

  function generateGradient() {
    const color1 = generateHexColor();
    const color2 = generateHexColor();
    const angle = Math.round(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }

  function randomPredefinedGradient() {
    const gradients = [
      'linear-gradient(179deg, rgb(118, 105, 204), rgb(67, 26, 118))',
      'linear-gradient(106deg, rgb(20, 133, 219), rgb(26, 147, 203))',
      'linear-gradient(108deg, rgb(155, 49, 28), rgb(75, 54, 187))',
      'linear-gradient(341deg, rgb(133, 221, 188), rgb(86, 194, 134))',
      'linear-gradient(132deg, rgb(209, 29, 44), rgb(237, 164, 6))',
      'linear-gradient(75deg, rgb(189, 146, 152), rgb(194, 54, 216))',
      'linear-gradient(38deg, rgb(195, 169, 160), rgb(45, 52, 187))',
      'linear-gradient(313deg, rgb(83, 149, 203), rgb(224, 181, 70))',
      'linear-gradient(210deg, rgb(44, 107, 135), rgb(71, 195, 193))',
      'linear-gradient(177deg, rgb(33, 51, 30), rgb(225, 90, 173))',
      'linear-gradient(101deg, rgb(21, 12, 119), rgb(214, 101, 113))',
      'linear-gradient(357deg, rgb(24, 116, 187), rgb(38, 52, 185))',
      'linear-gradient(105deg, rgb(20, 114, 213), rgb(1, 203, 123))',
    ];

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    return gradients[getRandomInt(gradients.length)];
  }
  ns.random = randomPredefinedGradient;
  ns.generate = generateGradient;
})(Gradient);
